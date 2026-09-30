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
-- Table structure for table `pokemon_gimmicks`
--

CREATE TABLE `pokemon_gimmicks` (
  `id` int NOT NULL,
  `gimmick_name` varchar(25) NOT NULL,
  `gimmick_desc` varchar(255) NOT NULL,
  `gimmick_gen` tinyint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `pokemon_gimmicks`
--

INSERT INTO `pokemon_gimmicks` (`id`, `gimmick_name`, `gimmick_desc`, `gimmick_gen`) VALUES
(1, 'Mega', 'This form is triggered by having the Player having a Key Stone in their inventory along side a Pokemon wielding a Mega Stone. Stats are drastically increased upon Mega Evolving.', 6),
(2, 'Z-Moves', 'Gives a boost to an existing move that a Pokemon has and can be triggered by having said Pokemon wield a Z-Crystal with that associated type.', 7),
(3, 'Dynamax', 'A temporary transformation increasing a Pokémon\'s stats and size. Can only be used once per battle and ends after 3 turns or the Pokémon is switched out.', 8),
(4, 'Gigantimax', 'Gigantamaxing increases a Pokémon\'s size drastically and its HP in battle, like Dynamaxing. Only certain species of Pokémon can Gigantamax, and when they do, their appearance changes significantly, unlike regular Dynamaxing and most similarly to Mega Evolution.', 8),
(5, 'Alpha', 'Alpha Pokemon are larger than usual and have increased battle capabilities, often sporting a higher level, moves they cannot learn by Level Up, high IVs in at least 3 stats, and, upon battling them, are fueled with Wild Might.', 8),
(6, 'Terastallization', 'Terastallizing gives the Pokémon a gem-like luster and changes its type, giving it a type-associated crown. To Terastallize a Pokemon, the Player must have a Tera Orb, and their Pokemon must be holding a Tera Shard.', 9),
(7, 'Paradox (Future)', 'Paradox Pokemon are unique, sporting new abilities shared along each type (Quark Drive for Future Paradox Pokemon), new typing, new movesets, and often new stats.', 9),
(8, 'Paradox (Past)', 'Paradox Pokemon are unique, sporting new abilities shared along each type (Protosynthesis for Past Paradox Pokemon), new typing, new movesets, and often new stats.', 9);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `pokemon_gimmicks`
--
ALTER TABLE `pokemon_gimmicks`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `pokemon_gimmicks`
--
ALTER TABLE `pokemon_gimmicks`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
