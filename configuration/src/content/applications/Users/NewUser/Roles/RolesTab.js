import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  TableRow,
  Card,
  Grid,
  TableHead,
  Table,
  TableContainer,
  Divider,
  CardHeader,
  TableCell,
  TableBody,
  Tooltip,
  IconButton,
  useTheme,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  InputBase,
  Checkbox
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { format, subHours, subWeeks, subDays } from 'date-fns';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { alpha, styled } from '@mui/material/styles';
import BulkActions from './BulkActions';
import RolesTable from './RolesTable';
import myAxios from 'src/utils/axios';
import { useAuthHeader } from 'react-auth-kit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SimpleDialog({onClose, open, GetUser, userId, roles}) {
  const [allRoles, setAllRoles] = useState([]);
  const GetRoles = async () => {
    try {
      let res = await myAxios('configuration').get(`Roles/AvailableToUser?userId=${userId}`);
      if(res.status >= 200 && res.status < 300){
        const _allRoles = res.data.map(r=> ({...r, id:r.roleId, roleViews: [...r.roleViews.map(rv => rv.view)]}));
        const _allRolesFiltered = _allRoles.filter(r =>  !roles.map(ur => ur.roleId).includes(r.roleId));
        setAllRoles([..._allRolesFiltered]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(()=>{
    if(open)
      GetRoles();
  },[open])

  return (
    <Dialog onClose={onClose} open={open} maxWidth="lg" fullWidth={true}>
      <DialogTitle>
        <Box
          p={1}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              Add roles
            </Typography>
            <Typography variant="subtitle2">
              Manage user roles here (Only one role can be added for each module)
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <RolesTable tableData={allRoles} GetUser={GetUser} userId={userId} close={onClose} />
      </DialogContent>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  GetUser: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  roles: PropTypes.array.isRequired
};

function RolesTab({roles, GetUser, userId}) {
  const theme = useTheme();
  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const _roles = roles.map(r => ({...r, roleViews: [...r.roleViews.map(rv => rv.view)]}));
  const auth = useAuthHeader();
  const notifySuccess = (msj) => toast.success(msj);

  const handleClose = () => {
    setOpen(false);
  };
  const handleChangePage = (
    event,
    newPage
  ) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleClickOpen = ()=>{
    setOpen(true);
  }
  const handleDeleteRole = async (userRoleId) => {
    const _userRoleData = {
      idList: userRoleId
    }
    try {
      let res = await myAxios('configuration',auth()).post(`Users/deleteUserRoles`, _userRoleData);

      if(res.status >= 200 && res.status < 300){
        notifySuccess("Has been saved successfully");
      }
      GetUser();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            subheaderTypographyProps={{}}
            titleTypographyProps={{}}
            title="User's roles"
            action={
              <Box sx={{pr: 1}}>
                <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={handleClickOpen}>Add roles</Button>
              </Box>
            }
          />
          <SimpleDialog
            open={open}
            onClose={handleClose}
            GetUser={GetUser}
            userId={userId}
            roles={roles}
          />
          <Divider />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Role</TableCell>
                  <TableCell>View</TableCell>
                  <TableCell>Module</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_roles.map((role, indx) => (
                  <TableRow key={indx} hover>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>{role.roleViews.map(rv=>`[${rv.path}]`).join(', ')}</TableCell>
                    <TableCell>{role.module.description}</TableCell>
                    <TableCell align="right">
                      <Tooltip placement="top" title="Delete" arrow>
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: theme.colors.error.lighter
                            },
                            color: theme.palette.error.main
                          }}
                          color="inherit"
                          size="small"
                          onClick={ev=>handleDeleteRole([role.id])}
                        ><DeleteTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box p={2}>
            <TablePagination
              component="div"
              count={100}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}

export default RolesTab;
