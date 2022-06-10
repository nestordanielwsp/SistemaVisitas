import { FC, ChangeEvent, useState } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader
} from '@mui/material';
import { useNavigate } from 'react-router';
import Label from 'src/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import BulkActions from './BulkActions';
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import myAxios from 'src/utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const applyFilters = (tableData, filters) => {
  return tableData.filter((tbData) => {
    let matches = true;

    if (filters.status && (tbData.isEnabled ? 'active' : 'inactive') !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyFiltersBySearchTerm = (tableData, filters)=>{
  return tableData.filter((tbData)=>{
    let matches = true;
    let search = (filters.searchTerm && filters.searchTerm.toLowerCase());
    if (
      filters.searchTerm &&
        ((!`${tbData.description}`.toLowerCase().includes(search)))
      ){
        matches = false;
      }
    return matches;
  });
}

const applyPagination = (tableData, page, limit) => {
  return tableData.slice(page * limit, page * limit + limit);
};

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
    border: '1px solid #ced4da',
    fontSize: 16,
    //width: 'auto',
    padding: '10px 12px',
    paddingLeft:'45px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

const RecentAreasTable = ({ tableData, setRefreshAreas }) => {
  const [selectedTableData, setSelectedTableData] = useState([]);
  const selectedBulkActions = selectedTableData.length > 0;
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [filters, setFilters] = useState({
    status: null,
    searchTerm: null
  });
  const notifySuccess = (msj) => toast.success(msj);
  let navigate = useNavigate();

  const statusOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
      id: 'active',
      name: 'Active'
    },
    {
      id: 'inactive',
      name: 'Inactive'
    }
  ];

  const handleStatusChange = (e) => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value
    }));
  };
  const handleSearchTermChange = (e) => {
    let value = null;

    if (e.target.value.trim() !== '') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      searchTerm: value
    }));
  };
  const handleSelectAllTableData = (event) => {
    setSelectedTableData(
      event.target.checked
        ? tableData.map((tbData) => tbData.id)
        : []
    );
  };
  const handleSelectOneTableData = (event, tbDataId) => {
    if (!selectedTableData.includes(tbDataId)) {
      setSelectedTableData((prevSelected) => [
        ...prevSelected,
        tbDataId
      ]);
    } else {
      setSelectedTableData((prevSelected) =>
        prevSelected.filter((id) => id !== tbDataId)
      );
    }
  };
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };
  const handleClickSwitchEdit = (areaId) => {
    navigate(`/management/areas/list/${areaId}`, { replace: false});
  }
  const handleDisableAreas = async (areaIds) => {
    const _areaData = {
      idList: areaIds
    }
    try {
      let res = await myAxios('configuration').put(`Areas/bulkDisable`, _areaData);

      if(res.status >= 200 && res.status < 300){
        notifySuccess("Has been saved successfully");
      }
      setRefreshAreas(true);
    } catch (error) {
      console.error(error);
    }
    setSelectedTableData([]);
  }

  const filteredTableData = applyFilters(tableData, filters);
  const searchedTableData = applyFiltersBySearchTerm(filteredTableData, filters);
  const paginatedTableData = applyPagination(
    searchedTableData,
    page,
    limit
  );

  const selectedSomeTableData =
    selectedTableData.length > 0 &&
    selectedTableData.length < tableData.length;

  const selectedAllTableData =
    selectedTableData.length === tableData.length;
  const theme = useTheme();

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions selected={selectedTableData} handleDisableAreas={handleDisableAreas} />
        </Box>
      )}
      {!selectedBulkActions && (
        <CardHeader
          action={
            <Box width={150}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || 'all'}
                  onChange={handleStatusChange}
                  label="Status"
                  autoWidth
                >
                  {statusOptions.map((statusOption) => (
                    <MenuItem key={statusOption.id} value={statusOption.id}>
                      {statusOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }
          title={
            <Box component="div" sx={{width:300, display: 'flex', alignItems: 'center'}}>
              <SearchIcon sx={{position: "absolute", zIndex: 1, marginLeft: "10px"}} />
              <BootstrapInput sx={{width:"100%"}} placeholder="Search by area"
              onChange={handleSearchTermChange} />
            </Box>
          }
        />
      )}
      <Divider />
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
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllTableData}
                  indeterminate={selectedSomeTableData}
                  onChange={handleSelectAllTableData}
                />
              </TableCell>
              <TableCell>Folio</TableCell>
              <TableCell>Area</TableCell>
              <TableCell align="right">Is Enabled</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTableData.map((tbData) => {
              const isTableDataSelected = selectedTableData.includes(
                tbData.id
              );
              return (
                <TableRow
                  hover
                  key={tbData.id}
                  selected={isTableDataSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isTableDataSelected}
                      onChange={(event) =>
                        handleSelectOneTableData(event, tbData.id)
                      }
                      value={isTableDataSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {tbData.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {tbData.description}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {tbData.isEnabled ? <Label color="success">Active</Label> : <Label color="error">Inactive</Label>}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit Area" arrow>
                      <IconButton
                        sx={{
                          '&:hover': {
                            background: theme.colors.primary.lighter
                          },
                          color: theme.palette.primary.main
                        }}
                        color="inherit"
                        size="small"
                        onClick={ev=>{handleClickSwitchEdit(tbData.id)}}
                      >
                        <EditTwoToneIcon fontSize="small"  />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Area" arrow>
                      <IconButton
                        sx={{
                          '&:hover': { background: theme.colors.error.lighter },
                          color: theme.palette.error.main
                        }}
                        color="inherit"
                        size="small"
                        onClick={ev=>{handleDisableAreas([tbData.id])}}
                      >
                        <DeleteTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={searchedTableData.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

RecentAreasTable.propTypes = {
  tableData: PropTypes.array.isRequired
};

RecentAreasTable.defaultProps = {
  tableData: []
};

export default RecentAreasTable;
