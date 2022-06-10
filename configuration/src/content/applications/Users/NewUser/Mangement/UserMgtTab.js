import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  Divider,
  Button,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone';
import { useState, useEffect } from 'react';
import myAxios from 'src/utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Compress from "browser-image-compression";
import { useParams, useNavigate } from 'react-router';
import Text from 'src/components/Text';
import { useAuthHeader } from 'react-auth-kit';
import buildFormData from 'src/utils/buildFormData';

function UserMgtTab({isNewUser, GetUser, userData, setUserData}) {
  const [areas, setAreas] = useState([]);
  const [loadImage, setLoadImage] = useState(0);
  const [editContent, setEditContent] = useState(isNewUser);
  const notifyError = (msj) => toast.error(msj);
  const notifySuccess = (msj) => toast.success(msj);
  let navigate = useNavigate();
  const auth = useAuthHeader();

  const GetAreas = async ()=>{
    try {
      let res = await myAxios('configuration').get('Areas');
      if(res.status >= 200 && res.status < 300){
        const datos = res.data.filter(d=>d.isEnabled).map(d=> ({...d,id: d.areaId, label: d.description}));
        setAreas([...datos]);
      }
      return res.data
    } catch (err) {
      console.error(err);
    }
  }
  const CompressFile = async (e)=>{
    setLoadImage(0);
    try {
      const file = e.target.files[0];
      let compressBlob = await Compress(file, {
        maxWidthOrHeight: 150,
        useWebWorker: true,
        onProgress: p => {
          setLoadImage(p);
        }
      });
      compressBlob.lastModified = new Date();
      const compressFile = new File([compressBlob], file.name, {
        type: file.type,
        lastModified: Date.now()
      });
      return compressFile;
    } catch (error) {
      console.error(e);
    }
  }
  const GeneratePasswordRand = (length,type) => {
    switch(type){
        case 'num':
            characters = "0123456789";
            break;
        case 'alf':
            characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            break;
        case 'rand':
            //FOR ↓
            break;
        default:
            characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            break;
    }
    let pass = "";
    Array.from(Array(length).keys()).forEach(indx => {
      if(type == 'rand')
        pass += String.fromCharCode((Math.floor((Math.random() * 100)) % 94) + 33);
      else
          pass += characters.charAt(Math.floor(Math.random()*characters.length));
    });

    return pass;
  }
  const handleSaveUser = async ()=>{
    if(!userData.name || !userData.lastName || !userData.email || !userData.areaId ||
        !userData.employeeNumber || userData.isEnabled == null){
      notifyError("Missing data to capture");
      return;
    }

    let _userData = {
      ...userData,
      password: GeneratePasswordRand(8, "rand"),
      isLDAPAuth: false,
      createdBy: null
    }

    let bodyFormData = new FormData();
    buildFormData(bodyFormData, _userData);

    try {
      let res = await myAxios('configuration',auth()).post('Users', bodyFormData);

      if(res.status >= 200 && res.status < 300){
        notifySuccess("Has been saved successfully")
      }
      setTimeout(()=>{
        navigate(`/management/users/list/${res.data.userId}`, { replace: false});
      },2000);
    } catch (error) {
      console.error(error);
    }
  }
  const handleUpdateUser = async ()=>{
    if(!userData.name || !userData.lastName || !userData.email || !userData.areaId ||
      !userData.employeeNumber || userData.isEnabled == null){
      notifyError("Missing data to capture");
      return;
    }
    let _userData = { ...userData };

    let bodyFormData = new FormData();
    buildFormData(bodyFormData, _userData);

    try {
      let res = await myAxios('configuration',auth()).put(`Users/${_userData.userId}`, bodyFormData);

      if(res.status >= 200 && res.status < 300){
        notifySuccess("Has been saved successfully");
      }

      setEditContent(false);
      await GetUser();
    } catch (error) {
      console.error(error);
    }
  }
  const handleChangeName = (ev) => {
    let value = ev.currentTarget.value;
    value = value.trim() === "" ? null : value;
    setUserData(p => ({...p, name: value}));
  }
  const handleChangeLastName = (ev) => {
    let value = ev.currentTarget.value;
    value = value.trim() === "" ? null : value;
    setUserData(p => ({...p, lastName: value}));
  }
  const handleChangeArea = (ev, item) => {
    const value = (!item ? null : item.areaId);
    setUserData(p => ({...p, areaId: value}));
  }
  const handleChangeEmail = (ev) => {
    let value = ev.currentTarget.value;
    value = value.trim() === "" ? null : value;
    setUserData(p => ({...p, email: value}));
  }
  const handleBlurValidEmail = (ev)=>{
    if(!ev.currentTarget.validity.valid){
      setUserData(p=>({...p, email:null}));
    }
  }
  const handleChangeNoEmp = (ev) => {
    let value = ev.currentTarget.value;
    value = value.trim() === "" ? null : value;
    setUserData(p => ({...p, employeeNumber: value}));
  }
  const handleChangeStatus = (ev) => {
    let value = (ev.target.value.toString() === 'true');
    setUserData(p => ({...p, isEnabled: value}));
  }
  const handleChangeImage = async (ev)=>{
    const file = await CompressFile(ev);
    setUserData(p => ({...p, imageFile: file}));
  }
  const handleSwitchUpdate = (ev)=>{
    setEditContent(true);
  }

  useEffect(()=>{
    GetAreas();
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
                User Details
              </Typography>
              <Typography variant="subtitle2">
                Manage information related to the user
              </Typography>
            </Box>
            {
              isNewUser ? (
                <Button variant="outlined" startIcon={<DoneTwoToneIcon />} onClick={handleSaveUser}>Save changes</Button>
              ) : (
                editContent ? (
                  <Button variant="outlined" startIcon={<DoneTwoToneIcon />} onClick={handleUpdateUser}>Save changes</Button>
                ) :(
                  <Button variant="text" startIcon={<EditTwoToneIcon />} onClick={handleSwitchUpdate}>Edit</Button>
                )
              )
            }

          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>Name:</Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Box sx={{ maxWidth: { xs: 'auto', sm: 300 } }}>
                  {
                    editContent ? (
                      <TextField size="small" sx={{mb: 2, width:"100%"}} value={userData.name || ""}
                        onChange={handleChangeName}
                      />
                    ) : ( <Text color="black"><b>{userData.name}</b></Text> )
                  }
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>Last name:</Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Box sx={{ maxWidth: { xs: 'auto', sm: 300 } }}>
                  {
                    editContent ? (
                      <TextField size="small" sx={{mb: 2, width:"100%"}} value={userData.lastName || ""}
                        onChange={handleChangeLastName}
                      />
                    ) : ( <Text color="black"><b>{userData.lastName}</b></Text> )
                  }
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>Area:</Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Box sx={{ maxWidth: { xs: 'auto', sm: 300 } }}>
                  {
                    editContent ? (
                      <Autocomplete
                        size="small"
                        disablePortal
                        options={areas}
                        sx={{ mb: 2 }}
                        onChange={handleChangeArea}
                        value={areas.find(a=>a.id === userData.areaId) || null}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    ) : ( <Text color="black"><b>{userData.area && userData.area.description}</b></Text> )
                  }
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>Email:</Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Box sx={{ maxWidth: { xs: 'auto', sm: 300 } }}>
                  {
                    editContent ? (
                      <TextField size="small" sx={{mb: 2, width:"100%"}} type="email" value={userData.email || ""}
                        onChange={handleChangeEmail} onBlur={handleBlurValidEmail}/>
                    ) : ( <Text color="black"><b>{userData.email}</b></Text> )
                  }
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>No. Employee:</Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Box sx={{ maxWidth: { xs: 'auto', sm: 300 } }}>
                  {
                    editContent ? (
                      <TextField size="small" sx={{mb: 2, width:"100%"}} value={userData.employeeNumber || ""}
                        onChange={handleChangeNoEmp}/>
                    ) : ( <Text color="black"><b>{userData.employeeNumber}</b></Text> )
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
                        value={userData.isEnabled == null ? "" : userData.isEnabled}
                      >
                        <MenuItem value={true}>Active</MenuItem>
                        <MenuItem value={false}>Inactive</MenuItem>
                      </Select>
                    ) : ( <Text color="black"><b>{userData.isEnabled ? 'Active' : 'Inactive'}</b></Text> )
                  }
                  </Box>
                </Grid>

                {
                    editContent && (
                      <>
                        <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                          <Box pr={3} pb={2}>Image:</Box>
                        </Grid>
                        <Grid item xs={12} sm={8} md={9}>
                          <Box sx={{ maxWidth: { xs: 'auto', sm: 300 } }}>
                            <TextField size="small" sx={{ width:"100%"}} type="file" inputProps={{accept:".jpeg,.jpg"}}
                              onChange={handleChangeImage} />
                            <LinearProgress variant="determinate" value={loadImage} />
                          </Box>
                        </Grid>
                      </>
                    )
                }
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default UserMgtTab;
