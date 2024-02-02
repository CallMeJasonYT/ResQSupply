-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Εξυπηρετητής: 127.0.0.1
-- Χρόνος δημιουργίας: 02 Φεβ 2024 στις 18:50:45
-- Έκδοση διακομιστή: 10.4.32-MariaDB
-- Έκδοση PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Βάση δεδομένων: `resqsupply`
--

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `admin`
--

CREATE TABLE `admin` (
  `adm_id` int(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `admin`
--

INSERT INTO `admin` (`adm_id`) VALUES
(123456789);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `announcements`
--

CREATE TABLE `announcements` (
  `ann_id` int(5) NOT NULL,
  `ann_title` varchar(100) NOT NULL,
  `ann_text` varchar(200) NOT NULL,
  `ann_date` datetime NOT NULL,
  `ann_base_id` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `announcements`
--

INSERT INTO `announcements` (`ann_id`, `ann_title`, `ann_text`, `ann_date`, `ann_base_id`) VALUES
(22, 'Urgent Need for Supplies in the Area of Patras', 'Due to the heavy rain today, there is an urgent need for the following supplies in the General Area of Patras.', '2024-01-31 16:12:40', 1),
(23, 'Urgent Need for Supplies in the Area of Patras', 'Due to the heavy hailstorm today, there is an urgent need for the following supplies in the General Area of Patras.', '2024-01-31 16:13:21', 1);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `base`
--

CREATE TABLE `base` (
  `base_id` int(5) NOT NULL,
  `base_name` varchar(30) NOT NULL,
  `base_loc` varchar(30) NOT NULL,
  `base_cords` point NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `base`
--

INSERT INTO `base` (`base_id`, `base_name`, `base_loc`, `base_cords`) VALUES
(1, 'Base Patra', 'Κωνσταντίνουπόλεως, Αγία Σοφία', 0x00000000010100000027df5e3d0d21434079e89b607fbe3540);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `categories`
--

CREATE TABLE `categories` (
  `cat_id` int(5) NOT NULL,
  `cat_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `categories`
--

INSERT INTO `categories` (`cat_id`, `cat_name`) VALUES
(5, 'Food'),
(6, 'Beverages'),
(7, 'Clothing'),
(8, 'Hacker of class'),
(9, '2d hacker'),
(11, 'Test'),
(13, '-----'),
(14, 'Flood'),
(15, 'new cat'),
(16, 'Medical Supplies'),
(19, 'Shoes'),
(21, 'Personal Hygiene '),
(22, 'Cleaning Supplies'),
(23, 'Tools'),
(24, 'Kitchen Supplies'),
(25, 'Baby Essentials'),
(26, 'Insect Repellents'),
(27, 'Electronic Devices'),
(28, 'Cold weather'),
(29, 'Animal Food'),
(30, 'Financial support'),
(33, 'Cleaning Supplies.'),
(34, 'Hot Weather'),
(35, 'First Aid '),
(39, 'Test_0'),
(40, 'test1'),
(41, 'pet supplies'),
(42, 'Μedicines'),
(43, 'Energy Drinks'),
(44, 'Disability and Assis'),
(45, 'Communication items'),
(46, 'communications'),
(47, 'Humanitarian Shelter'),
(48, 'Water Purification');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `citizen`
--

CREATE TABLE `citizen` (
  `cit_id` int(13) NOT NULL,
  `cit_fullname` varchar(55) NOT NULL,
  `cit_tel` varchar(14) NOT NULL,
  `cit_email` varchar(100) DEFAULT NULL,
  `cit_addr` varchar(100) NOT NULL,
  `cit_cords` point NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `citizen`
--

INSERT INTO `citizen` (`cit_id`, `cit_fullname`, `cit_tel`, `cit_email`, `cit_addr`, `cit_cords`) VALUES
(134990807, 'Ioannis Papadopoulos', '6932819098', 'papIo@gmail.com', 'Λούρου Πάτρα', 0x0000000001010000009906ea398e224340b422c55b42bf3540),
(375961109, 'Δημήτρης Αγγελόπουλος', '6963772881', 'aggelodim@gmail.com', 'Αιήτου Πάτρα', 0x0000000001010000007ddd335c2e1d4340f196506628bd3540),
(705130488, 'Iasonas Pavlopoulos', '6975916405', 'jasonpavlop1@gmail.com', 'Φορμίωνος Πάτρα', 0x000000000101000000ecaa9be6781d4340a97290c657c33540),
(810897374, 'Eleni Sigala', '6974900907', 'SigEl@gmail.com', 'Νικίου Πάτρα', 0x0000000001010000004f04711e4e1d4340e514788258c13540),
(911546540, 'Roubini Aggoura', '6948939730', 'roubinieag@gmail.com', 'Κορυδαλλέως Πάτρα', 0x000000000101000000c55f49a8cf22434002fc091d2ac43540);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `goods`
--

CREATE TABLE `goods` (
  `good_name` varchar(50) NOT NULL,
  `good_detn` varchar(20) DEFAULT NULL,
  `good_detv` int(5) DEFAULT NULL,
  `good_cat_id` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `goods`
--

INSERT INTO `goods` (`good_name`, `good_detn`, `good_detv`, `good_cat_id`) VALUES
('algofren', '10', 600, 42),
('Antihistamines', 'pills', 10, 16),
('Antiseptic', '', 250, 16),
('Baby bottle', 'volume', 250, 25),
('Baby wipes', 'volume', 500, 21),
('Bandages', '', 25, 16),
('Batteries', '6 pack', 0, 23),
('beef burgers', 'grams', 500, 5),
('Betadine', 'Povidone iodine 10%', 240, 35),
('Biscuits', '', 0, 5),
('Blanket', 'size', 50, 7),
('Blankets', '', 0, 28),
('Boots', '', 0, 7),
('Bread', 'weight', 1, 5),
('Broom', '', 0, 22),
('burn gel', 'ml', 500, 41),
('burn pads', '', 5, 41),
('Can Opener', '1', 0, 23),
('Canned', '', 0, 5),
('Canned corn', 'weight', 500, 5),
('Canned Tuna', '', 0, 5),
('Cat Food', 'volume', 500, 29),
('CELINA Dynamic Small Shelter', 'dimensions', 20, 47),
('Cereal bar', 'weight', 23, 5),
('cheese', 'grams', 1000, 5),
('Chicken', '5', 1, 5),
('Chlorine', 'volume', 500, 22),
('Chocolate', 'weight', 100, 5),
('Cleaning rag', '', 0, 22),
('Club Soda', 'volume', 500, 6),
('Coca Cola', 'Volume', 500, 6),
('cold coffee', '10', 330, 6),
('Condensed milk', 'weight', 400, 5),
('Cool Scarf', '', 0, 34),
('Cooling Fan', '', 0, 34),
('cotton wool', '100% Hydrofile', 70, 35),
('COVID-19 Tests', '20', 0, 16),
('Crackers', 'Quantity per package', 10, 5),
('Croissant', 'calories', 200, 5),
('depon', '', 20, 42),
('Detergent', '', 0, 22),
('Dishes', '', 0, 24),
('Disinfectant', '', 0, 22),
('Disposable gloves', '', 100, 16),
('Dog Food', 'volume', 500, 29),
('dramamines', '', 5, 42),
('Dry Apricots', 'weight', 100, 5),
('Dry Cranberries', 'weight', 100, 5),
('Dry Figs', 'weight', 100, 5),
('Duct tape', '', 0, 23),
('Dust mask', '', 0, 22),
('effervescent depon', '67', 1000, 42),
('eggs', 'pair', 10, 5),
('elastic bandages', '', 12, 41),
('Electrolytes', 'packet of pills', 20, 16),
('emetostop', '', 5, 42),
('Fakes', '', 0, 5),
('Fire Extinguisher', '', 0, 23),
('First Aid Kit', '', 0, 16),
('Flashlight', '', 0, 23),
('flour', 'grams', 1000, 5),
('fork', '', 0, 24),
('Fruits', '', 0, 5),
('Gauze', '', 0, 16),
('Glass', '', 0, 24),
('Gloves', '', 0, 7),
('Hammer', '', 0, 23),
('Hell', '22', 330, 43),
('Hoodie', '', 0, 7),
('Humanitarian General Purpose Tent System (HGPTS)', 'PART NUMBER', 0, 47),
('Ibuprofen', 'stock ', 10, 16),
('imodium', '', 5, 42),
('Instant Pancake Mix', '', 0, 5),
('isothermally shirts', '5', 0, 28),
('Juice', 'volume', 500, 6),
('Kitchen appliances', '', 0, 14),
('Lacta', 'weight', 105, 5),
('lettuce', 'grams', 500, 5),
('Lighter', '16', 0, 23),
('Medical gloves', 'volume', 20, 22),
('Men Sneakers', 'size', 44, 7),
('Menstrual Pads', 'stock', 500, 21),
('mobile phones', 'iphone', 200, 45),
('Monster', '31', 500, 43),
('Mop', '', 0, 22),
('MOTOTRBO R7', 'band', 0, 45),
('Multi-purpose Area Shelter System, Type-I', 'TYPE', 0, 47),
('Multivitamines', 'stock', 200, 16),
('nurofen', '', 10, 42),
('nuts', 'grams', 500, 5),
('onions', 'grams', 500, 5),
('Orange juice', 'volume', 250, 6),
('Outdoor spiral', 'duration', 7, 26),
('Pacifier', 'material', 0, 25),
('Painkillers', 'volume', 200, 16),
('Pan', '', 0, 24),
('panadol', '', 6, 42),
('Pants', '', 0, 7),
('Paracetamol', 'stock', 2000, 16),
('Paring knives', '', 0, 24),
('pastel', '', 7, 5),
('pet carrier', '', 2, 41),
('pet dishes', '', 10, 41),
('plaster set', '1', 0, 41),
('plastic bags', '', 20, 41),
('Plastic bucket', '', 0, 22),
('Pocket Knife', 'Number of different ', 3, 23),
('ponstan', '', 10, 42),
('Pots', '', 0, 24),
('Powerade', '23', 500, 43),
('PRIME', '15', 500, 43),
('Prybar', '', 0, 23),
('Radio', 'Power', 0, 27),
('Raincoat', '', 0, 7),
('Redbull', '40', 330, 43),
('Rice', '', 0, 5),
('RM LA 250 (VHF Linear Ενισχυτής 140-150MHz)', 'Frequency', 140, 45),
('sadolin', '', 3, 42),
('saflutan', '', 2, 42),
('sanitary napkins', '30', 500, 21),
('Sanitary Pads', 'piece', 10, 21),
('Sanitary wipes', 'pank', 10, 21),
('Sardines', 'brand', 0, 5),
('Scarf', '', 0, 28),
('Scrub brush', '', 0, 22),
('Shoes', '', 0, 7),
('Shorts', '20', 0, 34),
('Shovel', '', 0, 23),
('Skillsaw', '', 0, 23),
('Sleeping Bag', '', 0, 28),
('Socks', '', 0, 7),
('Spaghetti', 'grams', 500, 5),
('spoon', '', 0, 24),
('spray', 'volume', 75, 26),
('steaks', 'grams', 1000, 5),
('Sterilized Saline', 'volume', 100, 16),
('T-Shirt', 'size', 0, 7),
('t22', 'wtwty', 0, 9),
('Tampon', 'stock', 500, 21),
('Tampons', '', 0, 16),
('Tea', 'volume', 500, 6),
('Test Item', 'volume', 200, 11),
('Test Product', 'weight', 500, 9),
('Test Val', 'Details', 600, 14),
('thermal blanket', '', 2, 41),
('Thermometer', '', 0, 16),
('Thermos', '', 0, 28),
('Toilet Paper', 'stock', 300, 21),
('tomatoes', 'grams', 1000, 5),
('Toothbrush', 'stock', 500, 21),
('Toothpaste', 'stock', 250, 21),
('Towels', '', 0, 22),
('toys', '', 5, 41),
('traumaplast', '', 20, 41),
('Trousers', '', 0, 7),
('Underwear', '', 0, 7),
('Vitamin C', 'stock', 200, 16),
('Warm Jacket', '', 0, 7),
('Water', 'volume', 1, 6),
('Water Disinfection Tablets', 'Basic Ingredients', 0, 16),
('Wet Wipes', '', 0, 22),
('Wheelchairs', 'quantity', 100, 44),
('Whistle', '', 0, 23),
('Winter gloves', '', 0, 28),
('Winter hat', '', 0, 28),
('xanax', '', 5, 42),
('Αθλητικά', 'Νο 46', 0, 19),
('Παξιμάδια', 'weight', 200, 5),
('Πασατέμπος', '', 0, 5),
('Πατατάκια', 'weight', 45, 5),
('Σερβιέτες', 'pcs', 18, 21);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `loads`
--

CREATE TABLE `loads` (
  `load_id` int(5) NOT NULL,
  `load_veh` varchar(7) NOT NULL,
  `load_goodn` varchar(50) NOT NULL,
  `load_goodv` int(2) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `needs`
--

CREATE TABLE `needs` (
  `needs_id` int(5) NOT NULL,
  `needs_ann_id` int(5) NOT NULL,
  `needs_goodn` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `needs`
--

INSERT INTO `needs` (`needs_id`, `needs_ann_id`, `needs_goodn`) VALUES
(67, 22, 'Cereal bar'),
(68, 22, 'Hoodie'),
(69, 23, 'Crackers'),
(70, 23, 'Toilet Paper');

--
-- Δείκτες `needs`
--
DELIMITER $$
CREATE TRIGGER `before_insert_needs` BEFORE INSERT ON `needs` FOR EACH ROW BEGIN
    DECLARE count_duplicates INT;

    SELECT COUNT(*)
    INTO count_duplicates
    FROM needs
    WHERE needs_ann_id = NEW.needs_ann_id AND needs_goodn = NEW.needs_goodn;

    IF count_duplicates > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Duplicate ann_id and needs_goodn values are not allowed.';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `rescuer`
--

CREATE TABLE `rescuer` (
  `res_id` int(13) NOT NULL,
  `res_veh` varchar(7) NOT NULL,
  `res_fullname` varchar(55) NOT NULL,
  `res_tel` varchar(14) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `rescuer`
--

INSERT INTO `rescuer` (`res_id`, `res_veh`, `res_fullname`, `res_tel`) VALUES
(249374051, 'TES3000', 'Athina Sagri', '6912377722'),
(867234291, 'TES2000', 'Maria Konstadinidi', '6998234334'),
(996936160, 'TES1000', 'Pavlos Mitropoulos', '6974392341');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `storage`
--

CREATE TABLE `storage` (
  `str_id` int(5) NOT NULL,
  `str_goodn` varchar(50) NOT NULL,
  `str_goodv` int(3) NOT NULL,
  `str_base` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `storage`
--

INSERT INTO `storage` (`str_id`, `str_goodn`, `str_goodv`, `str_base`) VALUES
(385, 'plastic bags', 0, 1),
(386, 'Plastic bucket', 10, 1),
(387, 'Pocket Knife', 10, 1),
(388, 'ponstan', 10, 1),
(389, 'Pots', 0, 1),
(390, 'Powerade', 5, 1),
(391, 'PRIME', 10, 1),
(392, 'Prybar', 10, 1),
(393, 'Radio', 5, 1),
(394, 'pet carrier', 10, 1),
(395, 'pet dishes', 10, 1),
(396, 'plaster set', 10, 1),
(397, 'Raincoat', 10, 1),
(398, 'Redbull', 10, 1),
(399, 'Rice', 10, 1),
(400, 'RM LA 250 (VHF Linear Ενισχυτής 140-150MHz)', 10, 1),
(401, 'sadolin', 0, 1),
(402, 'saflutan', 0, 1),
(403, 'sanitary napkins', 0, 1),
(404, 'Sanitary Pads', 0, 1),
(405, 'Sanitary wipes', 0, 1),
(406, 'Sardines', 0, 1),
(407, 'Scarf', 0, 1),
(408, 'Scrub brush', 0, 1),
(409, 'Shorts', 0, 1),
(410, 'Shovel', 0, 1),
(411, 'Skillsaw', 0, 1),
(412, 'Sleeping Bag', 0, 1),
(413, 'Socks', 0, 1),
(414, 'Spaghetti', 0, 1),
(415, 'spoon', 0, 1),
(416, 'spray', 0, 1),
(417, 'steaks', 0, 1),
(418, 'Sterilized Saline', 0, 1),
(419, 'T-Shirt', 0, 1),
(421, 'Tampon', 0, 1),
(422, 'Tampons', 0, 1),
(423, 'Tea', 0, 1),
(427, 'thermal blanket', 0, 1),
(428, 'Thermometer', 0, 1),
(429, 'Thermos', 0, 1),
(430, 'Toilet Paper', 0, 1),
(431, 'tomatoes', 0, 1),
(432, 'Toothbrush', 0, 1),
(433, 'Toothpaste', 0, 1),
(434, 'Towels', 0, 1),
(435, 'toys', 0, 1),
(436, 'traumaplast', 0, 1),
(437, 'Underwear', 0, 1),
(438, 'Vitamin C', 0, 1),
(439, 'Warm Jacket', 0, 1),
(440, 'Water', 0, 1),
(441, 'Water Disinfection Tablets', 0, 1),
(442, 'Wet Wipes', 0, 1),
(443, 'Wheelchairs', 0, 1),
(444, 'Whistle', 0, 1),
(445, 'Winter gloves', 0, 1),
(446, 'Winter hat', 0, 1),
(447, 'xanax', 0, 1),
(448, 'Αθλητικά', 0, 1),
(449, 'Παξιμάδια', 0, 1),
(450, 'Πασατέμπος', 0, 1),
(451, 'Πατατάκια', 0, 1),
(452, 'Σερβιέτες', 0, 1),
(453, 'Chocolate', 0, 1),
(454, 'Dry Cranberries', 0, 1),
(455, 'nuts', 0, 1),
(456, 'algofren', 0, 1),
(457, 'Antihistamines', 0, 1),
(458, 'Antiseptic', 0, 1),
(459, 'Baby bottle', 0, 1),
(460, 'Baby wipes', 0, 1),
(461, 'Bandages', 0, 1),
(462, 'Batteries', 0, 1),
(463, 'beef burgers', 0, 1),
(464, 'Betadine', 0, 1),
(465, 'Biscuits', 0, 1),
(466, 'Blanket', 0, 1),
(467, 'Blankets', 0, 1),
(468, 'Boots', 0, 1),
(469, 'Bread', 0, 1),
(470, 'Broom', 0, 1),
(471, 'burn gel', 0, 1),
(472, 'burn pads', 0, 1),
(473, 'Can Opener', 0, 1),
(474, 'Canned', 0, 1),
(475, 'Canned corn', 0, 1),
(476, 'Canned Tuna', 0, 1),
(477, 'Cat Food', 0, 1),
(478, 'CELINA Dynamic Small Shelter', 0, 1),
(479, 'Cereal bar', 0, 1),
(480, 'cheese', 0, 1),
(481, 'Chicken', 0, 1),
(482, 'Chlorine', 0, 1),
(483, 'Cleaning rag', 0, 1),
(484, 'Club Soda', 0, 1),
(485, 'Coca Cola', 0, 1),
(486, 'cold coffee', 0, 1),
(487, 'Condensed milk', 0, 1),
(488, 'Cool Scarf', 0, 1),
(489, 'Cooling Fan', 0, 1),
(490, 'cotton wool', 0, 1),
(491, 'COVID-19 Tests', 0, 1),
(492, 'Crackers', 0, 1),
(493, 'Croissant', 0, 1),
(494, 'depon', 0, 1),
(495, 'Detergent', 0, 1),
(496, 'Dishes', 0, 1),
(497, 'Disinfectant', 0, 1),
(498, 'Disposable gloves', 0, 1),
(499, 'Dog Food', 0, 1),
(500, 'dramamines', 0, 1),
(501, 'Dry Apricots', 0, 1),
(502, 'Dry Figs', 0, 1),
(503, 'Duct tape', 0, 1),
(504, 'Dust mask', 0, 1),
(505, 'effervescent depon', 0, 1),
(506, 'eggs', 0, 1),
(507, 'elastic bandages', 0, 1),
(508, 'Electrolytes', 0, 1),
(509, 'emetostop', 0, 1),
(510, 'Fakes', 0, 1),
(511, 'Fire Extinguisher', 0, 1),
(512, 'First Aid Kit', 0, 1),
(513, 'Flashlight', 0, 1),
(514, 'flour', 0, 1),
(515, 'fork', 0, 1),
(516, 'Fruits', 0, 1),
(517, 'Gauze', 0, 1),
(518, 'Glass', 0, 1),
(519, 'Gloves', 0, 1),
(520, 'Hammer', 0, 1),
(521, 'Hell', 0, 1),
(522, 'Hoodie', 0, 1),
(523, 'Humanitarian General Purpose Tent System (HGPTS)', 0, 1),
(524, 'Ibuprofen', 0, 1),
(525, 'imodium', 0, 1),
(526, 'Instant Pancake Mix', 0, 1),
(527, 'isothermally shirts', 0, 1),
(528, 'Juice', 0, 1),
(529, 'Kitchen appliances', 0, 1),
(530, 'Lacta', 0, 1),
(531, 'lettuce', 0, 1),
(532, 'Lighter', 0, 1),
(533, 'Medical gloves', 0, 1),
(534, 'Men Sneakers', 0, 1),
(535, 'Menstrual Pads', 0, 1),
(536, 'mobile phones', 0, 1),
(537, 'Monster', 0, 1),
(538, 'Mop', 0, 1),
(539, 'MOTOTRBO R7', 0, 1),
(540, 'Multi-purpose Area Shelter System, Type-I', 0, 1),
(541, 'Multivitamines', 0, 1),
(542, 'nurofen', 0, 1),
(543, 'onions', 0, 1),
(544, 'Orange juice', 0, 1),
(545, 'Outdoor spiral', 0, 1),
(546, 'Pacifier', 0, 1),
(547, 'Painkillers', 0, 1),
(548, 'Pan', 0, 1),
(549, 'panadol', 0, 1),
(550, 'Pants', 0, 1),
(551, 'Paracetamol', 0, 1),
(552, 'Paring knives', 0, 1),
(553, 'pastel', 0, 1),
(554, 'Shoes', 0, 1),
(555, 'Trousers', 0, 1);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `tasks`
--

CREATE TABLE `tasks` (
  `task_id` int(5) NOT NULL,
  `task_cit_id` int(13) NOT NULL,
  `task_date_create` datetime NOT NULL,
  `task_goodn` varchar(50) NOT NULL,
  `task_date_pickup` datetime DEFAULT NULL,
  `task_cat` enum('Request','Offer') NOT NULL,
  `task_veh` varchar(7) DEFAULT NULL,
  `task_status` enum('Completed','Pending','Executing') NOT NULL DEFAULT 'Pending',
  `task_complete` datetime DEFAULT NULL,
  `task_goodv` int(3) NOT NULL DEFAULT 1,
  `task_loc` point NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `tasks`
--

INSERT INTO `tasks` (`task_id`, `task_cit_id`, `task_date_create`, `task_goodn`, `task_date_pickup`, `task_cat`, `task_veh`, `task_status`, `task_complete`, `task_goodv`, `task_loc`) VALUES
(259, 705130488, '2024-01-28 17:06:12', 'Cereal bar', NULL, 'Request', NULL, 'Pending', NULL, 2, 0x000000000101000000da7ba7b8601f4340a9a9c024f0bc3540),
(260, 705130488, '2024-01-28 17:06:55', 'Hoodie', NULL, 'Request', NULL, 'Pending', NULL, 2, 0x000000000101000000ecaa9be6781d4340a97290c657c33540),
(261, 911546540, '2024-01-29 17:07:17', 'Toilet Paper', NULL, 'Request', NULL, 'Pending', NULL, 1, 0x000000000101000000c55f49a8cf22434002fc091d2ac43540),
(262, 134990807, '2024-01-30 17:07:32', 'Crackers', NULL, 'Request', NULL, 'Pending', NULL, 2, 0x0000000001010000009906ea398e224340b422c55b42bf3540),
(263, 810897374, '2024-01-31 17:13:52', 'Crackers', NULL, 'Offer', NULL, 'Pending', NULL, 5, 0x000000000101000000e5e2b9089d2043402471a0d167c13540),
(264, 810897374, '2024-01-31 17:14:38', 'Toilet Paper', NULL, 'Offer', NULL, 'Pending', NULL, 5, 0x0000000001010000004f04711e4e1d4340e514788258c13540),
(265, 375961109, '2024-02-01 17:15:06', 'Cereal bar', NULL, 'Offer', NULL, 'Pending', NULL, 5, 0x00000000010100000086e28e37f91e43409a7b48f8debb3540),
(266, 375961109, '2024-01-01 17:15:31', 'Hoodie', NULL, 'Offer', NULL, 'Pending', NULL, 5, 0x0000000001010000007ddd335c2e1d4340f196506628bd3540);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `users`
--

CREATE TABLE `users` (
  `user_id` int(9) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(12) NOT NULL,
  `category` enum('citizen','admin','rescuer') NOT NULL DEFAULT 'citizen'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `category`) VALUES
(123456789, 'Test Admin', 'JPpav2002!', 'admin'),
(134990807, 'Citizen3', 'JPpav2002!', 'citizen'),
(249374051, 'Rescuer3', 'JPpav2002!', 'rescuer'),
(375961109, 'Citizen5', 'JPpav2002!', 'citizen'),
(705130488, 'Citizen1', 'JPpav2002!', 'citizen'),
(810897374, 'Citizen4', 'JPpav2002!', 'citizen'),
(867234291, 'Rescuer2', 'JPpav2002!', 'rescuer'),
(911546540, 'Citizen2', 'JPpav2002!', 'citizen'),
(996936160, 'Rescuer1', 'JPpav2002!', 'rescuer');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `vehicles`
--

CREATE TABLE `vehicles` (
  `veh_id` varchar(7) NOT NULL,
  `veh_loc` varchar(50) NOT NULL,
  `veh_cords` point DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `vehicles`
--

INSERT INTO `vehicles` (`veh_id`, `veh_loc`, `veh_cords`) VALUES
('TES1000', 'Πέττα Πάτρα', 0x000000000101000000363f598c151d4340b39190ed21bc3540),
('TES2000', 'Ζαφειράκη, Ζαρουχλέικα', 0x00000000010100000045f5e8cb461c43401d02bc1759ba3540),
('TES3000', 'Ευήνου Πάτρα', 0x0000000001010000003c1169c0c523434092921e8656c33540);

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`adm_id`);

--
-- Ευρετήρια για πίνακα `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`ann_id`),
  ADD KEY `ann_base_id` (`ann_base_id`);

--
-- Ευρετήρια για πίνακα `base`
--
ALTER TABLE `base`
  ADD PRIMARY KEY (`base_id`);

--
-- Ευρετήρια για πίνακα `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`cat_id`);

--
-- Ευρετήρια για πίνακα `citizen`
--
ALTER TABLE `citizen`
  ADD PRIMARY KEY (`cit_id`);

--
-- Ευρετήρια για πίνακα `goods`
--
ALTER TABLE `goods`
  ADD PRIMARY KEY (`good_name`),
  ADD KEY `good_cat_id` (`good_cat_id`);

--
-- Ευρετήρια για πίνακα `loads`
--
ALTER TABLE `loads`
  ADD PRIMARY KEY (`load_id`),
  ADD KEY `load_veh` (`load_veh`),
  ADD KEY `load_goodn` (`load_goodn`);

--
-- Ευρετήρια για πίνακα `needs`
--
ALTER TABLE `needs`
  ADD PRIMARY KEY (`needs_id`),
  ADD KEY `needs_ann_id` (`needs_ann_id`),
  ADD KEY `needs_goodn` (`needs_goodn`);

--
-- Ευρετήρια για πίνακα `rescuer`
--
ALTER TABLE `rescuer`
  ADD PRIMARY KEY (`res_id`),
  ADD KEY `veh1` (`res_veh`);

--
-- Ευρετήρια για πίνακα `storage`
--
ALTER TABLE `storage`
  ADD PRIMARY KEY (`str_id`),
  ADD KEY `str_base` (`str_base`),
  ADD KEY `str_goodn` (`str_goodn`);

--
-- Ευρετήρια για πίνακα `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`task_id`),
  ADD KEY `task_cit_id1` (`task_cit_id`),
  ADD KEY `task_veh` (`task_veh`),
  ADD KEY `task_goodn` (`task_goodn`);

--
-- Ευρετήρια για πίνακα `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Ευρετήρια για πίνακα `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`veh_id`);

--
-- AUTO_INCREMENT για άχρηστους πίνακες
--

--
-- AUTO_INCREMENT για πίνακα `announcements`
--
ALTER TABLE `announcements`
  MODIFY `ann_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT για πίνακα `base`
--
ALTER TABLE `base`
  MODIFY `base_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT για πίνακα `loads`
--
ALTER TABLE `loads`
  MODIFY `load_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT για πίνακα `needs`
--
ALTER TABLE `needs`
  MODIFY `needs_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT για πίνακα `storage`
--
ALTER TABLE `storage`
  MODIFY `str_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=556;

--
-- AUTO_INCREMENT για πίνακα `tasks`
--
ALTER TABLE `tasks`
  MODIFY `task_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=267;

--
-- Περιορισμοί για άχρηστους πίνακες
--

--
-- Περιορισμοί για πίνακα `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `id1` FOREIGN KEY (`adm_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Περιορισμοί για πίνακα `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `ann_base_id` FOREIGN KEY (`ann_base_id`) REFERENCES `base` (`base_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Περιορισμοί για πίνακα `citizen`
--
ALTER TABLE `citizen`
  ADD CONSTRAINT `id2` FOREIGN KEY (`cit_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Περιορισμοί για πίνακα `goods`
--
ALTER TABLE `goods`
  ADD CONSTRAINT `good_cat_id` FOREIGN KEY (`good_cat_id`) REFERENCES `categories` (`cat_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Περιορισμοί για πίνακα `loads`
--
ALTER TABLE `loads`
  ADD CONSTRAINT `load_goodn` FOREIGN KEY (`load_goodn`) REFERENCES `goods` (`good_name`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `load_veh` FOREIGN KEY (`load_veh`) REFERENCES `vehicles` (`veh_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Περιορισμοί για πίνακα `needs`
--
ALTER TABLE `needs`
  ADD CONSTRAINT `needs_ann_id` FOREIGN KEY (`needs_ann_id`) REFERENCES `announcements` (`ann_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `needs_goodn` FOREIGN KEY (`needs_goodn`) REFERENCES `goods` (`good_name`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Περιορισμοί για πίνακα `rescuer`
--
ALTER TABLE `rescuer`
  ADD CONSTRAINT `id3` FOREIGN KEY (`res_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `veh1` FOREIGN KEY (`res_veh`) REFERENCES `vehicles` (`veh_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Περιορισμοί για πίνακα `storage`
--
ALTER TABLE `storage`
  ADD CONSTRAINT `str_base` FOREIGN KEY (`str_base`) REFERENCES `base` (`base_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `str_goodn` FOREIGN KEY (`str_goodn`) REFERENCES `goods` (`good_name`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Περιορισμοί για πίνακα `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `task_cit_id1` FOREIGN KEY (`task_cit_id`) REFERENCES `citizen` (`cit_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `task_goodn` FOREIGN KEY (`task_goodn`) REFERENCES `goods` (`good_name`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `task_veh` FOREIGN KEY (`task_veh`) REFERENCES `vehicles` (`veh_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
