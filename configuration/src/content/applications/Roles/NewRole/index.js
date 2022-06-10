import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container, Tabs, Tab, Grid } from '@mui/material';
import Footer from 'src/components/Footer';
import { styled } from '@mui/material/styles';
import myAxios from 'src/utils/axios';
import RoleMgtTab from './Mangement/RoleMgtTab';
import ViewsTab from './Views/ViewsTab';
import { useAuthHeader } from 'react-auth-kit';
import { useParams } from 'react-router';

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function ManagementRoleSettings({isNewRole}) {
  const [roleData, setRoleData] = useState({});
  const [currentTab, setCurrentTab] = useState('role_management');
  const auth = useAuthHeader();
  let { id } = useParams();

  const tabs = isNewRole ? (
    [ { value: 'role_management', label: 'Role Management' } ]
  ) :( [
      { value: 'role_management', label: 'Role Management' },
      { value: 'views', label: 'Views' }
  ] );

  const GetRole = async ()=>{
    try {
      let res = await myAxios('configuration',auth()).get(`Roles/${id}`);
      if(res.status >= 200 && res.status < 300){
        setRoleData({...res.data});
      }
    } catch (err) {
      console.error(err);
    }
  }
  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  useEffect(()=>{
    if(!isNewRole)
      GetRole();
  },[]);

  return (
    <>
      <Helmet>
        <title>Role Settings - Applications</title>
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
            {currentTab === 'role_management' && <RoleMgtTab isNewRole={isNewRole} roleData={roleData} setRoleData={setRoleData} GetRole={GetRole} />}
            {currentTab === 'views' && <ViewsTab GetRole={GetRole} role={roleData} views={roleData.roleViews.map(e=> ({...e.view, id: e.roleViewId}))} />}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ManagementRoleSettings;
