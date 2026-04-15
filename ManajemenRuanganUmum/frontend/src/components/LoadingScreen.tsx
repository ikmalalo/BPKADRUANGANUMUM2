import React, { useEffect, useState, useRef } from 'react';
import logo from '../assets/images/logo.png';

declare global {
  interface Window {
    VANTA: any;
  }
}

const LoadingScreen: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const vantaRef = useRef<HTMLDivElement>(null);
    const [vantaEffect, setVantaEffect] = useState<any>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });
        }, 25); // 100 * 25ms = 2500ms (approx 2.5s for progress bar)

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!vantaEffect && vantaRef.current && window.VANTA) {
            try {
                setVantaEffect(
                    window.VANTA.BIRDS({
                        el: vantaRef.current,
                        mouseControls: true,
                        touchControls: true,
                        gyroControls: false,
                        minHeight: 200.00,
                        minWidth: 200.00,
                        scale: 1.00,
                        scaleMobile: 1.00,
                        backgroundColor: 0xffffff,
                        color1: 0xff6a00,
                        color2: 0xff9d00,
                        colorMode: "lerp",
                        birdSize: 1.20,
                        wingSpan: 25.00,
                        separation: 60.00,
                        alignment: 50.00,
                        cohesion: 50.00,
                        quantity: 3.00,
                        speed: 3.00,
                    })
                );
            } catch (error) {
                console.warn("Vanta.js failed to initialize:", error);
            }
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    return (
        <div ref={vantaRef} className="fixed inset-0 z-[9999] flex flex-col items-center justify-center font-poppins select-none">
            {/* Top Information */}
            <div className="absolute top-8 left-8 flex flex-col gap-1">
                <span className="text-[12px] font-semibold text-gray-600">BPKAD Kota Samarinda</span>
            </div>
            
            

            {/* Center Content */}
            <div className="flex flex-col items-center gap-12 max-w-lg w-full px-8">
                {/* Logo Box */}
                <div className="relative group">
                    <div className="relative w-64 h-64 bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center overflow-hidden shadow-xl shadow-orange-100">
                        <img 
                            src={logo} 
                            alt="Logo BPKAD" 
                            className="w-56 h-56 object-contain"
                        />
                    </div>
                </div>

                {/* Progress Section */}
                <div className="w-full space-y-6">
                    {/* Progress Bar Container */}
                    <div className="relative h-[2px] w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full blur-md opacity-30"></div>
                        </div>
                    </div>

                    {/* Loading Text */}
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="text-lg font-medium tracking-wide text-gray-800 animate-pulse">
                            Menyiapkan Portal Layanan...
                        </h2>
                        <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase font-light">
                            SISTEM INFORMASI TERPADU SAMARINDA
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Dots */}
            <div className="absolute bottom-12 flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500/60 animate-loading-dot" style={{ animationDelay: '0s' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500/60 animate-loading-dot" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500/60 animate-loading-dot" style={{ animationDelay: '0.4s' }}></div>
            </div>
        </div>
    );
};

export default LoadingScreen;
