import { Card } from '@mui/material';
import RecentUsersTable from './RecentUsersTable';
import myAxios from 'src/utils/axios';
import { useState, useEffect } from 'react';
import { useAuthHeader } from 'react-auth-kit';

function RecentUsers() {
  const auth = useAuthHeader();
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const GetUsers = async ()=>{
    try {
      let res = await myAxios('configuration',auth()).get('Users');

      if(res.status >= 200 && res.status < 300){
        const datos = res.data.map(d=> ({...d,id: d.userId, area_desc: (d.area && d.area.description)}));
        setUsers([...datos]);
      }
      return res.data
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(()=>{
    if(refresh){
      GetUsers();
      setRefresh(false);
    }
  },[refresh]);

  return (
    <Card>
      <RecentUsersTable tableData={users} setRefreshUsers={setRefresh} />
    </Card>
  );
}

export default RecentUsers;
