import {
  Box,
  Button,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.success.main};
     color: ${theme.palette.success.contrastText};

     &:hover {
        background: ${theme.colors.success.dark};
     }
    `
);

function BulkActions({selected, handleBulkAddUserRoles}) {
  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Typography variant="h5" color="text.secondary">
            Bulk actions:
          </Typography>
          <ButtonError
            sx={{ ml: 1 }}
            startIcon={<AddCircleOutlineIcon />}
            variant="outlined"
            onClick={ev=>{handleBulkAddUserRoles(selected)}}
          >
            Add roles to user
          </ButtonError>
        </Box>
      </Box>
    </>
  );
}

export default BulkActions;
