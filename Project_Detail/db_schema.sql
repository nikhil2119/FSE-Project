-- -----------------------------------------------------
-- E-commerce Database Schema
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS `fse_project`;
USE `fse_project`;
-- -----------------------------------------------------
-- Table `Master_state`
-- -----------------------------------------------------
CREATE TABLE `Master_state` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `state_name` VARCHAR(100) NOT NULL,
  `country` VARCHAR(100) NOT NULL DEFAULT 'India',
  `is_enabled` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_state_name` (`state_name`),
  INDEX `idx_state_enabled` (`is_enabled`),
  INDEX `idx_state_deleted` (`deleted_at`),
  UNIQUE INDEX `idx_state_country` (`state_name`, `country`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `Master_city`
-- -----------------------------------------------------
CREATE TABLE `Master_city` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `state_id` INT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `is_enabled` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_city_name` (`city`),
  INDEX `idx_city_enabled` (`is_enabled`),
  INDEX `idx_city_deleted` (`deleted_at`),
  UNIQUE INDEX `idx_city_state` (`city`, `state_id`),
  CONSTRAINT `fk_city_state`
    FOREIGN KEY (`state_id`)
    REFERENCES `Master_state` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `Users`
-- -----------------------------------------------------
CREATE TABLE `Users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(100) NOT NULL,
  `user_email` VARCHAR(100) NOT NULL,
  `user_pwd` VARCHAR(255) NOT NULL,
  `user_age` INT NULL CHECK (`user_age` >= 0),
  `phone` VARCHAR(20) NULL,
  `role` ENUM('admin', 'seller', 'user') NOT NULL DEFAULT 'user',
  `is_enabled` BOOLEAN NOT NULL DEFAULT TRUE,
  `email_verified` BOOLEAN NOT NULL DEFAULT FALSE,
  `phone_verified` BOOLEAN NOT NULL DEFAULT FALSE,
  `last_login` TIMESTAMP NULL DEFAULT NULL,
  `created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_user_email` (`user_email`),
  INDEX `idx_user_enabled` (`is_enabled`),
  INDEX `idx_user_deleted` (`deleted_at`),
  INDEX `idx_user_phone` (`phone`),
  INDEX `idx_user_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `User_address`
-- -----------------------------------------------------
CREATE TABLE `User_address` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `address_type` ENUM('Home', 'Office', 'Other') NOT NULL DEFAULT 'Home',
  `primary_addr` VARCHAR(255) NOT NULL,
  `landmark` VARCHAR(255) NULL,
  `pin_code` CHAR(6) NOT NULL,
  `city_id` INT NOT NULL,
  `state_id` INT NOT NULL,
  `is_default` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_enabled` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_user_address` (`user_id`),
  INDEX `idx_address_enabled` (`is_enabled`),
  INDEX `idx_address_deleted` (`deleted_at`),
  INDEX `idx_address_city` (`city_id`),
  INDEX `idx_address_state` (`state_id`),
  CONSTRAINT `fk_address_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `Users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_address_city`
    FOREIGN KEY (`city_id`)
    REFERENCES `Master_city` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_address_state`
    FOREIGN KEY (`state_id`)
    REFERENCES `Master_state` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `Master_category`
-- -----------------------------------------------------
CREATE TABLE `Master_category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cate_name` VARCHAR(100) NOT NULL,
  `cate_desc` TEXT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `image_path` VARCHAR(255) NULL,
  `is_enabled` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `created_by` INT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_category_slug` (`slug`),
  INDEX `idx_category_name` (`cate_name`),
  INDEX `idx_category_enabled` (`is_enabled`),
  INDEX `idx_category_deleted` (`deleted_at`),
  INDEX `idx_category_creator` (`created_by`),
  CONSTRAINT `fk_category_creator`
    FOREIGN KEY (`created_by`)
    REFERENCES `Users` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `Master_SubCat`
-- -----------------------------------------------------
CREATE TABLE `Master_SubCat` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cate_id` INT NOT NULL,
  `sub_cate_name` VARCHAR(100) NOT NULL,
  `sub_cate_desc` TEXT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `image_path` VARCHAR(255) NULL,
  `is_enabled` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_subcategory_slug` (`slug`),
  INDEX `idx_subcategory_name` (`sub_cate_name`),
  INDEX `idx_subcategory_category` (`cate_id`),
  INDEX `idx_subcategory_enabled` (`is_enabled`),
  INDEX `idx_subcategory_deleted` (`deleted_at`),
  UNIQUE INDEX `idx_subcategory_category_name` (`cate_id`, `sub_cate_name`),
  CONSTRAINT `fk_subcategory_category`
    FOREIGN KEY (`cate_id`)
    REFERENCES `Master_category` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `Master_products`
-- -----------------------------------------------------
CREATE TABLE `Master_products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cate_id` INT NOT NULL,
  `sub_cate_id` INT NOT NULL,
  `prod_name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `sku` VARCHAR(50) NOT NULL,
  `prod_price` DECIMAL(10,2) NOT NULL CHECK (`prod_price` >= 0),
  `compare_price` DECIMAL(10,2) NULL CHECK (`compare_price` >= 0),
  `prod_desc` TEXT NULL,
  `stock` INT NOT NULL DEFAULT 0 CHECK (`stock` >= 0),
  `low_stock_threshold` INT NOT NULL DEFAULT 5 CHECK (`low_stock_threshold` >= 0),
  `is_featured` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_enabled` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `created_by` INT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_product_slug` (`slug`),
  UNIQUE INDEX `idx_product_sku` (`sku`),
  INDEX `idx_product_name` (`prod_name`),
  INDEX `idx_product_category` (`cate_id`),
  INDEX `idx_product_subcategory` (`sub_cate_id`),
  INDEX `idx_product_enabled` (`is_enabled`),
  INDEX `idx_product_deleted` (`deleted_at`),
  INDEX `idx_product_featured` (`is_featured`),
  INDEX `idx_product_creator` (`created_by`),
  CONSTRAINT `fk_product_category`
    FOREIGN KEY (`cate_id`)
    REFERENCES `Master_category` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_product_subcategory`
    FOREIGN KEY (`sub_cate_id`)
    REFERENCES `Master_SubCat` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_product_creator`
    FOREIGN KEY (`created_by`)
    REFERENCES `Users` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `Product_images`
-- -----------------------------------------------------
CREATE TABLE `Product_images` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_id` INT NOT NULL,
  `image_path` VARCHAR(255) NOT NULL,
  `is_primary` BOOLEAN NOT NULL DEFAULT FALSE,
  `sort_order` INT NOT NULL DEFAULT 0 CHECK (`sort_order` >= 0),
  `created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_product_images` (`product_id`),
  INDEX `idx_image_primary` (`is_primary`),
  INDEX `idx_image_order` (`sort_order`),
  CONSTRAINT `fk_image_product`
    FOREIGN KEY (`product_id`)
    REFERENCES `Master_products` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `Prod_reviews`
-- -----------------------------------------------------
CREATE TABLE `Prod_reviews` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `rating` TINYINT NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
  `review_text` TEXT NULL,
  `is_verified_purchase` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_approved` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_review_product` (`product_id`),
  INDEX `idx_review_user` (`user_id`),
  INDEX `idx_review_approved` (`is_approved`),
  INDEX `idx_review_deleted` (`deleted_at`),
  UNIQUE INDEX `idx_review_user_product` (`user_id`, `product_id`),
  CONSTRAINT `fk_review_product`
    FOREIGN KEY (`product_id`)
    REFERENCES `Master_products` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_review_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `Users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `Orders`
-- -----------------------------------------------------
CREATE TABLE `Orders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `order_number` VARCHAR(50) NOT NULL,
  `total_price` DECIMAL(10,2) NOT NULL CHECK (`total_price` >= 0),
  `discount_amount` DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (`discount_amount` >= 0),
  `shipping_amount` DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (`shipping_amount` >= 0),
  `tax_amount` DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (`tax_amount` >= 0),
  `final_price` DECIMAL(10,2) NOT NULL CHECK (`final_price` >= 0),
  `status` ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded') NOT NULL DEFAULT 'Pending',
  `payment_status` ENUM('Pending', 'Paid', 'Failed', 'Refunded') NOT NULL DEFAULT 'Pending',
  `shipping_address_id` INT NOT NULL,
  `billing_address_id` INT NOT NULL,
  `notes` TEXT NULL,
  `created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_order_number` (`order_number`),
  INDEX `idx_order_user` (`user_id`),
  INDEX `idx_order_status` (`status`),
  INDEX `idx_order_payment_status` (`payment_status`),
  INDEX `idx_order_deleted` (`deleted_at`),
  INDEX `idx_order_shipping_address` (`shipping_address_id`),
  INDEX `idx_order_billing_address` (`billing_address_id`),
  CONSTRAINT `fk_order_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `Users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_order_shipping_address`
    FOREIGN KEY (`shipping_address_id`)
    REFERENCES `User_address` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_order_billing_address`
    FOREIGN KEY (`billing_address_id`)
    REFERENCES `User_address` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `Order_Items`
-- -----------------------------------------------------
CREATE TABLE `Order_Items` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1 CHECK (`quantity` > 0),
  `price` DECIMAL(10,2) NOT NULL CHECK (`price` >= 0),
  `discount_amount` DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (`discount_amount` >= 0),
  `tax_amount` DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (`tax_amount` >= 0),
  `final_price` DECIMAL(10,2) NOT NULL CHECK (`final_price` >= 0),
  `created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_orderitem_order` (`order_id`),
  INDEX `idx_orderitem_product` (`product_id`),
  CONSTRAINT `fk_orderitem_order`
    FOREIGN KEY (`order_id`)
    REFERENCES `Orders` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_orderitem_product`
    FOREIGN KEY (`product_id`)
    REFERENCES `Master_products` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `Payments`
-- -----------------------------------------------------
CREATE TABLE `Payments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `order_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `payment_method` ENUM('Credit Card', 'Debit Card', 'PayPal', 'COD', 'UPI', 'Net Banking') NOT NULL DEFAULT 'COD',
  `transaction_id` VARCHAR(100) NULL,
  `amount` DECIMAL(10,2) NOT NULL CHECK (`amount` >= 0),
  `status` ENUM('Pending', 'Completed', 'Failed', 'Refunded') NOT NULL DEFAULT 'Pending',
  `payment_details` JSON NULL,
  `created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_payment_order` (`order_id`),
  INDEX `idx_payment_user` (`user_id`),
  INDEX `idx_payment_status` (`status`),
  INDEX `idx_payment_transaction` (`transaction_id`),
  CONSTRAINT `fk_payment_order`
    FOREIGN KEY (`order_id`)
    REFERENCES `Orders` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_payment_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `Users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `Cart`
-- -----------------------------------------------------
CREATE TABLE `Cart` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1 CHECK (`quantity` > 0),
  `added_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_cart_user_product` (`user_id`, `product_id`),
  INDEX `idx_cart_product` (`product_id`),
  CONSTRAINT `fk_cart_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `Users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_cart_product`
    FOREIGN KEY (`product_id`)
    REFERENCES `Master_products` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `Discounts`
-- -----------------------------------------------------
CREATE TABLE `Discounts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL,
  `description` TEXT NULL,
  `discount_type` ENUM('percentage', 'fixed') NOT NULL,
  `discount_value` DECIMAL(10,2) NOT NULL CHECK (`discount_value` > 0),
  `min_order_amount` DECIMAL(10,2) NULL CHECK (`min_order_amount` IS NULL OR `min_order_amount` >= 0),
  `max_discount_amount` DECIMAL(10,2) NULL CHECK (`max_discount_amount` IS NULL OR `max_discount_amount` >= 0),
  `start_date` TIMESTAMP NOT NULL,
  `end_date` TIMESTAMP NOT NULL,
  `usage_limit` INT NULL CHECK (`usage_limit` IS NULL OR `usage_limit` > 0),
  `used_count` INT NOT NULL DEFAULT 0 CHECK (`used_count` >= 0),
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_by` INT NOT NULL,
  `created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_discount_code` (`code`),
  INDEX `idx_discount_dates` (`start_date`, `end_date`),
  INDEX `idx_discount_active` (`is_active`),
  INDEX `idx_discount_deleted` (`deleted_at`),
  INDEX `idx_discount_creator` (`created_by`),
  CONSTRAINT `fk_discount_creator`
    FOREIGN KEY (`created_by`)
    REFERENCES `Users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `chk_discount_dates` CHECK (`end_date` > `start_date`),
  CONSTRAINT `chk_discount_usage` CHECK (`usage_limit` IS NULL OR `used_count` <= `usage_limit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `Wishlist`
-- -----------------------------------------------------
CREATE TABLE `Wishlist` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `added_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_wishlist_user_product` (`user_id`, `product_id`),
  INDEX `idx_wishlist_product` (`product_id`),
  CONSTRAINT `fk_wishlist_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `Users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_wishlist_product`
    FOREIGN KEY (`product_id`)
    REFERENCES `Master_products` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `Product_Attributes`
-- -----------------------------------------------------
CREATE TABLE `Product_Attributes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_id` INT NOT NULL,
  `attribute_name` VARCHAR(100) NOT NULL,
  `attribute_value` VARCHAR(255) NOT NULL,
  `created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_product_attributes` (`product_id`),
  INDEX `idx_attribute_name` (`attribute_name`),
  UNIQUE INDEX `idx_product_attribute` (`product_id`, `attribute_name`),
  CONSTRAINT `fk_attribute_product`
    FOREIGN KEY (`product_id`)
    REFERENCES `Master_products` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
