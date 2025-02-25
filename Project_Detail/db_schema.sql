CREATE TABLE `Master_category` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `cate_name` varchar(255),
  `cate_desc` text,
  `is_enabled` boolean DEFAULT true,
  `created_on` timestamp,
  `created_by` int
);

CREATE TABLE `Master_SubCat` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `cate_id` int NOT NULL,
  `sub_cate_name` varchar(255),
  `sub_cate_desc` text,
  `is_enabled` boolean DEFAULT true,
  `created_on` timestamp
);

CREATE TABLE `Master_products` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `cate_id` int NOT NULL,
  `sub_cate_id` int NOT NULL,
  `prod_name` varchar(255),
  `prod_price` int,
  `prod_desc` text,
  `stock` int,
  `is_enabled` boolean DEFAULT true,
  `created_on` timestamp,
  `created_by` int
);

CREATE TABLE `Product_images` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_path` varchar(255),
  `created_on` timestamp
);

CREATE TABLE `Prod_reviews` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` int COMMENT 'Rating from 1-5',
  `review_text` text,
  `created_on` timestamp
);

CREATE TABLE `Users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_name` varchar(255),
  `user_email` varchar(255) UNIQUE,
  `user_pwd` varchar(255),
  `user_age` int,
  `phone` varchar(20),
  `is_enabled` boolean DEFAULT true,
  `created_on` timestamp
);

CREATE TABLE `User_address` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `primary_addr` varchar(255),
  `pin_code` char(6),
  `city_id` int NOT NULL,
  `state_id` int NOT NULL,
  `is_enabled` boolean DEFAULT true,
  `created_on` timestamp
);

CREATE TABLE `Master_city` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `state_id` int NOT NULL,
  `city` varchar(255),
  `is_enabled` boolean DEFAULT true,
  `created_on` timestamp
);

CREATE TABLE `Master_state` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `state_name` varchar(255),
  `country` varchar(255) DEFAULT 'India',
  `is_enabled` boolean DEFAULT true,
  `created_on` timestamp
);

CREATE TABLE `Orders` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_price` decimal(10,2),
  `status` enum(Pending,Shipped,Delivered,Cancelled) DEFAULT 'Pending',
  `created_on` timestamp
);

CREATE TABLE `Order_Items` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int,
  `price` decimal(10,2)
);

CREATE TABLE `Payments` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `user_id` int NOT NULL,
  `payment_method` enum(Credit Card,Debit Card,PayPal,COD) DEFAULT 'COD',
  `status` enum(Pending,Completed,Failed) DEFAULT 'Pending',
  `created_on` timestamp
);

CREATE TABLE `Cart` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT 1,
  `added_on` timestamp
);

CREATE TABLE `Admins` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(100),
  `email` varchar(100) UNIQUE,
  `password` varchar(255),
  `is_enabled` boolean DEFAULT true,
  `created_on` timestamp
);

ALTER TABLE `Master_category` ADD FOREIGN KEY (`created_by`) REFERENCES `Users` (`id`);

ALTER TABLE `Master_SubCat` ADD FOREIGN KEY (`cate_id`) REFERENCES `Master_category` (`id`);

ALTER TABLE `Master_products` ADD FOREIGN KEY (`cate_id`) REFERENCES `Master_category` (`id`);

ALTER TABLE `Master_products` ADD FOREIGN KEY (`sub_cate_id`) REFERENCES `Master_SubCat` (`id`);

ALTER TABLE `Master_products` ADD FOREIGN KEY (`created_by`) REFERENCES `Users` (`id`);

ALTER TABLE `Product_images` ADD FOREIGN KEY (`product_id`) REFERENCES `Master_products` (`id`);

ALTER TABLE `Prod_reviews` ADD FOREIGN KEY (`product_id`) REFERENCES `Master_products` (`id`);

ALTER TABLE `Prod_reviews` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`);

ALTER TABLE `User_address` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`);

ALTER TABLE `User_address` ADD FOREIGN KEY (`city_id`) REFERENCES `Master_city` (`id`);

ALTER TABLE `User_address` ADD FOREIGN KEY (`state_id`) REFERENCES `Master_state` (`id`);

ALTER TABLE `Master_city` ADD FOREIGN KEY (`state_id`) REFERENCES `Master_state` (`id`);

ALTER TABLE `Orders` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`);

ALTER TABLE `Order_Items` ADD FOREIGN KEY (`order_id`) REFERENCES `Orders` (`id`);

ALTER TABLE `Order_Items` ADD FOREIGN KEY (`product_id`) REFERENCES `Master_products` (`id`);

ALTER TABLE `Payments` ADD FOREIGN KEY (`order_id`) REFERENCES `Orders` (`id`);

ALTER TABLE `Payments` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`);

ALTER TABLE `Cart` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`);

ALTER TABLE `Cart` ADD FOREIGN KEY (`product_id`) REFERENCES `Master_products` (`id`);
