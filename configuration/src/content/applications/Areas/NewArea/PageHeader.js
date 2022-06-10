import { Typography } from '@mui/material';

function PageHeader() {
  const user =
  {
    name: 'Catherine Pike',
    avatar: '/static/images/avatars/1.jpg'
  };

  return (
    <>
      <Typography variant="h3" component="h3" gutterBottom>
        Area Settings
      </Typography>
    </>
  );
}

export default PageHeader;
