-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 28, 2020 at 07:28 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `phplogin`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `username`, `password`, `email`) VALUES
(1, 'test', '$2y$10$SfhYIDtn.iOuCW7zfoFLuuZHX6lja4lF4XA4JqNmpiH/.P3zB8JCa', 'test@test.com'),
(4, 'asfgasf', '$2y$10$cS0GXFSfMAbRgpXIFXfbaucgIuB2.8arcWR5O5e/kd3S49fKcDC0K', 'abc@gmail.com'),
(5, 'asfdasgasg', '$2y$10$JMBq1JfSDXXBYstzUE1vM.3QKq6SpFuEgV2JTgTVDJZvoxGb8tp/i', 'asgasgas@gmail.com'),
(6, 'asfdasgasg', '$2y$10$fMgvM0ZC4KI.yS57.Qld0u61GG3lNmuUUewm9Oq19LYzA6Ec4aMly', 'asgasgas@gmail.com'),
(7, 'asfdasgasg', '$2y$10$es0zE5jt43sSvSaOfa7PTuY2hL97mPKBotqA6cKIltbxhWKItRMY6', 'asgasgas@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `decks`
--

CREATE TABLE `decks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `deck` text CHARACTER SET utf8 DEFAULT NULL,
  `extra_deck` text CHARACTER SET utf8 DEFAULT NULL,
  `name` text CHARACTER SET utf8 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `decks`
--

INSERT INTO `decks` (`id`, `user_id`, `deck`, `extra_deck`, `name`) VALUES
(5, 1, 'Zoodiac Barrage,Zoodiac Barrage,Zoodiac Barrage', 'Zoodiac Hammerkong,Zoodiac Hammerkong,Zoodiac Hammerkong,Zoodiac Drident', 'Zoodiac'),
(6, 1, 'Zoodiac Barrage,Zoodiac Kataroost,Zoodiac Barrage,Zoodiac Kataroost,Zoodiac Barrage,Zoodiac Kataroost', 'Zoodiac Boarbow,Zoodiac Chakanine,Zoodiac Boarbow,Zoodiac Broadbull,Zoodiac Broadbull,Zoodiac Boarbow,Zoodiac Broadbull,Zoodiac Chakanine,Zoodiac Chakanine', 'zoo 2'),
(7, 1, 'Zoodiac Barrage,Zoodiac Kataroost,Zoodiac Barrage,Zoodiac Kataroost,Zoodiac Barrage,Zoodiac Kataroost', 'Zoodiac Boarbow,Zoodiac Chakanine,Zoodiac Boarbow,Zoodiac Broadbull,Zoodiac Broadbull,Zoodiac Boarbow,Zoodiac Broadbull,Zoodiac Chakanine,Zoodiac Chakanine', 'zoo 3'),
(8, 1, 'Zoodiac Barrage,Zoodiac Barrage,Zoodiac Barrage', '', 'asd');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `decks`
--
ALTER TABLE `decks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `decks`
--
ALTER TABLE `decks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `decks`
--
ALTER TABLE `decks`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `accounts` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
