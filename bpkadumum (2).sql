-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 25, 2026 at 04:03 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bpkadumum`
--

-- --------------------------------------------------------

--
-- Table structure for table `agenda_ruangan`
--

CREATE TABLE `agenda_ruangan` (
  `id` int NOT NULL,
  `hari` varchar(50) NOT NULL,
  `tanggal` varchar(100) NOT NULL,
  `tempat` varchar(255) NOT NULL,
  `pukul` varchar(50) NOT NULL,
  `acara` text NOT NULL,
  `pelaksana` varchar(255) NOT NULL,
  `dihadiri` varchar(255) DEFAULT NULL,
  `status` enum('Berlangsung','Terjadwal') NOT NULL DEFAULT 'Terjadwal',
  `type` enum('BPKAD','PEMKOT') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `agenda_ruangan`
--

INSERT INTO `agenda_ruangan` (`id`, `hari`, `tanggal`, `tempat`, `pukul`, `acara`, `pelaksana`, `dihadiri`, `status`, `type`, `created_at`, `updated_at`) VALUES
(2, 'KAMIS', '5 FEBRUARI 2026', 'RUANG RAPAT MAHAKAM (LT 4)', '09:00 - SELESAI', 'RAPAT PAPARAN KONSEP BISNIS BEBAYA MART OLEH VARIA NIAGA', 'BAGIAN KERJASAMA', NULL, 'Terjadwal', 'BPKAD', '2026-03-16 05:58:03', '2026-03-16 05:58:03'),
(3, 'RABU', '25 OKTOBER 2025', 'RUANG RAPAT UTAMA LT.2', '09:00', 'RAPAT KOORDINASI SMART CITY', 'DINAS KOMINFO', NULL, 'Berlangsung', 'BPKAD', '2026-03-16 05:58:03', '2026-03-16 06:29:08'),
(4, 'SENIN', '2 FEBRUARI 2026', 'BALAI KOTA SAMARINDA', '09:00 - 12:00', 'RAPAT KOORDINASI PEMERINTAH KOTA SAMARINDA', 'SEKRETARIAT DAERAH', 'Wali Kota Samarinda', 'Terjadwal', 'PEMKOT', '2026-03-16 05:58:03', '2026-03-16 05:58:03'),
(5, 'SELASA', '3 FEBRUARI 2026', 'RUANG RAPAT WALIKOTA', '13:00 - 15:00', 'EVALUASI PROGRAM PEMBANGUNAN KOTA', 'BAPPEDA', 'Wali Kota & Wakil Wali Kota', 'Terjadwal', 'PEMKOT', '2026-03-16 05:58:03', '2026-03-16 05:58:03'),
(6, 'JUMAT', 'Jumat, 13 Mar 2026', 'Ruang Rapat Sekretariat TAPD (Lt 4)', '11:11 - Selesai', 'asdasdjjjj', 'asdj', NULL, 'Berlangsung', 'BPKAD', '2026-03-16 06:22:08', '2026-03-17 00:57:18'),
(7, 'RABU', 'Rabu, 04 Mar 2026', 'Pemkot1', '12:12 - 12:12', 'bukber', 'bag.ekonomi', 'walkot smd', 'Terjadwal', 'PEMKOT', '2026-03-16 06:22:49', '2026-03-16 06:22:49'),
(8, 'KAMIS', 'Kamis, 05 Mar 2026', 'Walkot9292', '12:23 - 03:02', 'as12313', 'Ikmal', 'Pemkotcuy', 'Terjadwal', 'PEMKOT', '2026-03-16 06:25:16', '2026-03-16 06:25:16'),
(10, 'RABU', 'Rabu, 25 Mar 2026', 'Ruang Rapat Nusantara (Lt 3)', '10:19 - Selesai', 'asdas', 'asdsad', NULL, 'Terjadwal', 'BPKAD', '2026-03-17 01:19:35', '2026-03-17 01:20:05');

-- --------------------------------------------------------

--
-- Table structure for table `sertifikat`
--

CREATE TABLE `sertifikat` (
  `id` int NOT NULL,
  `nama_penerima` varchar(255) NOT NULL,
  `penghargaan` varchar(255) NOT NULL,
  `tanggal_upload` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `foto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'admin',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`) VALUES
(1, 'admin', 'admin', 'admin', '2026-03-16 06:32:32');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agenda_ruangan`
--
ALTER TABLE `agenda_ruangan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sertifikat`
--
ALTER TABLE `sertifikat`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `agenda_ruangan`
--
ALTER TABLE `agenda_ruangan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `sertifikat`
--
ALTER TABLE `sertifikat`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
