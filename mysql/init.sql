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
  create_user VARCHAR(255),
  create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  edit_user VARCHAR(255),
  edit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE (work_order_number)
);

-- 修改 work_order_details 表結構
DROP TABLE IF EXISTS work_order_details;
CREATE TABLE work_order_details (
  id INT AUTO_INCREMENT,
  work_order_number VARCHAR(255) NOT NULL,
  detail_id INT NOT NULL,
  sn VARCHAR(255),
  qr_rf_tray VARCHAR(255),
  qr_ps VARCHAR(255),
  qr_hs VARCHAR(255),
  qr_backup1 VARCHAR(255),
  qr_backup2 VARCHAR(255),
  qr_backup3 VARCHAR(255),
  qr_backup4 VARCHAR(255),
  note TEXT,
  create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  create_user VARCHAR(255),
  edit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  edit_user VARCHAR(255),
  PRIMARY KEY (id),
  FOREIGN KEY (work_order_number) REFERENCES work_orders(work_order_number),
  UNIQUE (work_order_number, detail_id)
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

-- INSERT INTO refresh_token (id,user_id, token, createdDate, expirationDate)
-- VALUES
--   (1,1, 'token123', '2023-12-14 12:30:00.000000', '2023-12-14 12:30:00.000000'),
--   (2,2, 'token456', '2023-12-14 12:30:00.000000', '2023-12-14 12:30:00.000000');

INSERT INTO speeding (id,plate_number, recognition_time, recognition_time_str, car_type, image_path, camera_id, avgSpeed)
VALUES
  (1,'ABC-123', '2023-12-14 12:30:00.000000', '2023-12-14 12:30:00.000000', 'car', '1.jpg', 'cam1', 5),
  (2,'AAA-789', '2023-12-14 12:30:00.000000', '2023-12-14 12:30:00.000000', 'truck', '2.jpg', 'cam2', 7),
  (3,'123-XYZ', '2023-12-14 12:30:00.000000', '2023-12-14 12:30:00.000000', 'truck', '3.jpg', 'cam1', 10);

-- 測試數據 for 工單 work_orders 
INSERT INTO work_orders (work_order_number, quantity, part_number, create_user, create_date, edit_user, edit_date)
VALUES
  ('WO-001', 100, 'PART-A', 'user1', '2023-06-01 09:00:00', 'user2', '2023-06-02 10:30:00'),
  ('WO-002', 200, 'PART-B', 'user2', '2023-06-03 14:15:00', 'user3', '2023-06-04 16:45:00'),
  ('WO-003', 150, 'PART-C', 'user3', '2023-06-05 11:30:00', 'user1', '2023-06-06 13:20:00');

SELECT COUNT(*) FROM work_orders;

-- 測試數據 for work_order_details
INSERT INTO work_order_details (work_order_number, detail_id, sn, qr_rf_tray, qr_ps, qr_hs, qr_backup1, qr_backup2, qr_backup3, qr_backup4, note, create_user, create_date, edit_user, edit_date)
VALUES
  ('WO-001', 1, 'SN001', 'QRRF001', 'QRPS001', 'QRHS001', 'QRBU001', 'QRBU002', 'QRBU003', 'QRBU004', 'Note for WO-001 #1', 'user1', '2023-06-01 09:00:00', 'user2', '2023-06-02 10:30:00'),
  ('WO-001', 2, 'SN002', 'QRRF002', 'QRPS002', 'QRHS002', 'QRBU005', 'QRBU006', 'QRBU007', 'QRBU008', 'Note for WO-001 #2', 'user1', '2023-06-01 09:00:00', 'user2', '2023-06-02 10:30:00'),
  ('WO-001', 3, 'SN003', 'QRRF003', 'QRPS003', 'QRHS003', 'QRBU009', 'QRBU010', 'QRBU011', 'QRBU012', 'Note for WO-001 #3', 'user1', '2023-06-01 09:00:00', 'user2', '2023-06-02 10:30:00'),
  ('WO-002', 1, 'SN004', 'QRRF004', 'QRPS004', 'QRHS004', 'QRBU013', 'QRBU014', 'QRBU015', 'QRBU016', 'Note for WO-002 #1', 'user2', '2023-06-03 14:15:00', 'user3', '2023-06-04 16:45:00'),
  ('WO-002', 2, 'SN005', 'QRRF005', 'QRPS005', 'QRHS005', 'QRBU017', 'QRBU018', 'QRBU019', 'QRBU020', 'Note for WO-002 #2', 'user2', '2023-06-03 14:15:00', 'user3', '2023-06-04 16:45:00'),
  ('WO-003', 1, 'SN006', 'QRRF006', 'QRPS006', 'QRHS006', 'QRBU021', 'QRBU022', 'QRBU023', 'QRBU024', 'Note for WO-003 #1', 'user3', '2023-06-05 11:30:00', 'user1', '2023-06-06 13:20:00');