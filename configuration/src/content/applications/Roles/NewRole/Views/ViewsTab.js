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
import ViewsTable from './ViewsTable';
import myAxios from 'src/utils/axios';
import { useAuthHeader } from 'react-auth-kit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SimpleDialog({onClose, open, GetRole, role, views}) {
  const [allViews, setAllViews] = useState([]);
  const GetViews = async () => {
    try {
      let res = await myAxios('configuration').get(`Views?filterModuleId=${role.moduleId}`);
      if(res.status >= 200 && res.status < 300){
        const _allViews = res.data.map(r=> ({...r, id:r.viewId}));
        const _allViewsFiltered = _allViews.filter(v =>  !views.map(vw => vw.viewId).includes(v.viewId));
        setAllViews([..._allViewsFiltered]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(()=>{
    if(open)
      GetViews();
  },[open]);

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
              Add views
            </Typography>
            <Typography variant="subtitle2">
              Manage role views here
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <ToastContainer
        theme="colored"
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Divider />
      <DialogContent>
        <ViewsTable tableData={allViews} GetRole={GetRole} roleId={role.roleId} />
      </DialogContent>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  GetRole: PropTypes.func.isRequired,
  role: PropTypes.object.isRequired,
  views: PropTypes.array.isRequired
};

function ViewsTab({GetRole, views, role}) {
  const theme = useTheme();
  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
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
  const handleDeleteView = async (roleViewId) => {
    const _roleViewData = {
      idList: roleViewId
    }
    try {
      let res = await myAxios('configuration',auth()).put(`Roles/deleteRoleViews`, _roleViewData);

      if(res.status >= 200 && res.status < 300){
        notifySuccess("Has been saved successfully");
      }
      GetRole();
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
            title="Role's views"
            action={
              <Box sx={{pr: 1}}>
                <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={handleClickOpen}>Add views</Button>
              </Box>
            }
          />
          <SimpleDialog
            open={open}
            onClose={handleClose}
            GetRole={GetRole}
            role={role}
            views={views}
          />
          <Divider />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>View</TableCell>
                  <TableCell>Module</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {views.map((v) => (
                  <TableRow key={v.id} hover>
                    <TableCell>{v.path}</TableCell>
                    <TableCell>{v.module.description}</TableCell>
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
                          onClick={ev=>handleDeleteView([v.id])}
                        >
                          <DeleteTwoToneIcon fontSize="small" />
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

export default ViewsTab;
