-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: student-databases.cvode4s4cwrc.us-west-2.rds.amazonaws.com
-- Generation Time: Apr 15, 2026 at 06:08 PM
-- Server version: 8.0.42
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `JENNAWALLACE`
--

-- --------------------------------------------------------

--
-- Table structure for table `pokemon_types`
--

CREATE TABLE `pokemon_types` (
  `id` int NOT NULL,
  `name` varchar(10) NOT NULL,
  `weakness1` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `weakness2` varchar(10) DEFAULT NULL,
  `weakness3` varchar(10) DEFAULT NULL,
  `weakness4` varchar(10) DEFAULT NULL,
  `weakness5` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `strength1` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `strength2` varchar(10) DEFAULT NULL,
  `strength3` varchar(10) DEFAULT NULL,
  `strength4` varchar(10) DEFAULT NULL,
  `strength5` varchar(10) DEFAULT NULL,
  `no_effect1` varchar(10) DEFAULT NULL,
  `no_effect2` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `pokemon_types`
--

INSERT INTO `pokemon_types` (`id`, `name`, `weakness1`, `weakness2`, `weakness3`, `weakness4`, `weakness5`, `strength1`, `strength2`, `strength3`, `strength4`, `strength5`, `no_effect1`, `no_effect2`) VALUES
(1, 'Normal', 'Fighting', NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 'Ghost', NULL),
(2, 'Fire', 'Water', 'Ground', 'Rock', NULL, NULL, 'Grass', 'Ice', 'Bug', 'Steel', NULL, NULL, NULL),
(3, 'Water', 'Electric', 'Grass', NULL, NULL, NULL, 'Fire', 'Ground', 'Rock', NULL, NULL, NULL, NULL),
(4, 'Electric', 'Ground', NULL, NULL, NULL, NULL, 'Water', 'Flying', NULL, NULL, NULL, NULL, NULL),
(5, 'Grass', 'Fire', 'Ice', 'Poison', 'Flying', 'Bug', 'Water', 'Ground', 'Rock', NULL, NULL, NULL, NULL),
(6, 'Ice', 'Fire', 'Fighting', 'Rock', 'Steel', NULL, 'Grass', 'Ground', 'Flying', 'Dragon', NULL, NULL, NULL),
(7, 'Fighting', 'Flying', 'Psychic', 'Fairy', NULL, NULL, 'Normal', 'Ice', 'Rock', 'Dark', 'Steel', 'Ghost', NULL),
(8, 'Poison', 'Ground', 'Psychic', NULL, NULL, NULL, 'Grass', 'Fairy', NULL, NULL, NULL, 'Steel', NULL),
(9, 'Ground', 'Water', 'Grass', 'Ice', NULL, NULL, 'Fire', 'Electric', 'Poison', 'Rock', 'Steel', 'Flying', NULL),
(10, 'Flying', 'Electric', 'Ice', 'Rock', NULL, NULL, 'Grass', 'Fighting', 'Bug', NULL, NULL, NULL, NULL),
(11, 'Psychic', 'Bug', 'Ghost', 'Dark', NULL, NULL, 'Fighting', 'Ground', NULL, NULL, NULL, 'Dark', NULL),
(12, 'Bug', 'Fire', 'Flying', 'Rock', NULL, NULL, 'Grass', 'Psychic', 'Dark', NULL, NULL, NULL, NULL),
(13, 'Rock', 'Water', 'Grass', 'Fighting', 'Ground', 'Steel', 'Fire', 'Ice', 'Flying', 'Bug', NULL, NULL, NULL),
(14, 'Ghost', 'Ghost', 'Dark', NULL, NULL, NULL, 'Psychic', 'Ghost', NULL, NULL, NULL, NULL, NULL),
(15, 'Dragon', 'Ice', 'Dragon', 'Fairy', NULL, NULL, 'Ghost', NULL, NULL, NULL, NULL, 'Fairy', NULL),
(16, 'Dark', 'Fighting', 'Bug', 'Fairy', NULL, NULL, 'Psychic', 'Rock', NULL, NULL, NULL, NULL, NULL),
(17, 'Steel', 'Fire', 'Fighting', 'Ground', NULL, NULL, 'Ice', 'Rock', 'Fairy', NULL, NULL, NULL, NULL),
(18, 'Fairy', 'Poison', 'Steel', NULL, NULL, NULL, 'Fighting', 'Ghost', 'Dragon', NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `pokemon_types`
--
ALTER TABLE `pokemon_types`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `pokemon_types`
--
ALTER TABLE `pokemon_types`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
