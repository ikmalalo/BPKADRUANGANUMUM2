/**
 * record-portrait.js
 * Script standalone untuk merekam semua slide preview portrait menjadi MP4 9:16
 * 
 * Cara pakai:
 *   node record-portrait.js
 *   node record-portrait.js --url http://localhost:5173/preview-vertikal
 *   node record-portrait.js --url https://bpkadruanganumum.vercel.app/preview-vertikal
 * 
 * Output: preview-portrait-YYYY-MM-DD.mp4 di folder yang sama
 */

const puppeteer = require('puppeteer');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
const path = require('path');
const os = require('os');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// --- Config ---
const args = process.argv.slice(2);
const urlArg = args.find(a => a.startsWith('--url='))?.split('=')[1]
  || (args[args.indexOf('--url') + 1])
  || null;

const TARGET_URL = urlArg || 'http://localhost:5173/preview-vertikal';
const SLIDE_DURATION_MS = 15000;    // durasi per slide dalam rekaman (disamakan dengan frontend 15 detik)
const OUTPUT_FPS = 30;              // fps output video -> 30 fps supaya smooth
const CAPTURE_INTERVAL_MS = Math.floor(1000 / OUTPUT_FPS); // ~33ms per frame
const WIDTH = 450;                  // portrait 9:16 width
const HEIGHT = 800;                 // portrait 9:16 height
// -----------------

const framesPerSlide = Math.round(SLIDE_DURATION_MS / CAPTURE_INTERVAL_MS);
const downloadsFolder = path.join(os.homedir(), 'Downloads');
const timestamp = new Date().toISOString().slice(0, 10) + '-' + new Date().getHours() + new Date().getMinutes();
const outputFile = path.join(downloadsFolder, `preview-portrait-${timestamp}.mp4`);

async function main() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portrait-record-'));
  console.log(`\n🎬 Mulai rekam preview portrait...`);
  console.log(`📄 URL: ${TARGET_URL}`);
  console.log(`📁 Temp dir: ${tmpDir}`);
  console.log(`⏱  Durasi per slide: ${SLIDE_DURATION_MS}ms`);
  console.log(`🎥 Target FPS: ${OUTPUT_FPS} (interval ${CAPTURE_INTERVAL_MS}ms)`);
  console.log('─'.repeat(50));

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        `--window-size=${WIDTH},${HEIGHT}`
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });

    // Buka halaman dalam mode puppet (sembunyikan tombol UI)
    const puppetUrl = TARGET_URL.includes('?')
      ? `${TARGET_URL}&puppet=1`
      : `${TARGET_URL}?puppet=1`;

    console.log(`\n🌐 Membuka halaman...`);
    await page.goto(puppetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    // Tunggu loading spinner hilang
    console.log(`⏳ Menunggu data dimuat...`);
    await page.waitForFunction(() => {
      const spinner = document.querySelector('.animate-spin');
      return !spinner;
    }, { timeout: 45000 }).catch(() => {
      console.log('  ⚠️  Loading timeout / tidak ada spinner, lanjut...');
    });

    // Tunggu ekstra agar animasi masuknya selesai (jika ada)
    await new Promise(r => setTimeout(r, 6000));

    // Hitung jumlah slide via window.__SLIDE_COUNT__ atau dots
    const totalSlides = await page.evaluate(() => {
      if (window.__SLIDE_COUNT__ && window.__SLIDE_COUNT__ > 0) return window.__SLIDE_COUNT__;
      return document.querySelectorAll('[data-slide-dot]').length;
    });

    if (totalSlides === 0) {
      console.error('❌ Tidak ada slide yang terdeteksi!');
      console.error('   Pastikan halaman bisa diakses dan data agenda tersedia.');
      await browser.close();
      fs.rmSync(tmpDir, { recursive: true, force: true });
      process.exit(1);
    }

    console.log(`✅ Total slide: ${totalSlides}`);
    console.log(`🎞  Frames per slide: ${framesPerSlide}`);
    console.log(`📸 Total capture: ${totalSlides * framesPerSlide} frames`);
    console.log('─'.repeat(50));

    let frameIndex = 0;

    for (let slideIdx = 0; slideIdx < totalSlides; slideIdx++) {
      // Klik dot untuk pindah ke slide ini
      await page.evaluate((idx) => {
        const dots = document.querySelectorAll('[data-slide-dot]');
        if (dots[idx]) dots[idx].click();
      }, slideIdx);

      // Tunggu transisi masuk agar sinkron dengan durasi awal
      await new Promise(r => setTimeout(r, 500));

      process.stdout.write(`  📷 Catching Slide ${slideIdx + 1}/${totalSlides} `);

      for (let f = 0; f < framesPerSlide; f++) {
        const startCap = Date.now();
        
        // Sinkronisasi progress bar di web dengan frame recording
        await page.evaluate((currentFrame, totalFrames) => {
          if (typeof window.__SET_PROGRESS === 'function') {
            window.__SET_PROGRESS((currentFrame / totalFrames) * 100);
          }
        }, f + 1, framesPerSlide);

        // Gunakan JPEG kualitas 90 agar speed capture kencang (lebih mulus)
        const framePath = path.join(tmpDir, `frame_${String(frameIndex).padStart(6, '0')}.jpg`);
        await page.screenshot({ path: framePath, type: 'jpeg', quality: 90 });
        frameIndex++;
        
        const elapsed = Date.now() - startCap;
        const remainder = Math.max(0, CAPTURE_INTERVAL_MS - elapsed);
        if (remainder > 0) {
          await new Promise(r => setTimeout(r, remainder));
        }

        if ((f + 1) % 15 === 0) process.stdout.write('.');
      }
      console.log(` ✓`);
    }

    await browser.close();
    browser = null;

    console.log('─'.repeat(50));
    console.log(`\n🎬 Encoding ${frameIndex} frames → MP4...`);

    // Tambahan fps flag supaya input fps dan output fps match dan konsisten
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(path.join(tmpDir, 'frame_%06d.jpg'))
        .inputFPS(OUTPUT_FPS)
        .outputOptions([
          `-vf scale=${WIDTH * 2}:${HEIGHT * 2}`,
          '-c:v libx264',
          '-preset fast',
          '-crf 22',
          '-pix_fmt yuv420p',
          `-r ${OUTPUT_FPS}`,
          '-movflags +faststart'
        ])
        .output(outputFile)
        .on('progress', (p) => {
          if (p.percent) process.stdout.write(`\r  ⚙️  Encoding: ${Math.round(p.percent)}%   `);
        })
        .on('end', () => { console.log('\r  ✅ Encoding selesai!              '); resolve(null); })
        .on('error', reject)
        .run();
    });

    fs.rmSync(tmpDir, { recursive: true, force: true });

    const sizeMB = (fs.statSync(outputFile).size / 1024 / 1024).toFixed(1);
    console.log('─'.repeat(50));
    console.log(`\n✅ Video tersimpan!`);
    console.log(`📂 File: ${outputFile}`);
    console.log(`📦 Ukuran: ${sizeMB} MB`);
    console.log(`🎥 Format: MP4 Portrait 9:16 (${WIDTH * 2}×${HEIGHT * 2}px @ ${OUTPUT_FPS}fps)`);
    console.log(`⏱  Durasi: ~${Math.round((totalSlides * SLIDE_DURATION_MS) / 1000)} detik\n`);

  } catch (err) {
    console.error('\n❌ Error:', err.message);
    if (browser) await browser.close().catch(() => {});
    fs.rmSync(tmpDir, { recursive: true, force: true });
    process.exit(1);
  }
}

main();
