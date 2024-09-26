import React, { useState, useContext  } from 'react';
import { Grid, TextField, Button, Typography, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { UserContext } from '../context/userContext'; 
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'gray',
  
  },
  formContainer: {
    padding: '20px',
    maxWidth: '400px',
    margin: '10px',
    marginLeft: '36%'
    
  },
  formTitle: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  submitButton: {
    marginTop: '20px',
  },
  
}));

var url = "http://127.0.0.1:1337";



const AuthForms = () => {
 
  const classes = useStyles();
  
  const handleLoginSubmit = (e) => {
    e.preventDefault();
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
  };

  const { setUser} = useContext(UserContext);
  const navigate = useNavigate();


  //login delen
  function handleGetEmailOfUser(userEmail) {
    setUser(userEmail);
}
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");


   //Login error alert:
   const loginEmailError = document.querySelector('.loginEmailError');
   const loginPasswordError = document.querySelector('.loginPasswordError');

  const loginUser = () => {
    if (loginEmail && loginPassword) {
    

      fetch(url + "/login", {
        method: "POST",
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ u_email: loginEmail, u_password: loginPassword })
      })
        .then((response) => response.json())
        .then((data) => {
          
          if(data.errors){
            loginEmailError.textContent = data.errors.u_email;
            loginPasswordError.textContent = data.errors.u_password;
          }
          else {
          localStorage.setItem('jwt', data.token);
          handleGetEmailOfUser(data.email)
          navigate('./editor');
        }
        })
    } else {
      console.log("Login fail")
    }
  };




  //Register delen:
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  
  
  //Register error alert:
  const emailError = document.querySelector('.regEmailError');
  const passwordError = document.querySelector('.regPasswordError');
  

  const registerNewUser = () => {
    if (regEmail && regPassword) {
      fetch(url + "/register", {
        method: "POST",
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ u_email: regEmail, u_password: regPassword })
      })
        .then((response) => response.json())
        .then((data) => {
          if(data.error){
            emailError.textContent = data.error.split('u_email: ')[1]?.split(',')[0];
            passwordError.textContent = data.error.split('u_password: ')[1]?.split(',')[0];
          }
          else {
            localStorage.setItem('jwt', data.token);
            handleGetEmailOfUser(data.email)
            navigate('./editor');
          }
        })
    } else {
      console.log("Register failed!");
    }
  };


  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        {/* Login Form */}
        <Grid item xs={12} md={5} >
          <Paper elevation={3} className={classes.formContainer}>
            <Typography variant="h5" className={classes.formTitle}>
              Login
            </Typography>
            <form onSubmit={handleLoginSubmit}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                name="email"
                onChange={(event) => {
                  setLoginEmail(event.target.value);
                }}
                value={loginEmail ? loginEmail : ""}
              />
              <div style={{color: "red"}}  class="loginEmailError"></div>

              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                name="password"
                onChange={(event) => {
                  setLoginPassword(event.target.value);
                }}
                value={loginPassword ? loginPassword : ""}
              />
               <div style={{color: "red"}}  class="loginPasswordError"></div>
              <Button
               style={{marginTop: "20px"}} 
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submitButton}
                onClick={() => {
                  loginUser();
                  setRegEmail("");
                  setRegPassword("");
                  setLoginEmail("");
                  setLoginPassword("");
                }}
              >
{/*                 {user && <Link to="./editor">Login</Link>}
 */}                Login
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Register Form */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} className={classes.formContainer}>
            <Typography variant="h5" className={classes.formTitle}>
              Register
            </Typography>
            <form onSubmit={handleRegisterSubmit}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                name="email"
                onChange={(event) => {
                  setRegEmail(event.target.value);
                }}
                value={regEmail ? regEmail : ""}
              />
              <div style={{color: "red"}}  class="regEmailError"></div>
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                name="password"
                onChange={(event) => {
                  setRegPassword(event.target.value);
                }}
                value={regPassword ? regPassword : ""}
              />
               <div style={{color: "red"}} class="regPasswordError"></div>
              <Button
                  style={{marginTop: "20px"}} 
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submitButton}
                onClick={() => {
                  registerNewUser();
                  setRegEmail("");
                  setRegPassword("");
                  setLoginEmail("");
                  setLoginPassword("");
                }}
              >
                Register
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default AuthForms;