import { Card } from '@mui/material';
import ViewsTable from './ViewsTable';
import { subDays } from 'date-fns';

function ViewsData() {

  const tableData = [
  ];

  return (
    <Card>
      <ViewsTable tableData={tableData} />
    </Card>
  );
}

export default ViewsData;
