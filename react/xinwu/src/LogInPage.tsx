import React, { useState } from "react";
import { TextField, Button ,Stack,Box,Container,Link   } from "@mui/material";
import { useGlobalContext } from './global';

const LogInPage = () => {

    const [input1, setInput1] = useState<string>('');
    const [input2, setInput2] = useState<string>('');
    const [error, setError] = useState<string>('');

    const {  jwtToken , setJwtToken ,isLoggedIn, setIsLoggedIn,globalUrl } = useGlobalContext();


    const fetchLogin = async () => {
        try {
          const response = await fetch(`${globalUrl.url}/auth/authenticate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: input1,
              password: input2,
            }),
          });
  
          if (!response.ok) {
            throw new Error('Failed to login');
          }
  
          const data = await response.json();
          const token = data.token; 

  
          await setJwtToken(token);

          await setIsLoggedIn(true);

        } catch (error: any) {
          console.error('Error fetching token:', error);
          setError(error.message as string);
        }
      };
    const handleLogin = async() => {
        await fetchLogin();
        console.log("jwtToken=" + jwtToken);
      };

    const handleInput1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput1(e.target.value);
    };

    const handleInput2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput2(e.target.value);
    };

    const handleButtonClick = () => {
        console.log('username:', input1);
        console.log('password:', input2);
        handleLogin();
        // setIsLoggedIn(true);
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

            <>登入</>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {/* <Stack spacing={2}> */}
                <TextField
                    label="帳號"
                    variant="outlined"
                    value={input1}
                    onChange={handleInput1Change}
                    margin="normal"
                    sx={{ width: '300px' }}
                />
                <TextField
                    label="密碼"
                    variant="outlined"
                    value={input2}
                    onChange={handleInput2Change}
                    margin="normal"
                    sx={{ width: '300px' }}
                />
                {/* <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 2,
                    }}
                > */}
 
                    <>
                    <Link href="forgetpassword" variant="body2" >
                      {'forget password'}
                    </Link>
                    <br />
                    <Button variant="contained" onClick={handleButtonClick} sx={{ marginRight: 1 }}>
                        提交
                    </Button>
                    </>
                {/* </Box> */}
        </Box>
        </Container>
    );
}
export default LogInPage;