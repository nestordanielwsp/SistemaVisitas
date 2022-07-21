import {
  Box,
  Typography,
  Card,
  Grid,
  ListItem,
  List,
  ListItemText,
  Divider,
  Button,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField
} from '@mui/material';
import { useState } from 'react';
import { useAuthHeader } from 'react-auth-kit';
import myAxios from 'src/utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import buildFormData from 'src/utils/buildFormData';


function SimpleDialog({onClose, open, handleClickChangePassword}) {
  const [pass, setPass] = useState(null);
  const handleChangePass = (ev)=>{
    let value = ev.currentTarget.value;
    value = value.trim() === "" ? null : value;
    setPass(value);
  }

  return (
    <Dialog onClose={onClose} open={open} maxWidth="sm" fullWidth={true}>
      <DialogTitle>
        <Box
          p={1}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              Change Password
            </Typography>
            <Typography variant="subtitle2">
              Enter a new password
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box>
          <TextField
            required
            type="password"
            size="small"
            sx={{ width:"100%", mb: 3 }}
            value={pass || ""}
            onChange={handleChangePass}
          />
        </Box>
        <Box>
          <Button sx={{ width:"100%" }} variant="contained" onClick={ev=>{handleClickChangePassword(pass)}}>Save changes</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function SecurityTab({userData, setUserData, GetUser}) {
  const notifySuccess = (msj) => toast.success(msj);
  const notifyError = (msj) => toast.error(msj);
  const [open, setOpen] = useState(false);
  const auth = useAuthHeader();


  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = ()=>{
    setOpen(true);
  }
  const handleChangeLDAP = async (event) => {
    let _userData = { ...userData, isLDAPAuth: event.target.checked };

    let bodyFormData = new FormData();
    buildFormData(bodyFormData, _userData);

    try {
      let res = await myAxios('configuration',auth()).post(`Users/${_userData.userId}`, bodyFormData);

      if(res.status >= 200 && res.status < 300){
        notifySuccess("Has been saved successfully");
      }
      await GetUser();
    } catch (error) {
      console.error(error);
    }
  }
  const handleClickChangePassword = async (pass) => {
    pass = (pass == null ? "" : pass.trim());
    if(pass == ""){
      notifyError("Missing data to capture");
      return;
    }
    if(pass.length < 8){
      notifyError("The password must contain a minimum of 8 characters");
      return;
    }
    let _passData = {
      userId: userData.userId,
      password: pass
    };

    try {
      let res = await myAxios('configuration',auth()).post(`Users/ChangePassword`, _passData);

      if(res.status >= 200 && res.status < 300){
        notifySuccess("Has been saved successfully");
      }
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box pb={2}>
          <Typography variant="h3">Security</Typography>
          <Typography variant="subtitle2">
            Change security preferences
          </Typography>
        </Box>
        <Card>
          <List>
            <ListItem sx={{ p: 3 }}>
              <ListItemText
                primaryTypographyProps={{ variant: 'h5', gutterBottom: true }}
                secondaryTypographyProps={{
                  variant: 'subtitle2',
                  lineHeight: 1
                }}
                primary="Change Password"
                secondary="Change your password here"
              />
              <Button size="large" variant="outlined" onClick={handleClickOpen}>
                Change password
              </Button>
              <SimpleDialog open={open} onClose={handleClose} handleClickChangePassword={handleClickChangePassword} />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ p: 3 }}>
              <ListItemText
                primaryTypographyProps={{ variant: 'h5', gutterBottom: true }}
                secondaryTypographyProps={{
                  variant: 'subtitle2',
                  lineHeight: 1
                }}
                primary="LDAP Authentication"
                secondary="Enable LDAP auth for all sign in attempts"
              />
              <Switch color="primary" checked={userData.isLDAPAuth} onChange={handleChangeLDAP} />
            </ListItem>
          </List>
        </Card>
      </Grid>
    </Grid>
  );
}

export default SecurityTab;
