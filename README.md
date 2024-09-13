整體流程

github clone 專案code   https://github.com/CrayHung/twoway-scanner.git

(最終部屬..react,spring,mysql都用docker-compose部屬)
1. 依照 spring資料夾下的README.md 完成製作spring-Dockerfile
2. 依照 react資料夾下的README.md 完成製作react-Dockerfile
3. 依照 mysql資料夾下的README.md 完成init.sql
4. 輸入docker images查看是否已建立兩個image 
5. 調整docker-compose.yml 如docker-compose.yml所示
6. 執行docker-compose up -d
7. 開啟網頁 http://localhost:3000



( react在localhost開發 , spring,mysql用docker-compose部屬 )
1. 依照 spring資料夾下的README.md 完成製作spring-Dockerfile (免做)
2. 依照 mysql資料夾下的README.md 完成init.sql  (免做) 
3. 調整docker-compose.yml , 將以下程式碼註解
# cms:
  #   image: twoway-react
  #   restart: unless-stopped
  #   ports:
  #     - "3000:3000"
  #   volumes:
  #     - ./react/xinwu:/app
  #   container_name: twoway-react
4. 執行docker-compose up -d
5. loacl端開啟react



( spring在localhost開發 , mysql用docker-compose部屬 )
1. 依照 mysql資料夾下的README.md 完成init.sql  (要調整資料庫的欄位 或 格式要做)
2. 調整docker-compose.yml, 將以下程式碼註解
# cms:
  #   image: twoway-react
  #   restart: unless-stopped
  #   ports:
  #     - "3000:3000"
  #   volumes:
  #     - ./react/xinwu:/app
  #   container_name: twoway-react

  # spring:
  # # 如果將mysql獨立出來 , SPRING_DATASOURCE_URL要改為youth-database
  #   depends_on:
  #     - database
  #   image: twoway-spring
  #   restart: unless-stopped
  #   environment:
  #   # 將mysql獨立出來 , URL改為youth-database
  #     # SPRING_DATASOURCE_URL: jdbc:mysql://youth-database:3306/twowaydb
  #     SPRING_DATASOURCE_URL: jdbc:mysql://database:3306/twowaydb
  #     SPRING_DATASOURCE_USERNAME: root
  #     SPRING_DATASOURCE_PASSWORD: 123456
  #   container_name: twoway-spring
  #   ports:
  #     - "8080:8080"
1. 修改Twoway-scanner\spring\Xinwu\src\main\resources\application.properties 
    開頭的spring.datasource.url 使用"只有mysql用docker-compose部屬的話..."下面的程式碼
2. 執行docker-compose up -d
