import React, { useState } from "react";
import { TextField, Button ,Stack,Box,Container,Link   } from "@mui/material";
import { useGlobalContext } from './global';
import { useIntl } from "react-intl";

const LogInPage = () => {

    const [input1, setInput1] = useState<string>('');
    const [input2, setInput2] = useState<string>('');
    const [error, setError] = useState<string>('');

    const {  userRole,setUserRole,jwtToken , setJwtToken ,isLoggedIn, setIsLoggedIn,globalUrl,currentUser, setCurrentUser } = useGlobalContext();
    const { formatMessage } = useIntl();

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
            alert("登入失敗")
          }
          
          
          const data = await response.json();
          const token = data.token; 
          const userRole = data.role; 
          const company = data.company;
          alert("登入腳色:"+ userRole);

  
          await setJwtToken(token);
          await setUserRole(userRole);
          alert("登入成功")
          await setIsLoggedIn(true);

        } catch (error: any) {
          console.error('Error fetching token:', error);
          setError(error.message as string);
        }
      };
    const handleLogin = async() => {
        await fetchLogin();
        console.log("jwtToken=" + jwtToken);
        setCurrentUser(input1);
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

            <>{formatMessage({ id: 'login' })}</>
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
                    {formatMessage({ id: 'submit' })}
                    </Button>
                    </>
                {/* </Box> */}
        </Box>
        </Container>
    );
}
export default LogInPage;