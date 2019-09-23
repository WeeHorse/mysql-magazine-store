# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.6.36)
# Database: magazine_store_acl
# Generation Time: 2019-09-23 19:47:06 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table access
# ------------------------------------------------------------

DROP TABLE IF EXISTS `access`;

CREATE TABLE `access` (
  `path` varchar(255) NOT NULL DEFAULT '',
  `role` int(11) unsigned DEFAULT NULL,
  `create` tinyint(1) NOT NULL DEFAULT '0',
  `read` tinyint(1) NOT NULL DEFAULT '0',
  `update` tinyint(1) NOT NULL DEFAULT '0',
  `delete` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `access` WRITE;
/*!40000 ALTER TABLE `access` DISABLE KEYS */;

INSERT INTO `access` (`path`, `role`, `create`, `read`, `update`, `delete`)
VALUES
	('/rest/login',1,1,1,0,0),
	('/rest/login',2,0,1,0,1),
	('/rest/users',2,0,1,1,0),
	('/rest/users',1,1,0,0,0),
	('/rest/categories',0,0,1,0,0),
	('/rest/products',0,0,1,0,0),
	('/rest/register',1,1,0,0,0),
	('/rest/usersXroles',1,1,0,0,0),
	('/rest/carts',3,1,1,1,1),
	('/rest/cart',0,1,1,1,1),
	('/rest/products',3,1,1,1,1);

/*!40000 ALTER TABLE `access` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table carts
# ------------------------------------------------------------

DROP TABLE IF EXISTS `carts`;

CREATE TABLE `carts` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `product` int(11) NOT NULL,
  `amount` int(11) NOT NULL DEFAULT '1',
  `session` varchar(255) DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;

INSERT INTO `carts` (`id`, `product`, `amount`, `session`, `user`)
VALUES
	(44,2,1,'1vkZTlZuZwJNz9_UjtH2I4tcUDULlRd7',NULL),
	(45,2,1,'1vkZTlZuZwJNz9_UjtH2I4tcUDULlRd7',NULL),
	(46,1,1,'1vkZTlZuZwJNz9_UjtH2I4tcUDULlRd7',NULL),
	(47,2,1,'1vkZTlZuZwJNz9_UjtH2I4tcUDULlRd7',2),
	(48,1,1,'1vkZTlZuZwJNz9_UjtH2I4tcUDULlRd7',2),
	(49,1,1,'1vkZTlZuZwJNz9_UjtH2I4tcUDULlRd7',2),
	(50,1,1,'l8N8Ct02iKxR8AactWPezOZ0AoP9Txeh',2),
	(51,2,1,'l8N8Ct02iKxR8AactWPezOZ0AoP9Txeh',2);

/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table categories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;

INSERT INTO `categories` (`id`, `name`)
VALUES
	(1,'Newspapers'),
	(2,'Magazines');

/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table products
# ------------------------------------------------------------

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `vat` double(3,2) DEFAULT NULL,
  `artnr` varchar(255) DEFAULT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;

INSERT INTO `products` (`id`, `name`, `price`, `vat`, `artnr`, `description`, `image`)
VALUES
	(1,'New Yorker',190.00,0.25,'NY','The dapper mag','newyorker.jpg'),
	(2,'Passé',50.00,0.06,'PA','But we want to be the dapper mag','passe.jpg'),
	(3,'Bamse',79.50,0.06,'BA','Samhällets vagga','bamse.jpg'),
	(4,'Trillium',779.50,0.25,'TR','Rare rural writing recovered','trillium.jpg');

/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table orders
# ------------------------------------------------------------

DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user` int(11) unsigned NOT NULL,
  `placed` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `contents` text,
  `status` enum('PLACED','PAYED','SHIPPED') NOT NULL DEFAULT 'PLACED',
  `changed` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table roles
# ------------------------------------------------------------

DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;

INSERT INTO `roles` (`id`, `type`)
VALUES
	(1,'anonymous'),
	(2,'customer'),
	(3,'admin'),
	(4,'super');

/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table sessions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `sessions`;

CREATE TABLE `sessions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `varukorg` int(11) unsigned NOT NULL,
  `role` int(11) unsigned NOT NULL,
  `user` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) DEFAULT '',
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `email`, `password`, `firstname`, `lastname`)
VALUES
	(1,'benjamin.berglund@devoote.se','abc123','Benjamin','Berglund'),
	(2,'admin@magazinestore.se','abc123','Magazine','Admin'),
	(3,'super@magazinestore.se','abc123','Magazine','Super'),
	(13,'benjaminberglund@gmail.com','abc123','GoogleBen','Benjamin');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table usersXroles
# ------------------------------------------------------------

DROP TABLE IF EXISTS `usersXroles`;

CREATE TABLE `usersXroles` (
  `user` int(11) unsigned NOT NULL,
  `role` int(11) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `usersXroles` WRITE;
/*!40000 ALTER TABLE `usersXroles` DISABLE KEYS */;

INSERT INTO `usersXroles` (`user`, `role`)
VALUES
	(1,2),
	(2,3),
	(3,4),
	(13,2);

/*!40000 ALTER TABLE `usersXroles` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
