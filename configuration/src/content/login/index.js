import { Box, Container, Card, Button } from '@mui/material';
import { Typography, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import Logo from 'src/components/LogoSign';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSignIn } from 'react-auth-kit';
import myAxios from 'src/utils/axios';
import { useNavigate } from 'react-router';
import { useState } from 'react';

const OverviewWrapper = styled(Box)(
  () => `
    overflow: auto;
    flex: 1;
    overflow-x: hidden;
    align-items: center;
`
);

function Login() {
  const [user, setUser] = useState(null);
  const [pass, setPass] = useState(null);
  const signIn = useSignIn();
  const notifyError = (msj) => toast.error(msj);
  const notifySuccess = (msj) => toast.success(msj);
  let navigate = useNavigate();

  const handleLogin = async () => {
    if(user == null || pass == null){
      notifyError("Missing data to capture");
      return;
    }

    var _data = {
      username: user,
      password: pass
    }

    try {
      let res = await myAxios('configuration').post('Users/authenticate', _data);

      if(res.status >= 200 && res.status < 300){
        if(signIn({
          token: res.data.jwtToken.token,
          expiresIn: res.data.jwtToken.expiresIn,
          tokenType: "Bearer",
          authState: res.data.user,
          //refreshToken: res.data.jwtToken.refreshToken,                    // Only if you are using refreshToken feature
          //refreshTokenExpireIn: res.data.jwtToken.refreshTokenExpireIn     // Only if you are using refreshToken feature
        })){
            navigate('/', { replace: false});
          }else {
          //Throw error
        }
        notifySuccess("Has been saved successfully")
      }
    } catch (error) {
      console.error(error);
    }
  }
  const handleChangeUsername = (ev) => {
    let value = ev.currentTarget.value;
    value = value.trim() === "" ? null : value;
    setUser(value);
  }
  const handleChangePassword = (ev) => {
    let value = ev.currentTarget.value;
    value = value.trim() === "" ? null : value;
    setPass(value);
  }

  return (
    <OverviewWrapper>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" py={5} alignItems="center">
          <Logo />
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Card sx={{ p: 4, mb: 10, borderRadius: 1, maxWidth: 500, width: 500 }}>
            <Typography variant="h3" component="h3" gutterBottom>
              Configuration
            </Typography>
            <Box
              component="form"
              sx={{'& .MuiTextField-root': { mb: 2, width: '100%' }, paddingTop:"2em"}}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  sx={{}}
                  required
                  label="Email address"
                  onChange={handleChangeUsername}
                />
                <TextField
                  required
                  label="Password"
                  type="password"
                  onChange={handleChangePassword}
                />
              </div>
            </Box>
            <Box>
              <Button sx={{ width:"100%" }} variant="contained" onClick={handleLogin}>Sign in</Button>
            </Box>
          </Card>
        </Box>
        <ToastContainer
          theme="colored"
          position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Container>
    </OverviewWrapper>
  );
}

export default Login;
