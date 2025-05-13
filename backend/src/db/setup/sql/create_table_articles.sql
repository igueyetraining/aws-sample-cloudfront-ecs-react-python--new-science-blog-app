CREATE TABLE `articles` (
    `id` int NOT NULL AUTO_INCREMENT,
    `title` varchar(100) NOT NULL,
    `date` varchar(45) NOT NULL,
    `author` varchar(50) NOT NULL,
    `text` varchar(2000) DEFAULT NULL,
    `agency` varchar(50) DEFAULT NULL,
    `category` varchar(45) DEFAULT NULL,
    `user_submitted` tinyint DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `category_idx` (`category`),
    CONSTRAINT `category` FOREIGN KEY (`category`) REFERENCES `categories` (`category`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;