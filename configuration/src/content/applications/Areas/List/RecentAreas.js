import { Card } from '@mui/material';
import RecentAreasTable from './RecentAreasTable';
import { useState, useEffect } from 'react';
import myAxios from 'src/utils/axios';

function RecentAreas() {
  const [areas, setAreas] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const GetAreas = async ()=>{
    try {
      let res = await myAxios('configuration').get('Areas');
      if(res.status >= 200 && res.status < 300){
        const datos = res.data.map(d=> ({...d, id: d.areaId}));
        setAreas([...datos]);
      }
      return res.data
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(()=>{
    if(refresh){
      GetAreas();
      setRefresh(false);
    }
  },[refresh]);

  return (
    <Card>
      <RecentAreasTable tableData={areas} setRefreshAreas={setRefresh} />
    </Card>
  );
}

export default RecentAreas;
