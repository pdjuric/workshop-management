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

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-20 14:05:23
