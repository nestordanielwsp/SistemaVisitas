import { Card } from '@mui/material';
import RecentModulesTable from './RecentModulesTable';
import { useState, useEffect } from 'react';
import myAxios from 'src/utils/axios';

function RecentModules() {
  const [modules, setModules] = useState([]);
  const [refresh, setRefresh] = useState(true);

  const GetModules = async ()=>{
    try {
      let res = await myAxios('configuration').get('Modules');
      if(res.status >= 200 && res.status < 300){
        const datos = res.data.map(d=> ({...d, id: d.moduleId}));
        setModules([...datos]);
      }
      return res.data
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(()=>{
    if(refresh){
      GetModules();
      setRefresh(false);
    }
  },[refresh]);

  return (
    <Card>
      <RecentModulesTable tableData={modules} setRefreshModules={setRefresh} />
    </Card>
  );
}

export default RecentModules;
