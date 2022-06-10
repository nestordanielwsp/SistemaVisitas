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
  MenuItem
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import myAxios from 'src/utils/axios';
import Text from 'src/components/Text';

function ModuleMgtTab({isNewModule}) {
  const [moduleData, setModuleData] = useState({});
  const [editContent, setEditContent] = useState(isNewModule);
  const notifyError = (msj) => toast.error(msj);
  const notifySuccess = (msj) => toast.success(msj);
  let { id } = useParams();
  let navigate = useNavigate();

  const GetModule = async ()=>{
    try {
      let res = await myAxios('configuration').get(`Modules/${id}`);
      if(res.status >= 200 && res.status < 300){
        setModuleData({...res.data});
      }
      return res.data
    } catch (err) {
      console.error(err);
    }
  }
  const handleSaveModule = async ()=>{
    if(!moduleData.description || moduleData.isEnabled == null){
      notifyError("Missing data to capture");
      return;
    }

    let _moduleData = { ...moduleData, createdBy: 3 }

    try {
      let res = await myAxios('configuration').post('Modules', _moduleData);

      if(res.status >= 200 && res.status < 300){
        notifySuccess("Has been saved successfully")
      }
      setTimeout(()=>{
        navigate(`/management/modules/list/${res.data.moduleId}`, { replace: false});
      },2000);
    } catch (error) {
      console.error(error);
    }
  }
  const handleUpdateModule = async ()=>{
    if(!moduleData.description || moduleData.isEnabled == null){
      notifyError("Missing data to capture");
      return;
    }
    let _moduleData = { ...moduleData };

    try {
      let res = await myAxios('configuration').put(`Modules/${_moduleData.moduleId}`, _moduleData);

      if(res.status >= 200 && res.status < 300){
        notifySuccess("Has been saved successfully");
      }
      setEditContent(false);
      await GetModule();
    } catch (error) {
      console.error(error);
    }
  }
  const handleChangeStatus = (ev) => {
    let value = (ev.target.value.toString() === 'true');
    setModuleData(p => ({...p, isEnabled: value}));
  }
  const handleChangeModule = (ev) => {
    let value = ev.currentTarget.value;
    value = value.trim() === "" ? null : value;
    setModuleData(p => ({...p, description: value}));
  }
  const handleSwitchUpdate = (ev)=>{
    setEditContent(true);
  }

  useEffect(()=>{
    if(!isNewModule)
      GetModule();
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
                Module Details
              </Typography>
              <Typography variant="subtitle2">
                Manage information related to the module
              </Typography>
            </Box>
            {
              isNewModule ? (
                <Button variant="outlined" startIcon={<DoneTwoToneIcon />} onClick={handleSaveModule}>Save changes</Button>
              ) : (
                editContent ? (
                  <Button variant="outlined" startIcon={<DoneTwoToneIcon />} onClick={handleUpdateModule}>Save changes</Button>
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
                  <Box pr={3} pb={2}>Module:</Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Box sx={{ maxWidth: { xs: 'auto', sm: 300 } }}>
                  {
                    editContent ? (
                      <TextField size="small" sx={{mb: 2, width:"100%"}} value={moduleData.description || ""}
                        onChange={handleChangeModule}
                      />
                    ) : ( <Text color="black"><b>{moduleData.description}</b></Text> )
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
                        value={moduleData.isEnabled == null ? "" : moduleData.isEnabled}
                      >
                        <MenuItem value={true}>Active</MenuItem>
                        <MenuItem value={false}>Inactive</MenuItem>
                      </Select>
                    ) : ( <Text color="black"><b>{moduleData.isEnabled ? 'Active' : 'Inactive'}</b></Text> )
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

export default ModuleMgtTab;
