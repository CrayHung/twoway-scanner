## spring

- 調整application.properties(spring\Xinwu\src\main\resources\application.properties)的Mysql路徑 
  (localhost 或 連線server 或 docker服務名稱)

- cmd 進到spring專案資料夾(spring/Xinwu)
    執行 gradle build

- 調整spring資料夾(spring)下的spring-Dockerfile (正常是不用動)

- spring資料夾(spring)下執行以下指令 , 以產生twoway-spring的docker image
    執行 docker build -t twoway-spring -f spring-Dockerfile .

- cmd執行docker images查看是否有產生twoway-spring



JWT 參考
https://youtu.be/KxqlJblhzfI?si=AaAQeYTwGileC8MR

email Sender參考 
https://youtu.be/ugIUObNHZdo?si=g-FqH7kDQ1BIZQtB

JWT refresh token參考
https://youtu.be/Wp4h_wYXqmU?si=IrE9elMZqwEdqo-L
https://youtu.be/VVn9OG9nfH0?si=1T5I2Y4_1ZgfAtod