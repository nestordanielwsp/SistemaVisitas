import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container, Tabs, Tab, Grid } from '@mui/material';
import Footer from 'src/components/Footer';
import { styled } from '@mui/material/styles';
import myAxios from 'src/utils/axios';
import UserMgtTab from './Mangement/UserMgtTab';
import RolesTab from './Roles/RolesTab';
import SecurityTab from './Security/SecurityTab';
import { useAuthHeader } from 'react-auth-kit';
import { useParams } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function ManagementUserSettings({isNewUser}) {
  const [userData, setUserData] = useState({});
  const [currentTab, setCurrentTab] = useState('user_management');
  const auth = useAuthHeader();
  let { id } = useParams();

  const tabs = isNewUser ? (
    [ { value: 'user_management', label: 'User Management' } ]
  ) :(
    [
      { value: 'user_management', label: 'User Management' },
      { value: 'roles', label: 'Roles' },
      { value: 'security', label: 'Passwords/Security' }
    ]
  );

  const GetUser = async ()=>{
    try {
      let res = await myAxios('configuration',auth()).get(`Users/${id}`);
      if(res.status >= 200 && res.status < 300){
        setUserData({...res.data});
      }
    } catch (err) {
      console.error(err);
    }
  }
  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  useEffect(()=>{
    if(!isNewUser)
      GetUser();
  },[]);

  return (
    <>
      <Helmet>
        <title>User Settings - Applications</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <TabsWrapper
              onChange={handleTabsChange}
              value={currentTab}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </TabsWrapper>
          </Grid>
          <Grid item xs={12}>
            {currentTab === 'user_management' && <UserMgtTab isNewUser={isNewUser} userData={userData} setUserData={setUserData} GetUser={GetUser} />}
            {currentTab === 'roles' && <RolesTab GetUser={GetUser} userId={userData.userId} roles={userData.userRoles.map(e=> ({...e.role, id: e.userRoleId}))} />}
            {currentTab === 'security' && <SecurityTab GetUser={GetUser} userData={userData} setUserData={setUserData} />}
          </Grid>
        </Grid>
      </Container>
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
      <Footer />
    </>
  );
}

export default ManagementUserSettings;
