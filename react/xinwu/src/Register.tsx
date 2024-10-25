import React, { useState } from "react";
import { TextField, Button ,Stack,Box,Container  } from "@mui/material";
import { useGlobalContext } from './global';
import { useIntl } from "react-intl";
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const [input1, setInput1] = useState<string>('');
    const [input2, setInput2] = useState<string>('');
    const [error, setError] = useState<string>('');
    const { formatMessage } = useIntl();

    const { jwtToken,setJwtToken,isLoggedIn, setIsLoggedIn,globalUrl } = useGlobalContext();

    const navigate = useNavigate();

    const fetchRegister = async () => {
        try {
          const response = await fetch(`${globalUrl.url}/auth/register`, {
          // const response = await fetch(`${globalUrl.url}/auth/registerAdmin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: input1,
              password: input2,
            }),
          });
  
        //   if (!response.ok) {
        //     throw new Error('Failed to register');
        //   }
  
          const data = await response.json();
          const token = data.token;
          const refreshtoken = data.refreshToken;
          const err = data.error;
  
        if(error!=null){
            setError(err);
            setJwtToken(null);
            setIsLoggedIn(false);
        }else{
          console.log(token);
          setJwtToken(token);

          setIsLoggedIn(true);
          navigate("/");
        }
        } catch (error: any) {
            console.error('Error fetching token:', error);
            setError(error.message as string);
          }
      };

    const handleInput1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput1(e.target.value);
    };

    const handleInput2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput2(e.target.value);
    };

    const handleButtonClick = () => {
        fetchRegister();
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
            <>{formatMessage({ id: 'register' })}</>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {/* <Stack spacing={2}> */}
                <TextField
                    label={formatMessage({ id: 'account' })}
                    variant="outlined"
                    value={input1}
                    onChange={handleInput1Change}
                    margin="normal"
                    sx={{ width: '300px' }}
                />
                <TextField
                    label={formatMessage({ id: 'password' })}
                    variant="outlined"
                    value={input2}
                    onChange={handleInput2Change}
                    margin="normal"
                    sx={{ width: '300px' }}
                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 2,
                    }}
                >
                    <Button variant="contained" onClick={handleButtonClick} sx={{ marginRight: 1 }}>
                    {formatMessage({ id: 'submit' })}
                    </Button>
                </Box>
        </Box>
        </Container>
    );
}
export default Register;