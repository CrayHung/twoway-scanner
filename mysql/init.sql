CREATE DATABASE xinwudb;
USE xinwudb;

CREATE USER 'xinwu'@'%' IDENTIFIED BY '123456';
GRANT ALL ON xinwudb.* to 'xinwu'@'%';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS record (
  id int AUTO_INCREMENT,
  plate_number varchar(255) DEFAULT NULL,
  recognition_time datetime(6) DEFAULT NULL,
  recognition_time_str varchar(255) DEFAULT NULL,
  car_type varchar(255) DEFAULT NULL,
  image_path varchar(255) DEFAULT NULL,
  camera_id varchar(255) DEFAULT NULL,
  plate_in Boolean DEFAULT 1,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS allow_list (
  id int AUTO_INCREMENT,
  plate_number varchar(255) DEFAULT NULL,
  pass_status varchar(255) DEFAULT NULL,
  visitor_start_str varchar(255) DEFAULT NULL,
  visitor_end_str varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS parking_lot (
  id int AUTO_INCREMENT,
  amount int DEFAULT NULL,
  car_type varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS users (
  id int AUTO_INCREMENT,
  username varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  role varchar(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS refresh_token (
  id int AUTO_INCREMENT,
  user_id INT,
  token varchar(255) DEFAULT NULL,
  createdDate TIMESTAMP,
  expirationDate TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS speeding (
  id int AUTO_INCREMENT,
  plate_number varchar(255) DEFAULT NULL,
  recognition_time datetime(6) DEFAULT NULL,
  recognition_time_str varchar(255) DEFAULT NULL,
  car_type varchar(255) DEFAULT NULL,
  image_path varchar(255) DEFAULT NULL,
  camera_id varchar(255) DEFAULT NULL,
  avgSpeed int DEFAULT NULL,
  PRIMARY KEY (id)
);


INSERT INTO record (plate_number, recognition_time, recognition_time_str, car_type, image_path, camera_id, plate_in)
VALUES
  ('ABC-123', '2023-12-14 12:30:00', '2023-12-14 12:30:00.000000', 'car', '1.jpg', 'cam1', 1),
  ('AAA-789', '2023-12-14 13:45:00', '2023-12-14 13:45:00.000000', 'car', '2.jpg', 'cam1', 0),
  ('77-DE', '2023-12-14 14:15:00', '2023-12-14 14:15:00.000000', 'truck', '3.jpg', 'cam2', 1);


INSERT INTO allow_list (plate_number,pass_status,visitor_start_str,visitor_end_str) VALUES 
  ('ABC-123','pass','',''),
  ('AAA-789','pass','',''),
  ('77-DE','temp_pass','2023-11-30 00:15:03.000000','2023-12-30 00:15:03.000000'),
  ('XYZ-789','temp_pass','2023-11-05 00:15:03.000000','2023-12-30 00:15:03.000000'),
  ('AA-123','temp_pass','2023-11-30 00:15:03.000000','2023-12-30 00:15:03.000000'),
  ('BB-123','temp_pass','2023-11-30 00:15:03.000000','2023-12-30 00:15:03.000000');

INSERT INTO parking_lot (amount, car_type) VALUES 
  (10, 'car'),
  (10, 'truck');

INSERT INTO users (username, password, role)
VALUES
  ('john', '123456', 'USER'),
  ('admin', '123456', 'ADMIN');

INSERT INTO refresh_token (user_id, token, createdDate, expirationDate)
VALUES
  (1, 'token123', '2023-12-14 12:30:00', '2023-12-14 14:30:00'),
  (2, 'token456', '2023-12-14 13:45:00', '2023-12-14 15:45:00');

INSERT INTO speeding (plate_number, recognition_time, recognition_time_str, car_type, image_path, camera_id, avgSpeed)
VALUES
  ('ABC-123', '2023-12-15 12:30:00', '2023-12-15 12:30:00', 'car', '1.jpg', 'cam1', 0),
  ('AAA-789', '2023-12-15 13:45:00', '2023-12-15 13:45:00', 'truck', '2.jpg', 'cam2', 0),
  ('123-XYZ', '2023-12-15 14:15:00', '2023-12-15 14:15:00', 'truck', '3.jpg', 'cam1', 0);
