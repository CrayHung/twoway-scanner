## react

- 進到react資料夾(react/xinwu)
    執行 npm i
    修改過程式後執行 npm run build

- 調整react資料夾(react)下的react-Dockerfile (正常是不用動)
  
- 在react資料夾(react)下執行以下指令 , 以產生 twoway-react的docker image
    執行 docker build -t twoway-react -f react-Dockerfile .

- cmd執行docker images查看是否有產生twoway-react

- 之後有改動程式碼要看效果就重複npm run build 
 -> 產生 twoway-react的docker image 
 -> 重新執行docker-compose up -d