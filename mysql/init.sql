CREATE DATABASE xinwudb;
CREATE USER 'xinwu'@'%' IDENTIFIED BY '123456';
GRANT ALL ON xinwudb.* to 'xinwu'@'%';


CREATE TABLE record (
  id int NOT NULL AUTO_INCREMENT,
  plate_number varchar(255) DEFAULT NULL,
  camera_id varchar(255) DEFAULT NULL,
  image_path varchar(255) DEFAULT NULL,
  plate_in Boolean DEFAULT true,

  recognition_time datetime(6) DEFAULT NULL,
  recognition_time_str varchar(255) DEFAULT NULL,
  car_type varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
);


CREATE TABLE allow_list (
  id int NOT NULL AUTO_INCREMENT,
  plate_number varchar(255) DEFAULT NULL,
  pass_status varchar(255) DEFAULT NULL,
  visitor_end_str varchar(255) DEFAULT NULL,
  visitor_start_str varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
);
INSERT INTO allow_list (plate_number,pass_status,visitor_end_str,visitor_start_str) VALUES ('ABC-123','pass','2023-12-30 00:15:03.000000','2023-11-02 00:15:03.000');
INSERT INTO allow_list (plate_number,pass_status,visitor_end_str,visitor_start_str) VALUES ('XYZ-789','temp_pass','2023-12-30 00:15:03.000000','2023-11-01 00:15:03.000');
INSERT INTO allow_list (plate_number,pass_status,visitor_end_str,visitor_start_str) VALUES ('AA-123','temp_pass','2023-12-30 00:15:03.000000','2023-11-02 00:15:03.000');
INSERT INTO allow_list (plate_number,pass_status,visitor_end_str,visitor_start_str) VALUES ('BB-123','temp_pass','2023-11-01 00:15:03.000000','2023-10-30 00:15:03.000');

CREATE TABLE parking_lot (
  id int NOT NULL AUTO_INCREMENT,
  amount int DEFAULT NULL,
  car_type varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
);



INSERT INTO parking_lot (amount, car_type) VALUES ('10', 'car');
INSERT INTO parking_lot (amount, car_type) VALUES ('10', 'truck');
