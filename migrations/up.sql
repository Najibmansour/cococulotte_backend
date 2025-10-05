CREATE DATABASE IF NOT EXISTS appdb;
USE appdb;

DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS collections;
DROP TABLE IF EXISTS about_json;

CREATE TABLE collections (
  slug VARCHAR(191) NOT NULL,
  title VARCHAR(255) NOT NULL,
  header_image TEXT,
  description TEXT,
  PRIMARY KEY (slug),
  UNIQUE KEY ux_collections_title (title)
);

CREATE TABLE products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  collection_slug VARCHAR(191) NOT NULL,
  image_url TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_products_collection_slug (collection_slug),
  KEY ix_products_price (price),
  KEY ix_products_name (name)
) ENGINE=InnoDB;

INSERT INTO collections (slug, title, header_image, description) VALUES
('summer-2024','Summer Collection 2024','https://placehold.co/1920x600/1a1a1a/ffffff','Discover our exclusive designs'),
('spring-elegance','Spring Elegance','https://placehold.co/1920x600/1a1a1a/ffffff','Discover our exclusive designs'),
('winter-dreams','Winter Dreams','https://placehold.co/1920x600/1a1a1a/ffffff','Discover our exclusive designs'),
('autumn-mystery','Autumn Mystery','https://placehold.co/1920x600/1a1a1a/ffffff','Discover our exclusive designs')
ON DUPLICATE KEY UPDATE
title=VALUES(title),header_image=VALUES(header_image),description=VALUES(description);

INSERT INTO products (id,name,price,collection_slug,image_url) VALUES
(1,'Elegant Noir',199.99,'summer-2024','https://placehold.co/600x800/1a1a1a/ffffff'),
(2,'Midnight Dream',149.99,'summer-2024','https://placehold.co/400x400/1a1a1a/ffffff'),
(3,'Dark Romance',299.99,'spring-elegance','https://placehold.co/400x400/1a1a1a/ffffff'),
(4,'Gothic Grace',179.99,'winter-dreams','https://placehold.co/400x400/1a1a1a/ffffff'),
(5,'Mystic Allure',249.99,'autumn-mystery','https://placehold.co/400x400/1a1a1a/ffffff'),
(6,'Velvet Shadow',189.99,'summer-2024','https://placehold.co/400x400/1a1a1a/ffffff'),
(7,'Ethereal Whisper',219.99,'spring-elegance','https://placehold.co/400x400/1a1a1a/ffffff'),
(8,'Frost Enchantment',259.99,'winter-dreams','https://placehold.co/400x400/1a1a1a/ffffff'),
(9,'Twilight Reverie',169.99,'autumn-mystery','https://placehold.co/400x400/1a1a1a/ffffff'),
(10,'Moonlit Serenade',229.99,'summer-2024','https://placehold.co/400x400/1a1a1a/ffffff')
ON DUPLICATE KEY UPDATE
name=VALUES(name),price=VALUES(price),collection_slug=VALUES(collection_slug),image_url=VALUES(image_url);




CREATE TABLE about_json (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  key_slug VARCHAR(50) NOT NULL UNIQUE,
  data JSON NOT NULL,
  CHECK (JSON_VALID(data)),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO about_json (key_slug, data) VALUES
('about', JSON_OBJECT(
  'title', 'About CocoCulotte',
  'sections', JSON_ARRAY(
    JSON_OBJECT('title','Our Story','text','Founded with a passion for elegant design and sustainable fashion, CocoCulotte represents the perfect blend of style and consciousness. Our journey began with a simple idea: to create timeless pieces that make every woman feel confident and beautiful while respecting our planet.','image','/images/IMG_0775.JPG'),
    JSON_OBJECT('title','Our Vision','text','We envision a world where fashion meets responsibility. Each piece in our collection is thoughtfully designed and crafted using sustainable materials and ethical practices. We believe that true luxury lies in the quality of our craftsmanship and the integrity of our process.','image','/images/IMG_0778.JPG'),
    JSON_OBJECT('title','Our Promise','text','Quality and sustainability are at the heart of everything we do. From sourcing the finest materials to ensuring fair labor practices, we are committed to creating fashion that you can feel good about wearing. Join us in our mission to make fashion both beautiful and responsible.','image','/images/IMG_0785.JPG')
  )
));