import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  Divider,
  Button,
  TextField,
  Select,
  Autocomplete,
  MenuItem
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';
import Text from 'src/components/Text';
import { useState, useEffect } from 'react';
import myAxios from 'src/utils/axios';

function RoleMgtTab({isNewRole, GetRole, roleData, setRoleData}) {
  const [modules, setModules] = useState([]);
  const [editContent, setEditContent] = useState(isNewRole);
  const notifyError = (msj) => toast.error(msj);
  const notifySuccess = (msj) => toast.success(msj);
  let navigate = useNavigate();

  const GetModules = async ()=>{
    try {
      let res = await myAxios('configuration').get('Modules');
      if(res.status >= 200 && res.status < 300){
        const datos = res.data.filter(d=>d.isEnabled).map(d=> ({...d,id: d.moduleId, label: d.description}));
        setModules([...datos]);
      }
      return res.data
    } catch (err) {
      console.error(err);
    }
  }
  const handleSaveRole = async ()=>{
    if(!roleData.description || !roleData.moduleId || roleData.isEnabled == null ){
      notifyError("Missing data to capture");
      return;
    }

    let _roleData = {
      ...roleData,
      createdBy: 3
    }

    try {
      let res = await myAxios('configuration').post('Roles', _roleData);

      if(res.status >= 200 && res.status < 300){
        notifySuccess("Has been saved successfully")
      }
      setTimeout(()=>{
        navigate(`/management/roles/list/${res.data.roleId}`, { replace: false});
      },2000);
    } catch (error) {
      console.error(error);
    }
  }
  const handleUpdateRole = async ()=>{
    if(!roleData.description || !roleData.moduleId || roleData.isEnabled == null){
      notifyError("Missing data to capture");
      return;
    }
    let _roleData = { ...roleData };

    try {
      let res = await myAxios('configuration').post(`Roles/${_roleData.roleId}`, _roleData);

      if(res.status >= 200 && res.status < 300){
        notifySuccess("Has been saved successfully");
      }

      setEditContent(false);
      await GetRole();
    } catch (error) {
      console.error(error);
    }
  }
  const handleChangeRole = (ev) => {
    let value = ev.currentTarget.value;
    value = value.trim() === "" ? null : value;
    setRoleData(p => ({...p, description: value}));
  }
  const handleChangeModule = (ev, item) => {
    const value = (!item ? null : item.moduleId);
    setRoleData(p => ({...p, moduleId: value}));
  }
  const handleChangeStatus = (ev) => {
    let value = (ev.target.value.toString() === 'true');
    setRoleData(p => ({...p, isEnabled: value}));
  }
  const handleSwitchUpdate = (ev)=>{
    setEditContent(true);
  }


  useEffect(()=>{
    GetModules();
  },[]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Role Details
              </Typography>
              <Typography variant="subtitle2">
                Manage information related to the role
              </Typography>
            </Box>
            {
              isNewRole ? (
                <Button variant="outlined" startIcon={<DoneTwoToneIcon />} onClick={handleSaveRole}>Save changes</Button>
              ) : (
                editContent ? (
                  <Button variant="outlined" startIcon={<DoneTwoToneIcon />} onClick={handleUpdateRole}>Save changes</Button>
                ) :(
                  <Button variant="text" startIcon={<EditTwoToneIcon />} onClick={handleSwitchUpdate}>Edit</Button>
                )
              )
            }
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
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>Role:</Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Box sx={{ maxWidth: { xs: 'auto', sm: 300 } }}>
                  {
                    editContent ? (
                      <TextField size="small" sx={{mb: 2, width:"100%"}} value={roleData.description || ""}
                        onChange={handleChangeRole}
                      />
                    ) : ( <Text color="black"><b>{roleData.description}</b></Text> )
                  }
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>Module:</Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Box sx={{ maxWidth: { xs: 'auto', sm: 300 } }}>
                  {
                    editContent ? (
                      <Autocomplete
                        size="small"
                        disablePortal
                        options={modules}
                        sx={{ mb: 2 }}
                        onChange={handleChangeModule}
                        value={modules.find(a=>a.id === roleData.moduleId) || null}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    ) : ( <Text color="black"><b>{roleData.module && roleData.module.description}</b></Text> )
                  }
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>Status:</Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Box sx={{ maxWidth: { xs: 'auto', sm: 300 } }}>
                  {
                    editContent ? (
                      <Select
                        size="small"
                        sx={{width:"100%", mb: 2}}
                        onChange={handleChangeStatus}
                        value={roleData.isEnabled == null ? "" : roleData.isEnabled}
                      >
                        <MenuItem value={true}>Active</MenuItem>
                        <MenuItem value={false}>Inactive</MenuItem>
                      </Select>
                    ) : ( <Text color="black"><b>{roleData.isEnabled ? 'Active' : 'Inactive'}</b></Text> )
                  }
                  </Box>
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default RoleMgtTab;
