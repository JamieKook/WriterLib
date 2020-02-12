DROP DATABASE IF EXISTS writers_room; 
CREATE DATABASE writers_room; 
USE writers_room; 

-- if you already have created this user, you cannot create it again
CREATE USER 'dummy'@'localhost' IDENTIFIED BY 'password'; 
GRANT ALL PRIVILEGES ON writers_room. * TO 'dummy'@'localhost';