-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 17, 2025 at 07:19 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `catering`
--

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `order_number` varchar(25) NOT NULL,
  `booking_status` varchar(15) NOT NULL,
  `booking_date` datetime NOT NULL,
  `program_date` date NOT NULL,
  `place_id` int(11) NOT NULL,
  `program` varchar(45) NOT NULL,
  `discount` int(11) DEFAULT NULL,
  `grand_total` int(11) NOT NULL,
  `final_total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`order_id`, `customer_id`, `order_number`, `booking_status`, `booking_date`, `program_date`, `place_id`, `program`, `discount`, `grand_total`, `final_total`) VALUES
(7, 2, 'r-1', 'confirmed', '2025-04-18 14:56:37', '2025-04-20', 2, 'Big Event', 10, 560, 504.00),
(8, 2, '96EEH6IK', 'pending', '2025-04-20 17:39:26', '2025-04-22', 2, 'Birthday', 0, 20, NULL),
(15, 2, 'YU0XHN61', 'confirmed', '2025-04-21 14:39:49', '2025-04-16', 5, 'Anniversary', 0, 230, NULL),
(16, 2, '8YQCL22A', 'cancelled', '2025-04-24 16:18:22', '2025-04-30', 2, 'Corporate Event', 0, 20, 20.00),
(17, 2, 'C6GBYIOJ', 'confirmed', '2025-04-24 16:21:23', '2025-04-30', 5, 'Corporate Event', 10, 20, 18.00),
(18, 2, 'UEPS800W', 'confirmed', '2025-05-01 17:29:40', '2025-05-01', 2, 'Birthday', 10, 90, 81.00),
(19, 2, 'PSUW82I7', 'pending', '2025-05-07 17:40:49', '2025-05-10', 2, 'Birthday', 0, 700, NULL),
(20, 2, 'QGQT7PLZ', 'confirmed', '2025-05-07 17:44:34', '2025-05-11', 3, 'Corporate Event', 10, 1050, 945.00),
(21, 2, '451ZZQ7V', 'pending', '2025-05-12 08:56:15', '2025-05-15', 3, 'Anniversary', 0, 600, NULL),
(22, 2, '69BPVTTQ', 'confirmed', '2025-05-13 06:40:31', '2025-05-20', 2, 'Birthday', 10, 1500, 1350.00);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(50) NOT NULL,
  `category_status` varchar(50) NOT NULL,
  `category_date_created` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_id`, `category_name`, `category_status`, `category_date_created`) VALUES
(13, 'Appetizers', 'active', '2025-04-17'),
(14, 'Main Course', 'active', '2025-04-17'),
(17, 'Desserts', 'active', '2025-04-17'),
(19, 'Beverages', 'active', '2025-04-17');

-- --------------------------------------------------------

--
-- Table structure for table `food_request`
--

CREATE TABLE `food_request` (
  `request_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `request_status` varchar(15) NOT NULL,
  `request_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `food_request`
--

INSERT INTO `food_request` (`request_id`, `user_id`, `booking_id`, `request_status`, `request_date`) VALUES
(1, 12, 20, 'Donated', '2025-05-09 16:09:10'),
(2, 12, 22, 'Donated', '2025-05-13 06:43:40');

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE `item` (
  `item_id` int(10) NOT NULL,
  `category_id` int(10) NOT NULL,
  `item_name` varchar(45) NOT NULL,
  `item_image` varchar(50) DEFAULT NULL,
  `item_description` text NOT NULL,
  `item_price` varchar(10) NOT NULL,
  `item_status` varchar(10) NOT NULL,
  `item_date_create` datetime NOT NULL DEFAULT current_timestamp(),
  `item_measure` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item`
--

INSERT INTO `item` (`item_id`, `category_id`, `item_name`, `item_image`, `item_description`, `item_price`, `item_status`, `item_date_create`, `item_measure`) VALUES
(6, 13, 'Paneer Tikka', 'paneer_tikka.jpg', 'Marinated paneer cubes grilled in a tandoor', '150.00', 'active', '2025-04-17 20:05:18', 'per 6 pcs'),
(7, 13, 'Hara Bhara Kabab', 'hara_bhara_kabab.jpg', 'Spinach and green peas cutlets', '130.00', 'active', '2025-04-17 20:05:18', 'per 4 pcs'),
(8, 13, 'Chicken Seekh Kabab', 'chicken_seekh.jpg', 'Minced chicken skewers with spices', '180.00', 'active', '2025-04-17 20:05:18', 'per 2 pcs'),
(9, 14, 'Dal Makhani', 'dal_makhani.jpg', 'Creamy black lentils slow-cooked with butter', '200.00', 'active', '2025-04-17 20:16:05', 'per portion'),
(10, 14, 'Mutton Rogan Josh', 'rogan_josh.jpg', 'Spicy Kashmiri mutton curry', '350.00', 'active', '2025-04-17 20:16:05', 'per portion'),
(11, 14, 'Paneer Lababdar', '1745853483098-74543060.jpeg', 'Paneer in a tangy tomato and onion-based gravy', '240.00', 'active', '2025-04-17 20:16:05', 'per portion'),
(12, 17, 'Gajar Halwa', 'gajar_halwa.jpg', 'Sweet carrot pudding with khoya and nuts', '70.00', 'active', '2025-04-17 20:20:34', 'per bowl'),
(13, 17, 'Kaju Katli', 'kaju_katli.jpg', 'Thin diamond-shaped cashew sweets', '90.00', 'active', '2025-04-17 20:20:34', 'per 4 pcs'),
(14, 17, 'Phirni', 'phirni.jpg', 'Ground rice pudding served chilled in earthen pots', '60.00', 'active', '2025-04-17 20:20:34', 'per cup'),
(15, 19, 'Masala Chaas', '1745853496315-3105817.jpeg', 'Spiced buttermilk with cumin and coriander', '25.00', 'active', '2025-04-17 20:21:30', 'per glass'),
(16, 19, 'Thandai', 'thandai.jpg', 'Cooling milk drink with nuts and saffron', '40.00', 'active', '2025-04-17 20:21:30', 'per glass'),
(17, 19, 'Nimbu Pani', '1745853382004-408709496.jpg', 'Classic Indian lemonade with a pinch of salt and mint', '20.00', 'active', '2025-04-17 20:21:30', 'per glass');

-- --------------------------------------------------------

--
-- Table structure for table `order_temp`
--

CREATE TABLE `order_temp` (
  `temp_id` int(11) NOT NULL,
  `order_number` varchar(25) NOT NULL,
  `item_id` int(11) NOT NULL,
  `item_quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_temp`
--

INSERT INTO `order_temp` (`temp_id`, `order_number`, `item_id`, `item_quantity`) VALUES
(1, 'r-1', 6, 2),
(2, 'r-1', 7, 2),
(11, 'HCEOVPY2', 17, 2),
(12, '9TJZVBGN', 15, 2),
(13, 'KINKV2FO', 16, 1),
(14, 'KZZIPK8D', 17, 2),
(15, '2FVP821E', 16, 2),
(16, 'WD6M9851', 17, 1),
(17, 'YU0XHN61', 17, 1),
(18, 'YU0XHN61', 12, 3),
(20, '8YQCL22A', 17, 1),
(21, 'C6GBYIOJ', 17, 1),
(23, 'UEPS800W', 17, 2),
(24, 'UEPS800W', 15, 2),
(25, 'PSUW82I7', 12, 10),
(26, 'QGQT7PLZ', 12, 15),
(27, '451ZZQ7V', 17, 30),
(28, '69BPVTTQ', 6, 10);

-- --------------------------------------------------------

--
-- Table structure for table `place`
--

CREATE TABLE `place` (
  `place_id` int(11) NOT NULL,
  `place_name` varchar(50) NOT NULL,
  `place_status` varchar(30) NOT NULL,
  `place_date_created` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `place`
--

INSERT INTO `place` (`place_id`, `place_name`, `place_status`, `place_date_created`) VALUES
(2, 'Nanthoor', 'active', '2025-04-08'),
(3, 'Bendorwell', 'active', '2025-04-08'),
(5, 'Kavoor', 'inactive', '2025-04-09'),
(6, 'Padil, Mangalore', 'active', '2025-05-13');

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `supplier_id` int(11) NOT NULL,
  `place_id` int(11) NOT NULL,
  `supplier_name` varchar(30) NOT NULL,
  `supplier_gstin` varchar(30) NOT NULL,
  `supplier_phoneno` int(15) NOT NULL,
  `supplier_address` varchar(50) NOT NULL,
  `supplier_date_created` date NOT NULL DEFAULT current_timestamp(),
  `supplier_status` enum('active','inactive') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`supplier_id`, `place_id`, `supplier_name`, `supplier_gstin`, `supplier_phoneno`, `supplier_address`, `supplier_date_created`, `supplier_status`) VALUES
(1, 1, 'ABC Traders', '29ABCDE1234F1Z5', 2147483647, 'Bangalore, Karnataka', '2025-04-10', 'active'),
(15, 2, 'SK Traders', '2342424wrwer', 123456789, 'Mangalore', '2025-04-10', 'active'),
(16, 3, 'Ash Trading', '963852741963', 2147483647, 'Bendoorwell', '2025-05-12', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(10) NOT NULL,
  `role` enum('Admin','User','Employee','Ngo') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `otp` int(11) DEFAULT NULL,
  `otp_expiry` datetime DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `otp`, `otp_expiry`, `phone`, `address`) VALUES
(2, 'Joel', 'jn@gmail.com', '12345678', 'User', '2025-03-11 13:16:13', 927467, NULL, NULL, NULL),
(7, 'admin', 'admin@gmail.com', 'admin12345', 'Admin', '2025-03-20 07:22:05', NULL, NULL, NULL, NULL),
(8, 'emp', 'emp@mail.com', 'emp@123', 'Employee', '2025-04-20 05:21:29', NULL, NULL, '9639639639', NULL),
(12, 'ngo', 'ngo@mail.com', 'ngo@123', 'Ngo', '2025-04-20 05:22:53', NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`order_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `food_request`
--
ALTER TABLE `food_request`
  ADD PRIMARY KEY (`request_id`);

--
-- Indexes for table `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `order_temp`
--
ALTER TABLE `order_temp`
  ADD PRIMARY KEY (`temp_id`);

--
-- Indexes for table `place`
--
ALTER TABLE `place`
  ADD PRIMARY KEY (`place_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`supplier_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `food_request`
--
ALTER TABLE `food_request`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `item`
--
ALTER TABLE `item`
  MODIFY `item_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `order_temp`
--
ALTER TABLE `order_temp`
  MODIFY `temp_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `place`
--
ALTER TABLE `place`
  MODIFY `place_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `supplier_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
