import { Card } from '@mui/material';
import RolesTable from './RolesTable';
import { subDays } from 'date-fns';

function RolesData() {

  const tableData = [
  ];

  return (
    <Card>
      <RolesTable tableData={tableData} />
    </Card>
  );
}

export default RolesData;
