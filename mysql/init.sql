CREATE DATABASE xinwudb;
CREATE USER 'xinwu'@'%' IDENTIFIED BY '123456';
GRANT ALL ON xinwudb.* to 'xinwu'@'%';


CREATE TABLE record (
  id int NOT NULL AUTO_INCREMENT,
  camera_id varchar(255) DEFAULT NULL,
  image_path varchar(255) DEFAULT NULL,
  name varchar(255) DEFAULT NULL,
  pass_status varchar(255) DEFAULT NULL,
  plate_number varchar(255) DEFAULT NULL,
  recognition_time datetime(6) DEFAULT NULL,
  recognition_time_str varchar(255) DEFAULT NULL,
  vehicle_type varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
);


INSERT INTO record (plate_number, vehicle_type) VALUES ('ABC-123', 'car');
INSERT INTO record (plate_number, vehicle_type) VALUES ('XYZ-789', 'car');
