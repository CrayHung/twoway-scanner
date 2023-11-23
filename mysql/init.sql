CREATE DATABASE xinwudb;
USE xinwudb;

CREATE USER 'xinwu'@'%' IDENTIFIED BY '123456';
GRANT ALL ON xinwudb.* to 'xinwu'@'%';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS record (
  id int AUTO_INCREMENT,
  plate_number varchar(255) DEFAULT NULL,
  camera_id varchar(255) DEFAULT NULL,
  image_path varchar(255) DEFAULT NULL,
  plate_in Boolean DEFAULT 1,

  recognition_time datetime(6) DEFAULT NULL,
  recognition_time_str varchar(255) DEFAULT NULL,
  car_type varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS allow_list (
  id int AUTO_INCREMENT,
  plate_number varchar(255) DEFAULT NULL,
  pass_status varchar(255) DEFAULT NULL,
  visitor_end_str varchar(255) DEFAULT NULL,
  visitor_start_str varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS parking_lot (
  id int AUTO_INCREMENT,
  amount int DEFAULT NULL,
  car_type varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
);


INSERT INTO record (plate_number,camera_id,image_path,plate_in,recognition_time,recognition_time_str,car_type) VALUES 
  (1,'ABC-123','cam1','1.jpg',false,'2023-11-02T00:15:03.000','2023-11-02 00:15:03.000','car'),
  (2,'AAA-789','cam2','2.jpg',true,'2023-11-05T00:11:03.000','2023-11-02 00:10:03.000','truck'),
  (3,'77-DE','cam2','3.jpg',false,'2023-11-06T00:15:03.000','2023-11-06 00:15:03.000','car');


INSERT INTO allow_list (plate_number,pass_status,visitor_end_str,visitor_start_str) VALUES 
  (1,'ABC-123','pass','',''),
  (2,'AAA-789','pass','',''),
  (3,'77-DE','temp_pass','2023-12-30 00:15:03.000000','2023-11-01 00:15:03.000'),
  (4,'XYZ-789','temp_pass','2023-11-05 00:15:03.000000','2023-11-01 00:15:03.000'),
  (5,'AA-123','temp_pass','2023-12-30 00:15:03.000000','2023-11-15 00:15:03.000'),
  (6,'BB-123','temp_pass','2023-11-30 00:15:03.000000','2023-10-30 00:15:03.000');

INSERT INTO parking_lot (amount, car_type) VALUES 
  (1,10, 'car'),
  (2,10, 'truck');
