import { Card } from '@mui/material';
import RecentViewsTable from './RecentViewsTable';
import myAxios from 'src/utils/axios';
import { useState, useEffect } from 'react';

function RecentViews() {
  const [views, setViews] = useState([]);
  const [refresh, setRefresh] = useState(true);

  const GetViews = async ()=>{
    try {
      let res = await myAxios('configuration').get('Views');
      if(res.status >= 200 && res.status < 300){
        const datos = res.data.map(d=> ({...d,id: d.viewId}));
        setViews([...datos]);
      }
      return res.data
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(()=>{
    if(refresh){
      GetViews();
      setRefresh(false);
    }
  },[refresh]);

  return (
    <Card>
      <RecentViewsTable tableData={views} setRefreshViews={setRefresh} />
    </Card>
  );
}

export default RecentViews;
