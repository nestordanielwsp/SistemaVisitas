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
  MenuItem,
  Autocomplete
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone';
import { useState, useEffect } from 'react';
import myAxios from 'src/utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router';
import Text from 'src/components/Text';
import { useAuthUser } from 'react-auth-kit';

function ViewMgtTab({isNewView}) {
  const [modules, setModules] = useState([]);
  const [viewData, setViewData] = useState({});
  const infoUserAuth = useAuthUser();
  const [editContent, setEditContent] = useState(isNewView);
  const notifyError = (msj) => toast.error(msj);
  const notifySuccess = (msj) => toast.success(msj);
  let { id } = useParams();
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
  const GetView = async ()=>{
    try {
      let res = await myAxios('configuration').get(`Views/${id}`);
      if(res.status >= 200 && res.status < 300){
        setViewData({...res.data});
      }
      console.log(res.data);
      return res.data
    } catch (err) {
      console.error(err);
    }
  }
  const handleSaveView = async ()=>{

    if(!viewData.description || !viewData.path || !viewData.moduleId ||
        viewData.isEnabled == null){
      notifyError("Missing data to capture");
      return;
    }

    let _viewData = {
      ...viewData,
      path: viewData.path.trim(),
      description: viewData.description.trim(),
      createdBy: infoUserAuth().userId
    }

    try {
      let res = await myAxios('configuration').post('Views', _viewData);

      if(res.status >= 200 && res.status < 300){
        notifySuccess("Has been saved successfully")
      }
      setTimeout(()=>{
        navigate(`/management/views/list/${res.data.viewId}`, { replace: false});
      },2000);
    } catch (error) {
      console.error(error);
    }
  }
  const handleUpdateView = async ()=>{
    if(!viewData.description || !viewData.path || !viewData.moduleId ||
      viewData.isEnabled == null){
      notifyError("Missing data to capture");
      return;
    }
    let _viewData = {
      ...viewData,
      path: viewData.path.trim(),
      description: viewData.description.trim(),
    };

    try {
      let res = await myAxios('configuration').post(`Views/${_viewData.viewId}`, _viewData);

      if(res.status >= 200 && res.status < 300){
        notifySuccess("Has been saved successfully");
      }

      setEditContent(false);
      await GetView();
    } catch (error) {
      console.error(error);
    }
  }
  const handleChangeView = (ev) => {
    let value = ev.currentTarget.value;
    value = value.trim() === "" ? null : value;
    setViewData(p => ({...p, description: value}));
  }
  const handleChangePath = (ev) => {
    let value = ev.currentTarget.value;
    value = value.trim() === "" ? null : value;
    setViewData(p => ({...p, path: value}));
  }
  const handleChangeModule = (ev, item) => {
    const value = (!item ? null : item.moduleId);
    setViewData(p => ({...p, moduleId: value}));
  }
  const handleChangeStatus = (ev) => {
    let value = (ev.target.value.toString() === 'true');
    setViewData(p => ({...p, isEnabled: value}));
  }
  const handleSwitchUpdate = (ev)=>{
    setEditContent(true);
  }

  useEffect(()=>{
    GetModules();
    if(!isNewView)
      GetView();
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
                View Details
              </Typography>
              <Typography variant="subtitle2">
                Manage information related to the view
              </Typography>
            </Box>
            {
              isNewView ? (
                <Button variant="outlined" startIcon={<DoneTwoToneIcon />} onClick={handleSaveView}>Save changes</Button>
              ) : (
                editContent ? (
                  <Button variant="outlined" startIcon={<DoneTwoToneIcon />} onClick={handleUpdateView}>Save changes</Button>
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
                  <Box pr={3} pb={2}>View:</Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Box sx={{ maxWidth: { xs: 'auto', sm: 300 } }}>
                  {
                    editContent ? (
                      <TextField size="small" sx={{mb: 2, width:"100%"}} value={viewData.description || ""}
                        onChange={handleChangeView}
                      />
                    ) : ( <Text color="black"><b>{viewData.description}</b></Text> )
                  }
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>Path:</Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Box sx={{ maxWidth: { xs: 'auto', sm: 300 } }}>
                  {
                    editContent ? (
                      <TextField size="small" sx={{mb: 2, width:"100%"}} value={viewData.path || ""}
                        onChange={handleChangePath}
                      />
                    ) : ( <Text color="black"><b>{viewData.path}</b></Text> )
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
                        value={modules.find(a=>a.id === viewData.moduleId) || null}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    ) : ( <Text color="black"><b>{viewData.module && viewData.module.description}</b></Text> )
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
                        value={viewData.isEnabled == null ? "" : viewData.isEnabled}
                      >
                        <MenuItem value={true}>Active</MenuItem>
                        <MenuItem value={false}>Inactive</MenuItem>
                      </Select>
                    ) : ( <Text color="black"><b>{viewData.isEnabled ? 'Active' : 'Inactive'}</b></Text> )
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

export default ViewMgtTab;
