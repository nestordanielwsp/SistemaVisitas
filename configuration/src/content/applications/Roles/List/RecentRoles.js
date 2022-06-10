import { Card } from '@mui/material';
import RecentRolesTable from './RecentRolesTable';
import myAxios from 'src/utils/axios';
import { useState, useEffect } from 'react';

function RecentRoles() {
  const [roles, setRoles] = useState([]);
  const [refresh, setRefresh] = useState(true);

  const GetRoles = async ()=>{
    try {
      let res = await myAxios('configuration').get('Roles');
      if(res.status >= 200 && res.status < 300){
        const datos = res.data.map(d=> ({...d,id: d.roleId}));
        setRoles([...datos]);
      }
      return res.data
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(()=>{
    if(refresh){
      GetRoles();
      setRefresh(false);
    }
  },[refresh]);

  return (
    <Card>
      <RecentRolesTable tableData={roles} setRefreshRoles={setRefresh} />
    </Card>
  );
}

export default RecentRoles;
