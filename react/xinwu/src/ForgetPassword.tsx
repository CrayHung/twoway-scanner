import React, { useState } from "react";
import { TextField, Button ,Stack,Box,Container  } from "@mui/material";
import { useGlobalContext } from './global';
import { useNavigate } from 'react-router-dom'

const ForgetPassword = () => {

    const [input1, setInput1] = useState<string>('');
    const [input2, setInput2] = useState<string>('');

    const { jwtToken,setJwtToken,isLoggedIn, setIsLoggedIn,globalUrl } = useGlobalContext();
    const navigate = useNavigate();

    const fetchData = async () => {
        
        try {
          const response = await fetch(`${globalUrl.url}/forget/forgetPassword`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: input1,
              email: input2,
            }),
          });
          if (response.ok) {
            navigate('/');
        }
        //   const data = await response.text();
        //   console.log(data);
        } catch (error: any) {
            console.error('Error :', error);

          }
        };

        const handleInput1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
            setInput1(e.target.value);
        };
        const handleInput2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
            setInput2(e.target.value);
        };
        const handleButtonClick = () => {
            console.log('username:', input1);
            console.log('email:', input2);
            handleLogin();
        };
        const handleLogin = () => {
            fetchData();
          };

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
            <>忘記密碼</>
                <TextField
                    label="帳號"
                    variant="outlined"
                    value={input1}
                    onChange={handleInput1Change}
                    margin="normal"
                    sx={{ width: '300px' }}
                />

                <TextField
                    label="信箱"
                    variant="outlined"
                    value={input2}
                    onChange={handleInput2Change}
                    margin="normal"
                    sx={{ width: '300px' }}
                />
                <Button variant="contained" onClick={handleButtonClick} sx={{ marginRight: 1 }}>
                        提交
                    </Button>
        </Box>
        </Container>
    );
}
export default ForgetPassword;