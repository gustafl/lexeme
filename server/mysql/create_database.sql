CREATE DATABASE `lexeme` DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;

USE `lexeme`;

CREATE TABLE `language` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `code` varchar(5) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_idx` (`code`)
);

CREATE TABLE `lexical_category` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `grammatical_category` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NULL,
  `lexical_category` tinyint(3) unsigned NOT NULL,
  `subgroup` bit(2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `lexical_category_fk_idx` (`lexical_category`),
  CONSTRAINT `grammatical_category_lexical_category_fk` FOREIGN KEY (`lexical_category`) REFERENCES `lexical_category` (`id`)
);

CREATE TABLE `grammeme` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `grammatical_category` tinyint(3) unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `grammatical_category_fk_idx` (`grammatical_category`),
  CONSTRAINT `grammeme_grammatical_category_fk` FOREIGN KEY (`grammatical_category`) REFERENCES `grammatical_category` (`id`)
);

CREATE TABLE `lexeme` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `language` tinyint(3) unsigned NOT NULL,
  `lexical_category` tinyint(3) unsigned NOT NULL,
  `spelling` varchar(100) NOT NULL,
  `pronounciation` varchar(100) NULL,
  PRIMARY KEY (`id`),
  KEY `language_fk_idx` (`language`),
  KEY `lexical_category_fk_idx` (`lexical_category`),
  CONSTRAINT `lexeme_language_fk` FOREIGN KEY (`language`) REFERENCES `language` (`id`),
  CONSTRAINT `lexeme_lexical_category_fk` FOREIGN KEY (`lexical_category`) REFERENCES `lexical_category` (`id`)
);

CREATE TABLE `inflection` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `lexeme` int(10) unsigned NOT NULL,
  `spelling` varchar(100) NOT NULL,
  `pronounciation` varchar(100) NULL,
  PRIMARY KEY (`id`),
  KEY `lexeme_fk_idx` (`lexeme`),
  CONSTRAINT `inflection_lexeme_fk` FOREIGN KEY (`lexeme`) REFERENCES `lexeme` (`id`)
);

CREATE TABLE `lexeme_grammatical_category` (
  `lexeme` int(10) unsigned NOT NULL,
  `grammatical_category` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`lexeme`,`grammatical_category`),
  KEY `lexeme_fk_idx` (`lexeme`),
  KEY `grammatical_category_fk_idx` (`grammatical_category`),
  CONSTRAINT `lexeme_grammatical_category_grammatical_category_fk` FOREIGN KEY (`grammatical_category`) REFERENCES `grammatical_category` (`id`),
  CONSTRAINT `lexeme_grammatical_category_lexeme_fk` FOREIGN KEY (`lexeme`) REFERENCES `lexeme` (`id`)
);

CREATE TABLE `inflection_grammatical_category` (
  `inflection` int(10) unsigned NOT NULL,
  `grammatical_category` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`inflection`,`grammatical_category`),
  KEY `inflection_fk_idx` (`inflection`),
  KEY `grammatical_category_fk_idx` (`grammatical_category`),
  CONSTRAINT `inflection_grammatical_category_grammatical_category_fk` FOREIGN KEY (`grammatical_category`) REFERENCES `grammatical_category` (`id`),
  CONSTRAINT `inflection_grammatical_category_inflection_fk` FOREIGN KEY (`inflection`) REFERENCES `inflection` (`id`)
);

CREATE TABLE `language_grammatical_category` (
  `language` tinyint(3) unsigned NOT NULL,
  `grammatical_category` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`language`,`grammatical_category`),
  KEY `language_fk_idx` (`language`),
  KEY `grammatical_category_fk_idx` (`grammatical_category`),
  CONSTRAINT `language_grammatical_category_grammatical_category_fk` FOREIGN KEY (`grammatical_category`) REFERENCES `grammatical_category` (`id`),
  CONSTRAINT `language_grammatical_category_language_fk` FOREIGN KEY (`language`) REFERENCES `language` (`id`)
);

CREATE TABLE `language_grammeme` (
  `language` tinyint(3) unsigned NOT NULL,
  `grammeme` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`language`,`grammeme`),
  KEY `language_fk_idx` (`language`),
  KEY `grammeme_fk_idx` (`grammeme`),
  CONSTRAINT `language_grammeme_grammeme_fk` FOREIGN KEY (`grammeme`) REFERENCES `grammeme` (`id`),
  CONSTRAINT `language_grammeme_language_fk` FOREIGN KEY (`language`) REFERENCES `language` (`id`)
);
