import { useState } from 'react';
import { BrowserRouter as Router, Route, useParams } from 'react-router-dom';


const ResetPassword: React.FC = () => {


    const [newPassword, setnewPassword] = useState<string>('');

    //從URL中取得token字串
    const { token } = useParams<{ token?: string }>();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setnewPassword(event.target.value);
      };  

    const handleButtonClick = () => {
        handleResetPassword();
    };

    const handleResetPassword =() =>{
        // @GetMapping("/reset-password")
        console.log("newPassword>>>"+newPassword);
        console.log("+++++++++++++++++++++++++++");
        console.log("token>>>"+token);

        const headers = {'Authorization':`Bearer ${token}`,
        "Content-Type": "application/json"};

        const requestBody = {
            token: token,
            password: newPassword,
          };


        fetch("http://127.0.0.1:8080/reset/resetpassword",
            {
              method: 'POST',
              headers: headers,
              body: JSON.stringify(requestBody),
              mode: 'cors'
              })
              .then(response => {
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                console.log('Reset password successful');
              })
              .catch(error => {
                console.error('Error:', error.message);
              });

    }





  return (
    <>
      <h1>Reset Password</h1>
  
      <p>Token: {token}</p>

      <input
      type="text"
      value={newPassword}
      onChange={handleInputChange}
      placeholder="輸入新密碼"
    />
      <button onClick={handleButtonClick}>Reset Password</button>
    </>
  );
}

export default ResetPassword;
