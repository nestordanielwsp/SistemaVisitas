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
import { useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import myAxios from 'src/utils/axios';
import Text from 'src/components/Text';

function AreaMgtTab({isNewArea}) {
  const [areaData, setAreaData] = useState({});
  const [editContent, setEditContent] = useState(isNewArea);
  const notifyError = (msj) => toast.error(msj);
  const notifySuccess = (msj) => toast.success(msj);
  let { id } = useParams();
  let navigate = useNavigate();

  const GetArea = async ()=>{
    try {
      let res = await myAxios('configuration').get(`Areas/${id}`);
      if(res.status >= 200 && res.status < 300){
        setAreaData({...res.data});
      }
      return res.data
    } catch (err) {
      console.error(err);
    }
  }
  const handleSaveArea = async ()=>{
    if(!areaData.description || areaData.isEnabled == null){
      notifyError("Missing data to capture");
      return;
    }

    let _areaData = { ...areaData, createdBy: 3 }

    try {
      let res = await myAxios('configuration').post('Areas', _areaData);

      if(res.status >= 200 && res.status < 300){
        notifySuccess("Has been saved successfully")
      }
      setTimeout(()=>{
        navigate(`/management/areas/list/${res.data.areaId}`, { replace: false});
      },2000);
    } catch (error) {
      console.error(error);
    }
  }
  const handleUpdateArea = async ()=>{
    if(!areaData.description || areaData.isEnabled == null){
      notifyError("Missing data to capture");
      return;
    }
    let _areaData = { ...areaData };

    try {
      let res = await myAxios('configuration').post(`Areas/${_areaData.areaId}`, _areaData);

      if(res.status >= 200 && res.status < 300){
        notifySuccess("Has been saved successfully");
      }
      setEditContent(false);
      await GetArea();
    } catch (error) {
      console.error(error);
    }
  }
  const handleChangeArea = (ev) => {
    let value = ev.currentTarget.value;
    value = value.trim() === "" ? null : value;
    setAreaData(p => ({...p, description: value}));
  }
  const handleChangeStatus = (ev) => {
    let value = (ev.target.value.toString() === 'true');
    setAreaData(p => ({...p, isEnabled: value}));
  }
  const handleSwitchUpdate = (ev)=>{
    setEditContent(true);
  }

  useEffect(()=>{
    if(!isNewArea)
      GetArea();
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
                Area Details
              </Typography>
              <Typography variant="subtitle2">
                Manage information related to the area
              </Typography>
            </Box>
            {
              isNewArea ? (
                <Button variant="outlined" startIcon={<DoneTwoToneIcon />} onClick={handleSaveArea}>Save changes</Button>
              ) : (
                editContent ? (
                  <Button variant="outlined" startIcon={<DoneTwoToneIcon />} onClick={handleUpdateArea}>Save changes</Button>
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
                  <Box pr={3} pb={2}>Area:</Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Box sx={{ maxWidth: { xs: 'auto', sm: 300 } }}>
                  {
                    editContent ? (
                      <TextField size="small" sx={{mb: 2, width:"100%"}} value={areaData.description || ""}
                        onChange={handleChangeArea}
                      />
                    ) : ( <Text color="black"><b>{areaData.description}</b></Text> )
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
                        value={areaData.isEnabled == null ? "" : areaData.isEnabled}
                      >
                        <MenuItem value={true}>Active</MenuItem>
                        <MenuItem value={false}>Inactive</MenuItem>
                      </Select>
                    ) : ( <Text color="black"><b>{areaData.isEnabled ? 'Active' : 'Inactive'}</b></Text> )
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

export default AreaMgtTab;
