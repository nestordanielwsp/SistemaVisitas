import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Divider,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Typography,
  CardHeader
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BulkActions from './BulkActions';
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import myAxios from 'src/utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthHeader } from 'react-auth-kit';

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
const applyPagination = (tableData, page, limit) => {
  return tableData.slice(page * limit, page * limit + limit);
};
const applyFiltersBySearchTerm = (tableData, filters) => {
  return tableData.filter((tbData)=>{
    let matches = true;
    let search = (filters.searchTerm && filters.searchTerm.toLowerCase());
    if (
      filters.searchTerm &&
        ((!`${tbData.view}`.toLowerCase().includes(search)) &&
        (!`${tbData.module}`.toLowerCase().includes(search)))
      ){
        matches = false;
      }
    return matches;
  });
}

const ViewsTable = ({ tableData, GetRole, roleId }) => {
  const [selectedTableData, setSelectedTableData] = useState([]);
  const [filters, setFilters] = useState({ searchTerm: null });
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const notifySuccess = (msj) => toast.success(msj);
  const auth = useAuthHeader();
  const selectedBulkActions = (selectedTableData.length > 0);
  const selectedAllTableData = (selectedTableData.length === tableData.length);
  const selectedSomeTableData = (
    selectedTableData.length > 0 &&
    selectedTableData.length < tableData.length
  );
  const searchedTableData = applyFiltersBySearchTerm(tableData, filters);
  const paginatedTableData = applyPagination(
    searchedTableData,
    page,
    limit
  );

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
  const handleSelectAllTableData = (event) => {
    setSelectedTableData(
      event.target.checked
        ? tableData.map((tbData) => tbData.id)
        : []
    );
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
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };
  const handleBulkAddRoleViews = async (viewIds) => {
    const _roleViewsData = {
      roleViews: viewIds.map(v=>({
        viewId: v,
        roleId: roleId,
        createdBy: 1
      }))
    }
    try {
      let res = await myAxios('configuration',auth()).post(`Roles/bulkRoleView`, _roleViewsData);

      if(res.status >= 200 && res.status < 300){
        notifySuccess("Has been saved successfully");
      }
      await GetRole();
    } catch (error) {
      console.error(error);
    }
    setSelectedTableData([]);
  };

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions selected={selectedTableData} handleBulkAddRoleViews={handleBulkAddRoleViews} />
        </Box>
      )}
      {!selectedBulkActions && (
        <CardHeader
          title={
            <Box component="div" sx={{width:300, display: 'flex', alignItems: 'center'}}>
              <SearchIcon sx={{position: "absolute", zIndex: 1, marginLeft: "10px"}} />
              <BootstrapInput sx={{width:"100%"}} placeholder="Search here"
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
              <TableCell>Module</TableCell>
              <TableCell>View</TableCell>
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
                      {tbData.module.description}
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
                      {tbData.path}
                    </Typography>
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

ViewsTable.propTypes = {
  tableData: PropTypes.array.isRequired
};

ViewsTable.defaultProps = {
  tableData: []
};

export default ViewsTable;
