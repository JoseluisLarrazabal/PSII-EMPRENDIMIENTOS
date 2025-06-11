-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: incuvalab
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administrador`
--

DROP TABLE IF EXISTS `administrador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrador` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `administrador_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrador`
--

LOCK TABLES `administrador` WRITE;
/*!40000 ALTER TABLE `administrador` DISABLE KEYS */;
/*!40000 ALTER TABLE `administrador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `challenger`
--

DROP TABLE IF EXISTS `challenger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `challenger` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_fin` time DEFAULT NULL,
  `contacto_email` varchar(200) DEFAULT NULL,
  `destacado` tinyint(1) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `administrador_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `administrador_id` (`administrador_id`),
  CONSTRAINT `challenger_ibfk_1` FOREIGN KEY (`administrador_id`) REFERENCES `administrador` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `challenger`
--

LOCK TABLES `challenger` WRITE;
/*!40000 ALTER TABLE `challenger` DISABLE KEYS */;
INSERT INTO `challenger` VALUES (1,'Taller de Innovación Tecnológica','http://imgfz.com/i/xZPtAlF.jpeg','2023-11-23','09:00:00','13:00:00','talleres@innovacion.com',1,'2025-05-10 12:59:42',NULL),(2,'Conferencia de Marketing Digital','http://imgfz.com/i/JxtHdeO.jpeg','2023-11-20','15:30:00','18:00:00','info@marketingeventos.com',1,'2025-05-10 12:59:42',NULL),(4,'Workshop de Desarrollo Web','https://18chulos.com/wp-content/uploads/2024/01/speaker-conferencias-y-charlas-motivacionales-18-chulos-1024x731.jpg','2023-12-12','14:00:00','17:00:00','workshops@tecnologia.edu',1,'2025-05-10 12:59:42',NULL);
/*!40000 ALTER TABLE `challenger` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `birth_date` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `segment` enum('VIP','Regular','New') DEFAULT 'New',
  `purchase_count` int DEFAULT '0',
  `total_spent` decimal(10,2) DEFAULT '0.00',
  `last_purchase_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `notes` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contactos`
--

DROP TABLE IF EXISTS `contactos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contactos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `envio_formulario` date DEFAULT NULL,
  `nombres` varchar(100) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `seleccion` varchar(100) NOT NULL,
  `mensaje_enviado` varchar(255) DEFAULT NULL,
  `administrador_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `administrador_id` (`administrador_id`),
  CONSTRAINT `contactos_ibfk_1` FOREIGN KEY (`administrador_id`) REFERENCES `administrador` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contactos`
--

LOCK TABLES `contactos` WRITE;
/*!40000 ALTER TABLE `contactos` DISABLE KEYS */;
INSERT INTO `contactos` VALUES (1,'2025-05-10','Manuel','shadow@gmail.com','+51123456789','Información de servicios','asdsad',NULL),(8,'2025-05-27','Alejandro Guzman','Goug@gmail.com','+59165503582','Información de servicios','Hola',NULL),(10,'2025-05-28','Karen Poma','karen@gmail.com','+59178784541','Soporte técnico','Mensaje de prueba',NULL),(11,'2025-06-05','Manuel goku','Goug@gmail.com','+591789798798798798','Soporte técnico','AASDASDASD',NULL);
/*!40000 ALTER TABLE `contactos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curso`
--

DROP TABLE IF EXISTS `curso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contenido_imagen` varchar(500) DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `quiz` text,
  `documentacion_url` varchar(500) DEFAULT NULL,
  `administrador_id` int DEFAULT NULL,
  `titulo` varchar(255) DEFAULT NULL COMMENT 'T├¡tulo del curso',
  `descripcion` text COMMENT 'Descripci├│n detallada del curso',
  `fecha_inicio` datetime DEFAULT NULL COMMENT 'Fecha de inicio del curso',
  `duracion` varchar(50) DEFAULT NULL COMMENT 'Duraci├│n del curso (ejemplo: 8 semanas)',
  `horas_esfuerzo` int DEFAULT NULL COMMENT 'Horas semanales de esfuerzo',
  `idioma` varchar(50) DEFAULT 'Espa├▒ol' COMMENT 'Idioma principal del curso',
  `nivel` varchar(50) DEFAULT NULL COMMENT 'Nivel: Principiante, Intermedio, Avanzado',
  `prerequisitos` text COMMENT 'Requisitos previos',
  `certificado` tinyint(1) DEFAULT '0' COMMENT 'Si ofrece certificado',
  `syllabus` json DEFAULT NULL COMMENT 'Estructura del curso en formato JSON',
  PRIMARY KEY (`id`),
  KEY `administrador_id` (`administrador_id`),
  CONSTRAINT `curso_ibfk_1` FOREIGN KEY (`administrador_id`) REFERENCES `administrador` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curso`
--

LOCK TABLES `curso` WRITE;
/*!40000 ALTER TABLE `curso` DISABLE KEYS */;
/*!40000 ALTER TABLE `curso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curso_instructores`
--

DROP TABLE IF EXISTS `curso_instructores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curso_instructores` (
  `curso_id` int NOT NULL,
  `instructor_id` int NOT NULL,
  `is_main_instructor` tinyint(1) DEFAULT '0' COMMENT 'Indica si es instructor principal',
  PRIMARY KEY (`curso_id`,`instructor_id`),
  KEY `idx_instructor_id` (`instructor_id`),
  CONSTRAINT `fk_curso_instructores_curso` FOREIGN KEY (`curso_id`) REFERENCES `curso` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_curso_instructores_instructor` FOREIGN KEY (`instructor_id`) REFERENCES `mooc_instructors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curso_instructores`
--

LOCK TABLES `curso_instructores` WRITE;
/*!40000 ALTER TABLE `curso_instructores` DISABLE KEYS */;
/*!40000 ALTER TABLE `curso_instructores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emprendedor`
--

DROP TABLE IF EXISTS `emprendedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emprendedor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `proyecto_nombre` varchar(150) DEFAULT NULL,
  `descripcion_apoyo` text,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `emprendedor_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emprendedor`
--

LOCK TABLES `emprendedor` WRITE;
/*!40000 ALTER TABLE `emprendedor` DISABLE KEYS */;
/*!40000 ALTER TABLE `emprendedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empresas_servicios`
--

DROP TABLE IF EXISTS `empresas_servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresas_servicios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `imagen_url` varchar(255) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descripcion` varchar(500) NOT NULL,
  `subtitulo` varchar(255) NOT NULL,
  `servicios` text NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresas_servicios`
--

LOCK TABLES `empresas_servicios` WRITE;
/*!40000 ALTER TABLE `empresas_servicios` DISABLE KEYS */;
INSERT INTO `empresas_servicios` VALUES (1,'https://www.univalle.edu/wp-content/uploads/2023/07/WhatsApp-Image-2023-07-12-at-15.16.57-1024x576.jpeg','EMPRESAS','Datos de Revenue','ASESORAMIENTO ESTRATEGICO EN GESTIÓN DE LA TRANSFERENCIA TECNOLÓGICA','Elaboración de estrategias de protección intelectual \nScouting de tecnologías \nVigilancia tecnológica\nMonitoreo de competencia o actores relevantes del sector\nBúsqueda del estado de la técnica\nManejo de datos real','2025-05-11 19:58:16'),(2,'https://www.univalle.edu/wp-content/uploads/2023/11/1-1024x576.jpg','Reunión de TEDX','Este sirve principalmente para un manejo de la empresa, con todo lo qué necesitas para poder guiarte en tu emprendimiento respectivo y triunfar en las metas qué tienes','GUÍA PARA EL MANEJO DEL EXITO EMPRESARIAL','Servicio 1\nServicio 2\nServicio 3\nServicio 4','2025-05-11 22:44:44'),(3,'https://www.univalle.edu/wp-content/uploads/2024/06/3-1.png','Manejo de presupuesto ','Manejo empático para el desarrollo de un emprendimiento seguro','TRANSFERENCIA TECNOLÓGICA','Desarrollo de manejo al presupuesto\nMantenimiento de la empresa','2025-05-12 00:46:08'),(6,'https://www.univalle.edu/wp-content/uploads/2022/11/1-1024x576.png','Laboratorios','Nuevo laboratorio para ayudarte en los emprendimientos','Univalle','Rapido\nOrganizado','2025-05-28 02:25:26');
/*!40000 ALTER TABLE `empresas_servicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventos`
--

DROP TABLE IF EXISTS `eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text,
  `fecha_evento` date NOT NULL,
  `hora` time DEFAULT NULL,
  `lugar` varchar(100) DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `administrador_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `administrador_id` (`administrador_id`),
  CONSTRAINT `eventos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE SET NULL,
  CONSTRAINT `eventos_ibfk_2` FOREIGN KEY (`administrador_id`) REFERENCES `administrador` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventos`
--

LOCK TABLES `eventos` WRITE;
/*!40000 ALTER TABLE `eventos` DISABLE KEYS */;
INSERT INTO `eventos` VALUES (1,'Nuevo','adsadasd','2025-05-02','22:00:00','asd',NULL,NULL),(7,'Innovación en la Era Digital','asdasdasda','2025-03-26','04:18:00','Bolivia',NULL,NULL),(8,'Reunión de TEDX','Hola mundo','2025-04-16','16:51:00','Univalle',NULL,NULL),(12,'Eventos Univalle','Reunión Univalle','2025-05-29','06:37:00','Sede Tiquipaya',NULL,NULL),(13,'CochaHacking','Es un evento de encuentro de todos los programadores de bolivia','2025-05-29','23:55:00','Sede Tiquipaya',NULL,NULL),(14,'EVENTO 1','EVENTO','2025-06-12','10:00:00','CAMPUS TIQUIPAYA',NULL,NULL);
/*!40000 ALTER TABLE `eventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inspiring`
--

DROP TABLE IF EXISTS `inspiring`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inspiring` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(200) DEFAULT NULL,
  `speaker` varchar(100) DEFAULT NULL,
  `descripcion` text,
  `imagen_url` varchar(500) DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `contacto_email` varchar(200) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `administrador_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `administrador_id` (`administrador_id`),
  CONSTRAINT `inspiring_ibfk_1` FOREIGN KEY (`administrador_id`) REFERENCES `administrador` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inspiring`
--

LOCK TABLES `inspiring` WRITE;
/*!40000 ALTER TABLE `inspiring` DISABLE KEYS */;
INSERT INTO `inspiring` VALUES (1,'Innovación en la Era Digital','Dra. Juan Guzman','Explorando las últimas tendencias en transformación digital y cómo aplicarlas en tu negocio','http://imgfz.com/i/sHSrTox.png','https://www.youtube.com/watch?v=l7h94jjt-p8&pp=ygUcaW5ub3ZhY2lvbiBlbiBsYSBlcmEgZGlnaXRhbA%3D%3D','contacto@innovacion.com','2023-05-15 14:30:00',NULL),(2,'Liderazgo Empresarial','Juan ','Técnicas comprobadas para desarrollar habilidades de liderazgo en entornos corporativos','http://imgfz.com/i/0ltKeBZ.webp','https://www.youtube.com/watch?v=dv8LdkjOpjU&pp=ygUVbGlkZXJhemdvIGVtcHJlc2FyaWFs0gcJCYYJAYcqIYzv','info@liderazgo.com','2023-06-20 10:00:00',NULL),(5,'LIDIAR CON LAS FRUSTRACIOENS EN TÚ EMPRENDIMIENTO','Lic. Carla Aguilar','La charla siguiente te ayudara a superar esos momentos difíciles para continuar y no tirar la toalla ','https://tedxeixample.com/wp-content/uploads/2021/02/robert-ferrer-speaker-curator-tedx-eixample-2.jpg','https://www.youtube.com/watch?v=KWdrwp7K_rU&pp=ygUEdGVkeA%3D%3D','contacto@innovacion.com','2025-05-11 18:43:01',NULL),(8,'Reunión de TEDX','Dr. Juan Guzman','Charla sobre los emprendimientos y todas las dificultades qué conlleva','http://imgfz.com/i/NsF5ODp.jpeg','https://www.youtube.com/watch?v=l7h94jjt-p8&pp=ygUcaW5ub3ZhY2lvbiBlbiBsYSBlcmEgZGlnaXRhbA%3D%3D','juan@gmail.com','2025-05-16 03:18:14',NULL),(9,'Innovación en la Era Digital','Ing. Gustavo Cruz','En esta charla te vas a motivar principalmente para digitalizar tu empresa','https://uni.edu.gt/wp-content/uploads/sites/19/2024/04/Administracion-de-Empresas-Concepto-y-Funciones3.jpg','https://www.youtube.com/watch?v=KWdrwp7K_rU&pp=ygUEdGVkeA%3D%3D','goku@gmail.com','2025-05-16 18:27:54',NULL),(10,'Movimiento de las empresas ','Dr. Christian Montaño','Bienvenido al acceso de las empresas qué estan dispuestas para lograr tu éxito','https://tuseteventos.com/wp-content/uploads/2022/04/que-sabes-sobre-las-charlas-motivacionales-1024x576.jpg','https://www.youtube.com/watch?v=l7h94jjt-p8&pp=ygUcaW5ub3ZhY2lvbiBlbiBsYSBlcmEgZGlnaXRhbA%3D%3D','info@marketingeventos.com','2025-05-19 21:21:48',NULL),(11,'PRUEBA','Sergio D','Prueba 2025','https://somospnt.com/images/charlaa.jpg','https://youtu.be/CLCJaiyjKkc?si=jFawnclduK_DoWaR','contacto@innovacion.com','2025-05-28 12:38:44',NULL);
/*!40000 ALTER TABLE `inspiring` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `institucion`
--

DROP TABLE IF EXISTS `institucion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `institucion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `nombre_institucion` varchar(150) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `descripcion_apoyo` text,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `institucion_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institucion`
--

LOCK TABLES `institucion` WRITE;
/*!40000 ALTER TABLE `institucion` DISABLE KEYS */;
/*!40000 ALTER TABLE `institucion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `learning`
--

DROP TABLE IF EXISTS `learning`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `learning` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombreCurso` varchar(255) NOT NULL,
  `duenoCurso` varchar(255) NOT NULL,
  `logoCurso` varchar(500) NOT NULL,
  `bannerCurso` varchar(500) NOT NULL,
  `administrador_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `administrador_id` (`administrador_id`),
  CONSTRAINT `learning_ibfk_1` FOREIGN KEY (`administrador_id`) REFERENCES `administrador` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learning`
--

LOCK TABLES `learning` WRITE;
/*!40000 ALTER TABLE `learning` DISABLE KEYS */;
/*!40000 ALTER TABLE `learning` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lecciones`
--

DROP TABLE IF EXISTS `lecciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lecciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `curso_id` int NOT NULL COMMENT 'Clave foránea al curso al que pertenece esta lección',
  `titulo` varchar(255) NOT NULL COMMENT 'Título de la lección/slide',
  `orden` int NOT NULL COMMENT 'Orden secuencial de la lección dentro del curso',
  `contenido_texto` text COMMENT 'Contenido principal de texto de la lección (puede incluir HTML/Markdown)',
  `video_url` varchar(500) DEFAULT NULL COMMENT 'URL del video para esta lección (si aplica)',
  `embed_url` varchar(500) DEFAULT NULL COMMENT 'URL de contenido embebido para esta lección (ej. presentación, simulador) (si aplica)',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_leccion_orden` (`curso_id`,`orden`),
  CONSTRAINT `lecciones_ibfk_1` FOREIGN KEY (`curso_id`) REFERENCES `curso` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Almacena las lecciones o slides individuales de un curso.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lecciones`
--

LOCK TABLES `lecciones` WRITE;
/*!40000 ALTER TABLE `lecciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `lecciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mentor`
--

DROP TABLE IF EXISTS `mentor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mentor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `area_experiencia` varchar(150) DEFAULT NULL,
  `disponibilidad` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `mentor_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mentor`
--

LOCK TABLES `mentor` WRITE;
/*!40000 ALTER TABLE `mentor` DISABLE KEYS */;
INSERT INTO `mentor` VALUES (10,1,'http://imgfz.com/i/0sBxyqo.jpeg','Alejandra  Guzman','545217244','Marketing Digital','Martes y Jueves 10:00-15:00'),(11,1,'http://imgfz.com/i/aSIwjzh.jpeg','Alexander Barrera','4545454','Diseño Gráfico','Lunes, Miércoles, Viernes 8:00-14:00'),(12,1,'http://imgfz.com/i/bTZdcyL.jpeg','Ana Martínez','45456456','Redes Sociales','Fines de semana'),(13,1,'http://imgfz.com/i/sxuVMrt.jpeg','Ángela Guzman','456456','Programación Backend','Horario flexible'),(14,1,'http://imgfz.com/i/lfCAni9.jpeg','Laura Fernández','456456456','SEO y Analytics','Lunes a Jueves 9:00-17:00'),(15,1,'http://imgfz.com/i/GlWYU3z.jpeg','Pablo Rodríguez','454545','Inteligencia Artificial','Miércoles y Viernes 10:00-19:00'),(16,1,'http://imgfz.com/i/Upcs6G4.jpeg','Sofía Gómez','456456456','Diseño UX/UI','Jornada completa'),(23,1,'https://i.pinimg.com/736x/12/5d/cd/125dcd8ee7d52a9e84e8f0a016e9dbdd.jpg','Guzman Juan','456456','Licenciado en matemáticas','Lunes a viernes');
/*!40000 ALTER TABLE `mentor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mentoring`
--

DROP TABLE IF EXISTS `mentoring`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mentoring` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mentor_id` int DEFAULT NULL,
  `me_interesa` tinyint(1) DEFAULT NULL,
  `no_me_interesa` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mentor_id` (`mentor_id`),
  CONSTRAINT `mentoring_ibfk_1` FOREIGN KEY (`mentor_id`) REFERENCES `mentor` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mentoring`
--

LOCK TABLES `mentoring` WRITE;
/*!40000 ALTER TABLE `mentoring` DISABLE KEYS */;
INSERT INTO `mentoring` VALUES (1,10,0,1),(2,11,1,0),(3,NULL,1,0),(4,NULL,1,0),(5,10,1,0),(6,11,1,0),(7,NULL,1,0),(8,10,1,0),(9,11,1,0),(10,11,1,0),(11,10,1,0),(12,12,1,0),(13,NULL,1,0),(14,11,1,0),(15,NULL,1,0),(16,10,1,0),(17,11,1,0),(18,NULL,1,0),(19,10,1,0),(20,11,1,0),(21,12,1,0),(22,13,1,0),(23,14,1,0),(24,NULL,1,0),(25,10,1,0),(26,11,1,0),(27,NULL,1,0),(28,10,1,0),(29,11,1,0),(30,NULL,1,0),(31,10,1,0),(32,11,1,0),(33,NULL,1,0),(34,10,1,0),(35,11,1,0),(36,NULL,1,0),(37,10,1,0),(38,11,1,0),(39,NULL,1,0),(40,NULL,1,0),(41,10,1,0),(42,11,1,0),(43,NULL,1,0),(44,10,1,0),(45,11,1,0),(46,NULL,0,1),(47,10,0,1),(48,11,1,0),(49,12,1,0),(50,13,1,0),(51,NULL,1,0),(52,10,1,0),(53,11,1,0),(54,NULL,1,0),(55,10,1,0),(56,11,1,0),(57,NULL,1,0),(58,10,1,0),(59,11,1,0),(60,NULL,1,0),(61,10,1,0),(62,NULL,1,0),(63,10,1,0),(64,NULL,1,0),(65,10,1,0),(66,11,1,0),(67,NULL,1,0),(68,10,1,0),(69,11,1,0),(70,NULL,1,0),(71,NULL,1,0),(72,10,1,0),(73,NULL,1,0),(74,NULL,1,0),(75,NULL,1,0),(76,NULL,1,0),(77,10,1,0),(78,11,1,0),(79,NULL,1,0),(80,10,1,0),(81,11,1,0),(82,NULL,1,0),(83,10,1,0),(84,11,1,0),(85,NULL,1,0),(86,10,1,0),(87,11,1,0),(88,NULL,1,0),(89,10,1,0),(90,11,1,0),(91,NULL,1,0),(92,10,1,0),(93,11,1,0),(94,NULL,1,0),(95,10,1,0),(96,11,1,0),(97,NULL,1,0),(98,10,1,0),(99,11,1,0),(100,NULL,1,0),(101,10,1,0),(102,11,1,0),(103,NULL,1,0),(104,10,1,0),(105,11,1,0),(106,10,1,0),(107,11,1,0),(108,12,1,0),(109,10,1,0),(110,11,1,0),(111,12,1,0);
/*!40000 ALTER TABLE `mentoring` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mooc_catalog`
--

DROP TABLE IF EXISTS `mooc_catalog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mooc_catalog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `provider` varchar(100) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `logo_url` varchar(500) NOT NULL,
  `type` varchar(100) NOT NULL,
  `course_count` int DEFAULT NULL,
  `category` varchar(100) NOT NULL,
  `is_popular` tinyint(1) DEFAULT '0',
  `is_new` tinyint(1) DEFAULT '0',
  `is_trending` tinyint(1) DEFAULT '0',
  `curso_id` int DEFAULT NULL,
  `school_id` int DEFAULT NULL,
  `administrador_id` int DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `description` text COMMENT 'Descripci├│n detallada del curso',
  `start_date` datetime DEFAULT NULL COMMENT 'Fecha de inicio del curso',
  `duration` varchar(50) DEFAULT NULL COMMENT 'Duraci├│n del curso (ejemplo: 8 semanas)',
  `effort_hours` int DEFAULT NULL COMMENT 'Horas semanales de esfuerzo',
  `language` varchar(50) DEFAULT NULL COMMENT 'Idioma principal del curso',
  `level` varchar(50) DEFAULT NULL COMMENT 'Nivel: Principiante, Intermedio, Avanzado',
  `prerequisites` text COMMENT 'Requisitos previos',
  `enrollment_count` int DEFAULT '0' COMMENT 'N├║mero de estudiantes inscritos',
  `rating` decimal(3,2) DEFAULT '0.00' COMMENT 'Calificaci├│n promedio',
  `video_preview_url` varchar(500) DEFAULT NULL COMMENT 'URL de video de introducci├│n',
  `has_certificate` tinyint(1) DEFAULT '0' COMMENT 'Si ofrece certificado',
  PRIMARY KEY (`id`),
  KEY `curso_id` (`curso_id`),
  KEY `school_id` (`school_id`),
  KEY `administrador_id` (`administrador_id`),
  CONSTRAINT `mooc_catalog_ibfk_1` FOREIGN KEY (`curso_id`) REFERENCES `curso` (`id`) ON DELETE SET NULL,
  CONSTRAINT `mooc_catalog_ibfk_2` FOREIGN KEY (`school_id`) REFERENCES `mooc_schools` (`id`) ON DELETE SET NULL,
  CONSTRAINT `mooc_catalog_ibfk_3` FOREIGN KEY (`administrador_id`) REFERENCES `administrador` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mooc_catalog`
--

LOCK TABLES `mooc_catalog` WRITE;
/*!40000 ALTER TABLE `mooc_catalog` DISABLE KEYS */;
INSERT INTO `mooc_catalog` VALUES (1,'Executive Leadership Programme','OxfordX','/images/courses/exec-leadership.png','/images/institutions/oxford.png','Executive Education',NULL,'Executive Education',0,0,0,NULL,NULL,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0),(2,'MBA Essentials','LSE','/images/courses/mba-essentials.png','/images/institutions/lse.png','Executive Education',NULL,'Executive Education',0,0,0,NULL,NULL,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0),(3,'Artificial Intelligence: Implications for Business Strategy','MITx','/images/courses/ai-business.png','/images/institutions/mit.png','Executive Education',NULL,'Executive Education',0,0,0,NULL,2,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0),(4,'Business Sustainability Management','UniversityofCambridge','/images/courses/sustainability.png','/images/institutions/cambridge.png','Executive Education',NULL,'Executive Education',0,0,0,NULL,NULL,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0),(5,'Master of Business Administration','UNC-CH','/images/courses/mba.png','/images/institutions/unc.png','Masters',NULL,'Master\'s Degrees',0,0,0,NULL,NULL,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0),(6,'Master of Information and Data Science','BerkeleyX','/images/courses/data-science.png','/images/institutions/berkeley.png','Masters',NULL,'Master\'s Degrees',0,0,0,NULL,NULL,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0),(7,'Master of Science Artificial Intelligence','UOS','/images/courses/ai.png','/images/institutions/surrey.png','Masters',NULL,'Master\'s Degrees',0,0,0,NULL,NULL,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0),(8,'Master of Science Psychology','UOS','/images/courses/psychology.png','/images/institutions/surrey.png','Masters',NULL,'Master\'s Degrees',0,0,0,NULL,NULL,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0),(9,'Bachelor of Science in Economics and Finance','UniversityofLondon LSE','/images/courses/economics.png','/images/institutions/lse.png','Bachelors',NULL,'Bachelor\'s Degrees',0,0,0,NULL,NULL,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0),(10,'Bachelor of Science in Economics and Management','UniversityofLondon','/images/courses/management.png','/images/institutions/london.png','Bachelors',NULL,'Bachelor\'s Degrees',0,0,0,NULL,NULL,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0),(11,'Bachelor of Science in International Relations','UniversityofLondon LSE','/images/courses/international.png','/images/institutions/lse.png','Bachelors',NULL,'Bachelor\'s Degrees',0,0,0,NULL,NULL,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0),(12,'Bachelor of Science in Data Science and Business Analytics','UniversityofLondon','/images/courses/business-analytics.png','/images/institutions/london.png','Bachelors',NULL,'Bachelor\'s Degrees',0,0,0,NULL,NULL,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0),(13,'Computer Science for Web Programming','HarvardX','/images/courses/web-programming.png','/images/institutions/harvard.png','Professional Certificate',2,'Popular Courses',1,0,0,NULL,1,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0),(14,'Supply Chain Management','MITx','/images/courses/supply-chain.png','/images/institutions/mit2.png','MicroMasters',6,'Popular Courses',1,0,0,NULL,2,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0),(15,'Python Basics for Data Science','IBM','/images/courses/python-basics.png','/images/institutions/ibm.png','Course',NULL,'Popular Courses',1,0,0,NULL,NULL,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0),(16,'Corporate Finance','ColumbiaX','/images/courses/corporate-finance.png','/images/institutions/columbia.png','Professional Certificate',3,'Popular Courses',1,0,0,NULL,NULL,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0),(17,'Generative AI Engineering','IBM','/images/courses/gen-ai.png','/images/institutions/ibm.png','Professional Certificate',16,'New Courses',0,1,0,NULL,NULL,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0),(18,'Fundamentals of Digital Transformation','DartmouthX','/images/courses/digital-transform.png','/images/institutions/dartmouth.png','Course',NULL,'New Courses',0,1,0,NULL,NULL,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0),(19,'Applied Data Analysis and Visualisation for Business','LSE','/images/courses/data-viz.png','/images/institutions/lse.png','Executive Education',NULL,'New Courses',0,1,0,NULL,NULL,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0),(20,'English and Soft Skills For Tech Professionals','UCT','/images/courses/soft-skills.png','/images/institutions/capetown.png','Professional Certificate',3,'New Courses',0,1,0,NULL,NULL,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0),(21,'CS50\'s Introduction to Artificial Intelligence with Python','HarvardX','/images/courses/cs50-ai.png','/images/institutions/harvard.png','Course',NULL,'Trending Courses',0,0,1,NULL,1,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0),(22,'Becoming an Entrepreneur','MITx','/images/courses/entrepreneur.png','/images/institutions/mit2.png','Course',NULL,'Trending Courses',0,0,1,NULL,2,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0),(23,'AI for Everyone: Master the Basics','IBM','/images/courses/ai-everyone.png','/images/institutions/ibm.png','Course',NULL,'Trending Courses',0,0,1,NULL,NULL,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0),(24,'Learning Python for Data Science','HarvardX','/images/courses/python-data.png','/images/institutions/harvard.png','Professional Certificate',3,'Trending Courses',0,0,1,NULL,1,NULL,'2025-04-29 15:21:11',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0.00,NULL,0);
/*!40000 ALTER TABLE `mooc_catalog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mooc_course_subjects`
--

DROP TABLE IF EXISTS `mooc_course_subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mooc_course_subjects` (
  `catalog_id` int NOT NULL,
  `subject_id` int NOT NULL,
  PRIMARY KEY (`catalog_id`,`subject_id`),
  KEY `subject_id` (`subject_id`),
  CONSTRAINT `mooc_course_subjects_ibfk_1` FOREIGN KEY (`catalog_id`) REFERENCES `mooc_catalog` (`id`) ON DELETE CASCADE,
  CONSTRAINT `mooc_course_subjects_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `mooc_subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mooc_course_subjects`
--

LOCK TABLES `mooc_course_subjects` WRITE;
/*!40000 ALTER TABLE `mooc_course_subjects` DISABLE KEYS */;
INSERT INTO `mooc_course_subjects` VALUES (6,1),(12,1),(15,1),(19,1),(24,1),(3,2),(7,2),(13,2),(15,2),(17,2),(20,2),(21,2),(23,2),(24,2),(8,3),(20,5),(1,6),(2,6),(3,6),(4,6),(5,6),(9,6),(10,6),(12,6),(14,6),(16,6),(18,6),(22,6),(11,9);
/*!40000 ALTER TABLE `mooc_course_subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mooc_instructors`
--

DROP TABLE IF EXISTS `mooc_instructors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mooc_instructors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL COMMENT 'T├¡tulo o posici├│n (ej. "Profesor de Ingenier├¡a")',
  `bio` text COMMENT 'Biograf├¡a profesional',
  `image_url` varchar(500) DEFAULT NULL COMMENT 'Foto del instructor',
  `institution` varchar(255) DEFAULT NULL COMMENT 'Instituci├│n a la que pertenece',
  `credentials` text COMMENT 'Credenciales acad├⌐micas y profesionales',
  `mentor_id` int DEFAULT NULL COMMENT 'Relaci├│n con tabla mentor (si aplica)',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_mentor_id` (`mentor_id`),
  CONSTRAINT `fk_instructor_mentor` FOREIGN KEY (`mentor_id`) REFERENCES `mentor` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mooc_instructors`
--

LOCK TABLES `mooc_instructors` WRITE;
/*!40000 ALTER TABLE `mooc_instructors` DISABLE KEYS */;
/*!40000 ALTER TABLE `mooc_instructors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mooc_school_subjects`
--

DROP TABLE IF EXISTS `mooc_school_subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mooc_school_subjects` (
  `school_id` int NOT NULL,
  `subject_name` varchar(100) NOT NULL,
  PRIMARY KEY (`school_id`,`subject_name`),
  CONSTRAINT `mooc_school_subjects_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `mooc_schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mooc_school_subjects`
--

LOCK TABLES `mooc_school_subjects` WRITE;
/*!40000 ALTER TABLE `mooc_school_subjects` DISABLE KEYS */;
INSERT INTO `mooc_school_subjects` VALUES (1,'Art & Culture'),(1,'Biology & Life Sciences'),(1,'Computer Science'),(1,'Data Analysis & Statistics'),(1,'Humanities'),(2,'Business & Management'),(2,'Computer Science'),(2,'Data Analysis & Statistics'),(2,'Economics & Finance'),(2,'Engineering');
/*!40000 ALTER TABLE `mooc_school_subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mooc_schools`
--

DROP TABLE IF EXISTS `mooc_schools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mooc_schools` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mooc_schools`
--

LOCK TABLES `mooc_schools` WRITE;
/*!40000 ALTER TABLE `mooc_schools` DISABLE KEYS */;
INSERT INTO `mooc_schools` VALUES (1,'Harvard University'),(2,'Massachusetts Institute of Technology');
/*!40000 ALTER TABLE `mooc_schools` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mooc_subjects`
--

DROP TABLE IF EXISTS `mooc_subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mooc_subjects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `icon_url` varchar(500) NOT NULL,
  `slug` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mooc_subjects`
--

LOCK TABLES `mooc_subjects` WRITE;
/*!40000 ALTER TABLE `mooc_subjects` DISABLE KEYS */;
INSERT INTO `mooc_subjects` VALUES (1,'Data Science','/images/subjects/data-science.png','data-science'),(2,'Computer Science','/images/subjects/computer-science.png','computer-science'),(3,'Math','/images/subjects/math.png','math'),(4,'Architecture','/images/subjects/architecture.png','architecture'),(5,'Education & Teacher Training','/images/subjects/education.png','education'),(6,'Business & Management','/images/subjects/business.png','business'),(7,'Engineering','/images/subjects/engineering.png','engineering'),(8,'Food & Nutrition','/images/subjects/food.png','food'),(9,'Law','/images/subjects/law.png','law'),(10,'Medicine','/images/subjects/medicine.png','medicine');
/*!40000 ALTER TABLE `mooc_subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opciones_respuesta`
--

DROP TABLE IF EXISTS `opciones_respuesta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `opciones_respuesta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pregunta_id` int NOT NULL COMMENT 'Clave foránea a la pregunta a la que pertenece esta opción',
  `texto_opcion` text NOT NULL COMMENT 'El texto de la opción de respuesta',
  `es_correcta` tinyint(1) DEFAULT '0' COMMENT 'Indica si esta opción es la respuesta correcta (1) o no (0)',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pregunta_id` (`pregunta_id`),
  CONSTRAINT `opciones_respuesta_ibfk_1` FOREIGN KEY (`pregunta_id`) REFERENCES `preguntas_quiz` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Almacena las opciones de respuesta para preguntas de quiz (multiple-choice, checkbox).';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opciones_respuesta`
--

LOCK TABLES `opciones_respuesta` WRITE;
/*!40000 ALTER TABLE `opciones_respuesta` DISABLE KEYS */;
/*!40000 ALTER TABLE `opciones_respuesta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partners`
--

DROP TABLE IF EXISTS `partners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_estudiante` varchar(100) DEFAULT NULL,
  `semestre` int DEFAULT NULL,
  `carrera` varchar(100) DEFAULT NULL,
  `contacto` varchar(100) DEFAULT NULL,
  `nombre_proyecto` varchar(150) DEFAULT NULL,
  `descripcion_proyecto` text,
  `tipo_proyecto` varchar(100) NOT NULL,
  `requerimiento` text,
  `emprendedor_id` int DEFAULT NULL,
  `institucion_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `emprendedor_id` (`emprendedor_id`),
  KEY `institucion_id` (`institucion_id`),
  CONSTRAINT `partners_ibfk_1` FOREIGN KEY (`emprendedor_id`) REFERENCES `emprendedor` (`id`) ON DELETE SET NULL,
  CONSTRAINT `partners_ibfk_2` FOREIGN KEY (`institucion_id`) REFERENCES `institucion` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partners`
--

LOCK TABLES `partners` WRITE;
/*!40000 ALTER TABLE `partners` DISABLE KEYS */;
INSERT INTO `partners` VALUES (1,'Manuel',8,'asdasd','465461231654567','ASDAS','asdsad','Proyecto de titulación','asda',NULL,NULL),(2,'zxc',5,'ISI','465461231654567','sdfsdfds','asdasd','Proyecto de aula','asd',NULL,NULL),(3,'Manuel',8,'asdasd','123123','ASDAS','asd','Proyecto de aula','asdasd',NULL,NULL),(4,'Manuel',4,'IBI','123123','sdfsdfdsas','asd','Proyecto de aula','asd',NULL,NULL),(5,'Manuel',8,'ISI','1231454','asdsad','asdasd','Proyecto de aula','asdasd',NULL,NULL),(6,'Manuel',8,'IBI','528282','a','asd','Proyecto de aula','asd',NULL,NULL);
/*!40000 ALTER TABLE `partners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preguntas_quiz`
--

DROP TABLE IF EXISTS `preguntas_quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preguntas_quiz` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quiz_id` int NOT NULL COMMENT 'Clave foránea al quiz al que pertenece esta pregunta',
  `texto_pregunta` text NOT NULL COMMENT 'El texto de la pregunta',
  `tipo_pregunta` varchar(50) DEFAULT 'multiple-choice' COMMENT 'Tipo de pregunta (ej: multiple-choice, checkbox, text, number)',
  `orden` int NOT NULL COMMENT 'Orden de la pregunta dentro del quiz',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_pregunta_orden` (`quiz_id`,`orden`),
  CONSTRAINT `preguntas_quiz_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Almacena las preguntas de cada quiz.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preguntas_quiz`
--

LOCK TABLES `preguntas_quiz` WRITE;
/*!40000 ALTER TABLE `preguntas_quiz` DISABLE KEYS */;
/*!40000 ALTER TABLE `preguntas_quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quizzes`
--

DROP TABLE IF EXISTS `quizzes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quizzes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `leccion_id` int NOT NULL COMMENT 'Clave foránea a la lección a la que pertenece este quiz (UNIQUE asegura un quiz por lección)',
  `titulo` varchar(255) DEFAULT 'Quiz de la Lección' COMMENT 'Título del quiz',
  `instrucciones` text COMMENT 'Instrucciones o descripción del quiz',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `leccion_id` (`leccion_id`),
  CONSTRAINT `quizzes_ibfk_1` FOREIGN KEY (`leccion_id`) REFERENCES `lecciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Almacena la información general de los quizzes por lección.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quizzes`
--

LOCK TABLES `quizzes` WRITE;
/*!40000 ALTER TABLE `quizzes` DISABLE KEYS */;
/*!40000 ALTER TABLE `quizzes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recursos`
--

DROP TABLE IF EXISTS `recursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recursos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `leccion_id` int NOT NULL COMMENT 'Clave foránea a la lección a la que pertenece este recurso',
  `nombre` varchar(255) NOT NULL COMMENT 'Nombre descriptivo del recurso',
  `url_archivo` varchar(500) NOT NULL COMMENT 'URL o ruta al archivo del recurso o enlace externo',
  `tipo` varchar(50) DEFAULT 'link' COMMENT 'Tipo de recurso (ej: link, pdf, doc, zip, imagen)',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `leccion_id` (`leccion_id`),
  CONSTRAINT `recursos_ibfk_1` FOREIGN KEY (`leccion_id`) REFERENCES `lecciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Almacena los recursos adicionales por lección.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recursos`
--

LOCK TABLES `recursos` WRITE;
/*!40000 ALTER TABLE `recursos` DISABLE KEYS */;
/*!40000 ALTER TABLE `recursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `revenue`
--

DROP TABLE IF EXISTS `revenue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `revenue` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `nro_contacto` varchar(20) DEFAULT NULL,
  `nombre_proyecto_institucion` varchar(150) DEFAULT NULL,
  `descripcion_apoyo` text,
  `administrador_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `administrador_id` (`administrador_id`),
  CONSTRAINT `revenue_ibfk_1` FOREIGN KEY (`administrador_id`) REFERENCES `administrador` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `revenue`
--

LOCK TABLES `revenue` WRITE;
/*!40000 ALTER TABLE `revenue` DISABLE KEYS */;
INSERT INTO `revenue` VALUES (1,'Alison','65465465654','123','asdsad',NULL),(2,'Manuel','465461231654567','asdasd','asdasd',NULL),(3,'Doria Medina','1231454','asd','asdad',NULL),(4,'Doria Medina','412456','123','asdasdasd',NULL),(5,'Doria Medina','123123','asd','asd',NULL),(6,'Doria Medina','454545','asd','asdsad',NULL);
/*!40000 ALTER TABLE `revenue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` enum('Administrador','Emprendedor','Mentor','Institución','Estudiante') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'shadow24054736@gmail.com','$2b$10$/.BBWbrTg9rfLDRf195HBOC2y2pkJgq.T5DsnvQ3/IAtt6cEpkHj6','Administrador'),(2,'Manuel@univalle.edu','$2b$10$e3PcvX.qCQWz3hqQQCyrt./P8aABsuILivkOoZBfkcRfBkKuNVaLi','Administrador'),(3,'alison@gmail.com','$2b$10$nlpreoZMP.Akt6EHd0kyiulrMwiw8nBej2PMt5uYqXHiPp2G/hNgW','Administrador'),(4,'Manuel123@gmail.com','$2b$10$P7ugdRASK11CsXktz6Zf/efJNK5w55Qw1Xcmq4Zooz1ISq4u1LTRe','Emprendedor'),(5,'Goku@univalle.edu','$2b$10$Wkuz/1LmgX7kEQBu4F.S..6d8a4ORT57By0.dhdmcXidsNhBnw8km','Administrador'),(6,'sergio@123gmail.com','$2b$10$IZD9fiv5L.8VKCcz8UqrP.Rr.jlTPoxq0izkbccPf4K6SvFiG17sO','Estudiante'),(8,'Milton@univalle.edu','$2b$10$2zxQ0sT.kPTdcz.Tdwd8gu5wpgOofrWuKzC97urYUeQAcTOQ5roZe','Administrador'),(9,'Gaston@gmail.com','$2b$10$1A/0aiL8olnIJQdChEdGmudhqrtfrM5h/SFCdVlIMzXYZkIp6ULEO','Estudiante'),(10,'David@gmail.com','$2b$10$hG16llocObc3EKSnwPvP8e/afpJmIJM/6Ry16JAV0RYou2YvemUqe','Institución'),(11,'Manuel456@gmail.com','$2b$10$Y2FNa2WLA9dWLs1F5Qjn9eFtYku71LS7j8rEfKoF1qC5BYVYNjbAG','Administrador'),(12,'Gastion123@gmail.com','$2b$10$/KFaYNUYgxFD7JWnaAItMueyB3Wqg/UEk/NwPMa.tVXfdQV3T49b2','Estudiante'),(13,'evo123@gmail.com','$2b$10$m6cbtE2QgkYYUDPA4kF6SOvv7mORGXTfvtjRYGWf5jxOXQPl/waRG','Estudiante'),(14,'Isabel@gmail.com','$2b$10$x1f5KxyZ3MnDicDToeC6J.Km.vGuYPKBL7quyBj2dP91KlTfjUOni','Estudiante'),(15,'Raquel@gmail.com','$2b$10$.RQT2qzXPDnrVbwdceeWnefI4.XTfiK/ZGBVL6Gzr/ETter08Rv72','Estudiante'),(16,'admin@uv.edu.bo','$2b$10$kEtYmGAYjdBXYttWh1JqSOxaOGk1Zi2.BPzn4fmP/rbgZfstir/2G','Administrador'),(17,'Alejandro@gmail.com','$2b$10$P9XbTdCOuf40BMOBfzQEbOtFt1d1PIOCzSF4VXsQf/oqT9VMP1uRe','Estudiante'),(18,'Nicole@gmail.com','$2b$10$yoUw4fZ0v6vg3lAkEy8E0eDgiNp4XoqRxVH4/wy/axLxFkGiB9N0S','Emprendedor'),(19,'Luis@gmail.com','$2b$10$0Byp7z/6.oQ4TsN5lZ4yMeuT/JY.yoez2ZyprFTDUmzf3YnMygRdm','Mentor'),(20,'Alex@gmail.com','$2b$10$m45taTr2iPRvbH5lMIkAzOousazFoT3TLZg0W3W7UJtn4k74u8cSG','Mentor');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-11 15:27:55
