## react

- clone專案https://github.com/CrayHung/twoway-scanner.git 或 到新電腦 , 進到react資料夾 , 執行 npm i
- 在react 資料夾執行 npm run build , 會再專案下面看到產生build資料夾
- 調整react-Dockerfile (正常是不用動)
- 在react-Dockerfile那層執行以下指令 , 用以產生 twoway-react的docker image
    docker build -t twoway-react -f react-Dockerfile .

- cmd執行 docker images  查看是否有產生twoway-react
- cmd在往上一層(和docker-compose.yml同層)執行以下指令   
    docker-compose up -d
    前往  http://localhost:3000/   看網頁變化


    <!-- 前端初始頁面 -->
    帳號admin
    密碼1234
    腳色 ADMIN