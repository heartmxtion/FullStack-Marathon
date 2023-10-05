CREATE SCHEMA `race01` ;
use race01;

CREATE TABLE users (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  name varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  email varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  password varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  avatar varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'avatarPlaceholder.jpg',
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
);