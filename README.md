# 雷達測速API

- 雷達測速 CMS 的API

网址:https://yj.wisiotsys.com:8889/
账号:test
密码:123456

1. 取得驗證圖片
https://yj.wisiotsys.com:8889/admin/login/getVerifyCode
POST
將data中的verifyCodeImg透過人工計算得到verifyCode

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/0849cd19-520e-4bc9-9cb9-6d1ba25f518f/1c23f36b-2a4f-46e9-8c76-3655989f99e8/Untitled.png)

1. 登入
    
    https://yj.wisiotsys.com:8889/admin/login/login
    POST 
    
    Body :  (form-data)
    
    ```jsx
    
    username : test
    password : 123456
    verifyCode : 步驟1.得到的值
    ```
    
    取得appstr  
    
    **(將appstr當作token使用      一次只能在一個地方登入)**
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/0849cd19-520e-4bc9-9cb9-6d1ba25f518f/191da678-562c-461e-8ea4-2120d94b01a8/Untitled.png)
    

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/0849cd19-520e-4bc9-9cb9-6d1ba25f518f/5d019ab9-a6ca-4680-8dbd-77dd40f45971/Untitled.png)

1. 取得車速 車號等資料

https://yj.wisiotsys.com:8889/admin/equipmentAlarmRecord/lists

POST
Body : form-data

```jsx
equipment_ids[0]    :  204
time[0]  :  start_date
time[1]  :  end_date
page  :  1
appst  :  步驟1.得到的值
```

得到datalist內的車輛資訊

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/0849cd19-520e-4bc9-9cb9-6d1ba25f518f/f191dfc9-4c8f-48d1-b4f8-66f2ca810d7e/Untitled.png)

- 串流 
https://yj.wisiotsys.com:8889/admin/stream/start
    
    POST
    Body : 
    
    ```jsx
    camera_id  :  197
    
    appstr  :  步驟1.得到的值
    ```
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/0849cd19-520e-4bc9-9cb9-6d1ba25f518f/8f89b23f-d4f9-4845-b7f6-6608ebd5890e/Untitled.png)
    
    [https://yj.wisiotsys.com:1443/index/api/webrtc](https://yj.wisiotsys.com:1443/index/api/webrtc?app=rtp&stream=45116200001321000189_45116200001321000189&type=play)
    POST
    Body :