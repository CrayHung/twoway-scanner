import React, { useState } from "react";

import { TextField, Button, Grid, MenuItem, Modal, Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, TablePagination, IconButton, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Container } from '@mui/material';
import { useGlobalContext } from './global';
import { useIntl } from "react-intl";
import { useNavigate } from 'react-router-dom';

const Register = () => {

  const [input1, setInput1] = useState<string>('');
  const [input2, setInput2] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState<string>('');
  const { formatMessage } = useIntl();

  const { jwtToken, setJwtToken, isLoggedIn, setIsLoggedIn, globalUrl } = useGlobalContext();

  const navigate = useNavigate();

  /**register USER */
  const fetchRegisterUser = async () => {
    try {
      const response = await fetch(`${globalUrl.url}/auth/registerUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: input1,
          password: input2,
        }),
      });

      const data = await response.json();
      const token = data.token;
      const refreshtoken = data.refreshToken;
      const err = data.error;

      if (err != null) {
        setError(err);
        // setJwtToken(null);
        // setIsLoggedIn(false);
      } else {
        console.log(token);
        setJwtToken(token);

        setIsLoggedIn(true);
        alert("註冊成功");
        // navigate("/");
      }
    } catch (error: any) {
      console.error('Error fetching token:', error);
      setError(error.message as string);
    }
  };
  /**register OPERATOR */
  const fetchRegisterOperator = async () => {
    try {
      const response = await fetch(`${globalUrl.url}/auth/registerOperator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: input1,
          password: input2,
        }),
      });

      const data = await response.json();
      const token = data.token;
      const refreshtoken = data.refreshToken;
      const err = data.error;

      if (err != null) {
        setError(err);
        // setJwtToken(null);
        // setIsLoggedIn(false);
      } else {
        console.log(token);
        setJwtToken(token);

        setIsLoggedIn(true);
        alert("註冊成功");
        // navigate("/");
      }
    } catch (error: any) {
      console.error('Error fetching token:', error);
      setError(error.message as string);
    }
  };
  /**register SUPERVISOR */
  const fetchRegisterSupervisor = async () => {
    try {
      const response = await fetch(`${globalUrl.url}/auth/registerSupervisor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: input1,
          password: input2,
        }),
      });

      const data = await response.json();
      const token = data.token;
      const refreshtoken = data.refreshToken;
      const err = data.error;

      if (err != null) {
        setError(err);
        // setJwtToken(null);
        // setIsLoggedIn(false);
      } else {
        console.log(token);
        setJwtToken(token);

        setIsLoggedIn(true);
        alert("註冊成功");
        // navigate("/");
      }
    } catch (error: any) {
      console.error('Error fetching token:', error);
      setError(error.message as string);
    }
  };
  /**register ADMIN */
  const fetchRegisterAdmin = async () => {
    try {
      const response = await fetch(`${globalUrl.url}/auth/registerAdmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: input1,
          password: input2,
        }),
      });

      const data = await response.json();
      const token = data.token;
      const refreshtoken = data.refreshToken;
      const err = data.error;

      if (err != null) {
        setError(err);
        // setJwtToken(null);
        // setIsLoggedIn(false);
      } else {
        console.log(token);
        setJwtToken(token);

        setIsLoggedIn(true);
        alert("註冊成功");
        // navigate("/");
      }
    } catch (error: any) {
      console.error('Error fetching token:', error);
      setError(error.message as string);
    }
  };


  const fetchRegister = () => {
    switch (selectedRole) {
      case 'USER':
        fetchRegisterUser();
        break;
      case 'OPERATOR':
        fetchRegisterOperator();
        break;
      case 'SUPERVISOR':
        fetchRegisterSupervisor();
        break;
      case 'ADMIN':
        fetchRegisterAdmin();
        break;
      default:
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

  const handleRoleChange = (event: any) => {
    setSelectedRole(event.target.value);
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
        <TextField
          select
          label="Select Role"
          value={selectedRole}
          onChange={handleRoleChange}

          margin="normal"
          sx={{ width: '300px' }}

        >
          <MenuItem value="USER">USER</MenuItem>
          <MenuItem value="OPERATOR">OPERATOR</MenuItem>
          <MenuItem value="SUPERVISOR">SUPERVISOR</MenuItem>
          <MenuItem value="ADMIN">ADMIN</MenuItem>
        </TextField>
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