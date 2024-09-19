CREATE DATABASE IF NOT EXISTS twowaydb;
USE twowaydb;

CREATE USER 'user'@'%' IDENTIFIED BY '123456';
GRANT ALL ON twowaydb.* to 'user'@'%';
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
  username varchar(255) NOT NULL UNIQUE,
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

CREATE TABLE IF NOT EXISTS work_orders (
  id INT AUTO_INCREMENT,
  work_order_number VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  part_number VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO record (id,plate_number, recognition_time, recognition_time_str, car_type, image_path, camera_id, plate_in)
VALUES
  (1,'ABC-123', '2023-12-14 12:30:00.000000', '2023-12-14 12:30:00.000000', 'car', '1.jpg', 'cam1', 1),
  (2,'AAA-789', '2023-12-14 12:30:00.000000', '2023-12-14 13:45:00.000000', 'car', '2.jpg', 'cam1', 0),
  (3,'77-DE', '2023-12-14 12:30:00.000000', '2023-12-14 14:15:00.000000', 'truck', '3.jpg', 'cam2', 1);


INSERT INTO allow_list (id,plate_number,pass_status,visitor_start_str,visitor_end_str) VALUES 
  (1,'ABC-123','pass','',''),
  (2,'AAA-789','pass','',''),
  (3,'77-DE','temp_pass','2023-11-30 00:15:03.000000','2023-12-30 00:15:03.000000'),
  (4,'XYZ-789','temp_pass','2023-11-05 00:15:03.000000','2023-12-30 00:15:03.000000'),
  (5,'AA-123','temp_pass','2023-11-30 00:15:03.000000','2023-12-30 00:15:03.000000'),
  (6,'BB-123','temp_pass','2023-11-30 00:15:03.000000','2023-12-30 00:15:03.000000');

INSERT INTO parking_lot (id,amount, car_type) VALUES 
  (1,100, 'car'),
  (2,100, 'truck');

-- 因為password藥用加密的儲存,所以創建的時候給明碼沒用,用API  /registerAdmin註冊
-- INSERT INTO users (id,username, password, role)
-- VALUES
--   (1,'john', '123456', 'ADMIN'),
--   (2,'admin', '123456', 'ADMIN'),
--   (3,'cray5', '123456', 'USER');

INSERT INTO refresh_token (id,user_id, token, createdDate, expirationDate)
VALUES
  (1,1, 'token123', '2023-12-14 12:30:00.000000', '2023-12-14 12:30:00.000000'),
  (2,2, 'token456', '2023-12-14 12:30:00.000000', '2023-12-14 12:30:00.000000');

INSERT INTO speeding (id,plate_number, recognition_time, recognition_time_str, car_type, image_path, camera_id, avgSpeed)
VALUES
  (1,'ABC-123', '2023-12-14 12:30:00.000000', '2023-12-14 12:30:00.000000', 'car', '1.jpg', 'cam1', 5),
  (2,'AAA-789', '2023-12-14 12:30:00.000000', '2023-12-14 12:30:00.000000', 'truck', '2.jpg', 'cam2', 7),
  (3,'123-XYZ', '2023-12-14 12:30:00.000000', '2023-12-14 12:30:00.000000', 'truck', '3.jpg', 'cam1', 10);

-- 測試數據 for 工單 work_orders 
INSERT INTO work_orders (work_order_number, quantity, part_number) VALUES 
  ('WO-001', 100, 'PART-A'),
  ('WO-002', 200, 'PART-B'),
  ('WO-003', 150, 'PART-C');
  SELECT COUNT(*) FROM work_orders;