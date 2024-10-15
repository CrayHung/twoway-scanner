import { Box, Button, Container, TextField } from '@mui/material';
import { useState } from 'react';
import { BrowserRouter as Router, Route, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { useIntl } from "react-intl";

const ResetPassword: React.FC = () => {
  const { formatMessage } = useIntl();

    const navigate = useNavigate();
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
                if (response.ok) {
                    navigate('/');
                }
              })
              .catch(error => {
                console.error('Error:', error.message);
              });

    }





  return (
    <Container >
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
          }}
        >

            <>Reset Password</>
                <TextField
                    label="輸入新密碼"
                    variant="outlined"
                    value={newPassword}
                    onChange={handleInputChange}
                    margin="normal"
                    sx={{ width: '300px' }}
                />

                
                <Button variant="contained" onClick={handleButtonClick} sx={{ marginRight: 1 }}>
                Reset Password
                </Button>
        </Box>
        </Container>


  );
}

export default ResetPassword;
