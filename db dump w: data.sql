-- MySQL dump 10.13  Distrib 8.0.32, for macos13 (x86_64)
--
-- Host: 127.0.0.1    Database: pia_proj
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Chat`
--

DROP TABLE IF EXISTS `Chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Chat` (
  `idMessage` int NOT NULL AUTO_INCREMENT,
  `sentByParticipant` tinyint(1) NOT NULL,
  `text` varchar(200) DEFAULT NULL,
  `idConversation` int DEFAULT NULL,
  `dateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`idMessage`),
  KEY `Chat_Conversation_idConversation_fk` (`idConversation`),
  CONSTRAINT `Chat_Conversation_idConversation_fk` FOREIGN KEY (`idConversation`) REFERENCES `Conversation` (`idConversation`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Chat`
--

LOCK TABLES `Chat` WRITE;
/*!40000 ALTER TABLE `Chat` DISABLE KEYS */;
INSERT INTO `Chat` (`idMessage`, `sentByParticipant`, `text`, `idConversation`, `dateTime`) VALUES (1,1,'Hey, Id like to get some info about your workshop!',1,'2023-02-18 11:37:12'),(2,1,'is that okay?',1,'2023-02-18 11:37:25'),(3,1,':)',1,'2023-02-18 11:37:34'),(4,1,'Heyy! Wassup?',2,'2023-02-20 13:02:38');
/*!40000 ALTER TABLE `Chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Comment`
--

DROP TABLE IF EXISTS `Comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Comment` (
  `idComment` int NOT NULL AUTO_INCREMENT,
  `idWorkshop` int DEFAULT NULL,
  `username` varchar(45) DEFAULT NULL,
  `text` varchar(200) DEFAULT NULL,
  `dateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`idComment`),
  KEY `FK_comment_user` (`username`),
  KEY `FK_comment_workshop` (`idWorkshop`),
  CONSTRAINT `FK_comment_user` FOREIGN KEY (`username`) REFERENCES `User` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_comment_workshop` FOREIGN KEY (`idWorkshop`) REFERENCES `Workshop` (`idWorkshop`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comment`
--

LOCK TABLES `Comment` WRITE;
/*!40000 ALTER TABLE `Comment` DISABLE KEYS */;
INSERT INTO `Comment` (`idComment`, `idWorkshop`, `username`, `text`, `dateTime`) VALUES (1,5,'zika','Maybe the best class I\'ve ever attended ! Edited','2023-02-20 12:37:40'),(2,9,'zika','Hong Thong is LIT !!!','2023-02-20 12:38:13'),(3,9,'zika','Try deleting this one :)','2023-02-20 13:00:14');
/*!40000 ALTER TABLE `Comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Conversation`
--

DROP TABLE IF EXISTS `Conversation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Conversation` (
  `idConversation` int NOT NULL AUTO_INCREMENT,
  `idWorkshop` int DEFAULT NULL,
  `participant` varchar(45) NOT NULL,
  `organizer` varchar(45) NOT NULL,
  PRIMARY KEY (`idConversation`),
  KEY `FK_conversation_organizer` (`organizer`),
  KEY `FK_conversation_participant` (`participant`),
  KEY `FK_conversation_workshop` (`idWorkshop`),
  CONSTRAINT `FK_conversation_organizer` FOREIGN KEY (`organizer`) REFERENCES `User` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_conversation_participant` FOREIGN KEY (`participant`) REFERENCES `User` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_conversation_workshop` FOREIGN KEY (`idWorkshop`) REFERENCES `Workshop` (`idWorkshop`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Conversation`
--

LOCK TABLES `Conversation` WRITE;
/*!40000 ALTER TABLE `Conversation` DISABLE KEYS */;
INSERT INTO `Conversation` (`idConversation`, `idWorkshop`, `participant`, `organizer`) VALUES (1,2,'paja','admin'),(2,5,'zika','ana'),(3,6,'zika','admin');
/*!40000 ALTER TABLE `Conversation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Subscription`
--

DROP TABLE IF EXISTS `Subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Subscription` (
  `username` varchar(45) NOT NULL,
  `idWorkshop` int NOT NULL,
  PRIMARY KEY (`username`,`idWorkshop`),
  KEY `Subscription_Workshop_idWorkshop_fk` (`idWorkshop`),
  CONSTRAINT `Subscription_User_username_fk` FOREIGN KEY (`username`) REFERENCES `User` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Subscription_Workshop_idWorkshop_fk` FOREIGN KEY (`idWorkshop`) REFERENCES `Workshop` (`idWorkshop`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Subscription`
--

LOCK TABLES `Subscription` WRITE;
/*!40000 ALTER TABLE `Subscription` DISABLE KEYS */;
/*!40000 ALTER TABLE `Subscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `telephone` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `image` varchar(45) NOT NULL,
  `status` varchar(8) NOT NULL,
  `user_type` varchar(12) NOT NULL DEFAULT 'participant',
  `org_name` varchar(45) DEFAULT NULL,
  `org_country` varchar(45) DEFAULT NULL,
  `org_city` varchar(45) DEFAULT NULL,
  `org_street` varchar(45) DEFAULT NULL,
  `org_number` varchar(45) DEFAULT NULL,
  `org_rn` varchar(45) DEFAULT NULL,
  `temp_password` varchar(40) DEFAULT NULL,
  `temp_dateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` (`first_name`, `last_name`, `username`, `password`, `telephone`, `email`, `image`, `status`, `user_type`, `org_name`, `org_country`, `org_city`, `org_street`, `org_number`, `org_rn`, `temp_password`, `temp_dateTime`) VALUES ('Admin','Adminic','admin','123','0653348720','pdjuric01@icloud.com','1676541575982-270338536.jpg','active','admin',NULL,NULL,NULL,NULL,NULL,NULL,'7^wxfeqlQ','2023-02-16 01:42:17'),('Ana','Anic','ana','Bbbb123_','0633348267','batik04vacuole@icloud.com','1676541575982-270338536.jpg','active','organizer',NULL,NULL,NULL,NULL,NULL,NULL,'ruxYl2na|n',NULL),('Ivan','Ivanovic','ivan','Aaaa123_','6262474720','regent.east_0q@icloud.com','1676862709521-817294378.jpg','active','organizer','OrganizacIvan','Thailand','Bangkok','Rambuttri','23','112420420',NULL,NULL),('Luka','Lukic','luka','Aaaa123_','0074538','cutlets.group.0j@icloud.com','1676859929798-791450014.jpg','pending','participant',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('Maja','Majic','maja','Aaaa123_','065888732','plainer-chrome-0z@icloud.com','1676541184876-423618847.jpg','active','participant',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('Marko','Markovic','marko','Aaaa123_','0627784530','pavledjurix@gmail.com','1676541184876-423618847.jpg','active','organizer',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('Mika','Mikic','mika','Aaaa123_','07725663','pickax.trawls_0p@icloud.com','1676859817011-689043660.jpg','pending','participant',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('Paja','Pajic','paja','Aaaa123_','0649932497','hearths-ingot.03@icloud.com','1676541361161-233677600.jpg','active','participant',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('Sonja','Sonjic','sonja','Aaaa123_','069221334','chicory-preface0e@icloud.com','1676541524516-499017973.jpg','declined','participant',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('Registered','By Admin','userByAdmin','Aaaa123_','6262474720','hostel.wolves.0i@icloud.com','1676862600461-921802830.jpg','active','participant',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('Zika','Zikic','zika','Aaaa123_','0628988732','bandeau.uplink0o@icloud.com','1676894542125-343958640.jpg','active','participant',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Workshop`
--

DROP TABLE IF EXISTS `Workshop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Workshop` (
  `idWorkshop` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `dateTime` datetime NOT NULL,
  `place` varchar(45) NOT NULL,
  `description` varchar(45) NOT NULL,
  `long_description` varchar(1000) NOT NULL,
  `organizer` varchar(45) DEFAULT NULL,
  `spots` int NOT NULL DEFAULT '0',
  `spots_left` int DEFAULT NULL,
  `map` varchar(45) DEFAULT NULL,
  `like_count` int NOT NULL DEFAULT '0',
  `main_image` varchar(30) DEFAULT NULL,
  `confirmed` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`idWorkshop`),
  KEY `FK_workshop_organizer_idx` (`organizer`),
  CONSTRAINT `FK_workshop_organizer` FOREIGN KEY (`organizer`) REFERENCES `User` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Workshop`
--

LOCK TABLES `Workshop` WRITE;
/*!40000 ALTER TABLE `Workshop` DISABLE KEYS */;
INSERT INTO `Workshop` (`idWorkshop`, `name`, `dateTime`, `place`, `description`, `long_description`, `organizer`, `spots`, `spots_left`, `map`, `like_count`, `main_image`, `confirmed`) VALUES (1,'Thai cooking class','2023-02-25 17:14:00','near Hin Ta Hin Yai','Thai cooking class','Learn how to make traditional Thai dishes like Pad Thai and Tom Yum','ana',20,20,'9.770903515619285,99.96237091012189',0,'1676542623879-343541679.jpg',0),(2,'Vinjak drinking','2023-02-19 19:02:00','Haad Son, Koh Phangan','Vinjak drinking at the beach','Join us in drinking Thai version of Vinjak - Hong Thong !!! At the Haad Son (Secret Beach)','admin',10,10,'9.770903515619285,99.96237091012189',0,'1676653892405-803783046.jpg',1),(3,'Thai cocktail class','2023-02-07 13:12:00','near Hin Ta Hin Yai','Thai cocktail class','Learn how to make traditional Thai cocktails LOL','ana',2,0,'9.770903515619285,99.96237091012189',0,'1676542786488-208684871.jpg',1),(4,'Thai cocktail class','2023-02-14 13:12:00','near Hin Ta Hin Yai','Thai cocktail class','Learn how to make traditional Thai cocktails LOL','ana',2,2,'9.770903515619285,99.96237091012189',0,'1676542786488-208684871.jpg',1),(5,'Thai cocktail class','2023-02-21 13:12:00','near Hin Ta Hin Yai','Thai cocktail class','Learn how to make traditional Thai cocktails LOL','ana',3,3,'9.770903515619285,99.96237091012189',1,'1676542786488-208684871.jpg',1),(6,'Thai cocktail class','2023-02-28 13:12:00','near Hin Ta Hin Yai','Thai cocktail class','Learn how to make traditional Thai cocktails LOL','admin',2,2,'9.770903515619285,99.96237091012189',1,'1676542786488-208684871.jpg',1),(7,'Vinjak drinking','2023-02-19 19:02:00','Haad Son, Koh Phangan','Vinjak drinking at the beach','Join us in drinking Thai version of Vinjak - Hong Thong !!! At the Haad Son (Secret Beach)','admin',5,2,'9.770903515619285,99.96237091012189',0,'1676653892405-803783046.jpg',1),(8,'Unconfirmed wine tasting','2023-02-27 12:08:00','Khao San, Bangkok','Wine tasting ofc','Wine tasting of course.....','ana',5,5,'13.759195308395354,100.49665062969466',0,'1676891418951-649639108.jpg',0),(9,'Vinjak drinking','2023-03-01 19:02:00','Haad Son, Koh Phangan','Vinjak drinking at the beach','Join us in drinking Thai version of Vinjak - Hong Thong !!! At the Haad Son (Secret Beach)','admin',5,5,'9.770903515619285,99.96237091012189',1,'1676653892405-803783046.jpg',1),(10,'Thai cocktail class','2023-02-28 13:12:00','near Hin Ta Hin Yai','Thai cocktail class','Learn how to make traditional Thai cocktails LOL','admin',2,2,'9.770903515619285,99.96237091012189',0,'1676542786488-208684871.jpg',1),(11,'Thai cocktail class','2023-02-28 13:12:00','near Hin Ta Hin Yai','Thai cocktail class','Learn how to make traditional Thai cocktails LOL','admin',2,2,'9.770903515619285,99.96237091012189',0,'1676542786488-208684871.jpg',1),(12,'Thai cocktail class','2023-02-28 13:12:00','near Hin Ta Hin Yai','Thai cocktail class','Learn how to make traditional Thai cocktails LOL','admin',2,2,'9.770903515619285,99.96237091012189',0,'1676542786488-208684871.jpg',1);
/*!40000 ALTER TABLE `Workshop` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WorkshopAttending`
--

DROP TABLE IF EXISTS `WorkshopAttending`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WorkshopAttending` (
  `idWorkshop` int NOT NULL,
  `username` varchar(45) NOT NULL,
  `confirmed` tinyint DEFAULT NULL,
  PRIMARY KEY (`idWorkshop`,`username`),
  KEY `FK_workshopAttending_username_idx` (`username`),
  CONSTRAINT `FK_workshopAttending_idWorkshop` FOREIGN KEY (`idWorkshop`) REFERENCES `Workshop` (`idWorkshop`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_workshopAttending_username` FOREIGN KEY (`username`) REFERENCES `User` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WorkshopAttending`
--

LOCK TABLES `WorkshopAttending` WRITE;
/*!40000 ALTER TABLE `WorkshopAttending` DISABLE KEYS */;
INSERT INTO `WorkshopAttending` (`idWorkshop`, `username`, `confirmed`) VALUES (3,'paja',1),(3,'zika',1),(6,'zika',0),(7,'maja',1),(7,'mika',0),(7,'paja',1),(7,'zika',1);
/*!40000 ALTER TABLE `WorkshopAttending` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WorkshopImages`
--

DROP TABLE IF EXISTS `WorkshopImages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WorkshopImages` (
  `idWorkshop` int NOT NULL,
  `image` varchar(30) DEFAULT NULL,
  `no` int NOT NULL,
  PRIMARY KEY (`idWorkshop`,`no`),
  CONSTRAINT `WorkshopImages_Workshop_idWorkshop_fk` FOREIGN KEY (`idWorkshop`) REFERENCES `Workshop` (`idWorkshop`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WorkshopImages`
--

LOCK TABLES `WorkshopImages` WRITE;
/*!40000 ALTER TABLE `WorkshopImages` DISABLE KEYS */;
INSERT INTO `WorkshopImages` (`idWorkshop`, `image`, `no`) VALUES (1,'1676542623903-631042978.jpg',0),(1,'1676542623903-29052966.jpg',1),(2,'1676654802428-346736719.jpg',0),(2,'1676654802434-153792699.jpg',1),(3,'1676542786506-212388041.jpg',0),(3,'1676542786509-233639744.jpg',1),(4,'1676542786506-212388041.jpg',0),(4,'1676542786509-233639744.jpg',1),(5,'1676542786506-212388041.jpg',0),(5,'1676542786509-233639744.jpg',1),(6,'1676542786506-212388041.jpg',0),(6,'1676542786509-233639744.jpg',1),(8,'1676891418976-33384641.jpg',0),(8,'1676891418980-741949567.jpg',1),(8,'1676891418984-46848386.jpg',2),(9,'1676654802428-346736719.jpg',0),(9,'1676654802434-153792699.jpg',1),(10,'1676542786506-212388041.jpg',0),(10,'1676542786509-233639744.jpg',1),(11,'1676542786506-212388041.jpg',0),(11,'1676542786509-233639744.jpg',1),(12,'1676895421015-545268102.jpg',0),(12,'1676895421020-24458508.jpg',2);
/*!40000 ALTER TABLE `WorkshopImages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WorkshopLikes`
--

DROP TABLE IF EXISTS `WorkshopLikes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WorkshopLikes` (
  `idWorkshop` int NOT NULL,
  `username` varchar(45) NOT NULL,
  PRIMARY KEY (`idWorkshop`,`username`),
  KEY `FK_workshoplikes_username_idx` (`username`),
  CONSTRAINT `WorkshopLikes_User_username_fk` FOREIGN KEY (`username`) REFERENCES `User` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `WorkshopLikes_Workshop_idWorkshop_fk` FOREIGN KEY (`idWorkshop`) REFERENCES `Workshop` (`idWorkshop`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WorkshopLikes`
--

LOCK TABLES `WorkshopLikes` WRITE;
/*!40000 ALTER TABLE `WorkshopLikes` DISABLE KEYS */;
INSERT INTO `WorkshopLikes` (`idWorkshop`, `username`) VALUES (5,'zika'),(6,'zika'),(9,'zika');
/*!40000 ALTER TABLE `WorkshopLikes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-20 14:05:23
