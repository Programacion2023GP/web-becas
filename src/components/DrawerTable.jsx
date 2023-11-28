import { Typography } from "@mui/material";
import { SwipeableDrawer } from "@mui/material";
import { useState } from "react";
import { Box } from "@mui/system";
import { useEffect } from "react";
import Toast from "../utils/Toast";
import { useGlobalContext } from "../context/GlobalContext";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

// const platesCurrent = (expired) => (expired ? "-" : <IconCircleCheckFilled style={{ color: "green" }} />);
// OPCIONAL

//    const columns = [
//       { id: "plates", label: "Placas", minWidth: 100, format: (value) => value.toUpperCase() },
//       { id: "initial_date", label: "Fecha de Plaqueo", minWidth: 100, align: "center", format: (value) => formatDatetime(value, false) },
//       { id: "due_date", label: "Fecha de Vencimiento", minWidth: 100, align: "center", format: (value) => formatDatetime(value, false) },
//       { id: "expired", label: "Vigente", minWidth: 50, align: "center", format: (value) => platesCurrent(value) }
//       // {
//       //    id: "density",
//       //    label: "Density",
//       //    minWidth: 170,
//       //    align: "right",
//       //    format: (value) => value.toFixed(2)
//       // }
//    ];
//    function createData(id, plates, initial_date, due_date, expired) {
//       return { id, plates, initial_date, due_date, expired };
//    }

// return <DrawerTable title={"REGISTRO DE PLAQUEO"} openDialog={openDialog} setOpenDialog={setOpenDialog} columns={columns} rows={vehiclePlates} />;

// ===========================================================================================
// ========================================== COMPONENTE =====================================
// ===========================================================================================

const DrawerTable = ({ title, openDialog, setOpenDialog, anchor, columns, rows }) => {
   const { setLoadingAction } = useGlobalContext();
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);

   const toggleDrawer = (open) => (event) => {
      try {
         if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return;
         }
         setOpenDialog(open);
      } catch (error) {
         console.log("Error en toggleDrawer:", error);
         Toast.Error(error);
      }
   };

   const handleChangePage = (event, newPage) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
   };

   useEffect(() => {
      try {
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, []);

   return (
      <SwipeableDrawer anchor={anchor || "right"} open={openDialog} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
         <Box role="presentation" p={3} pt={5} className="drawer-max-width">
            <Typography variant="h2" mb={3}>
               {title}
            </Typography>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
               <TableContainer sx={{ maxHeight: "50%" }}>
                  <Table stickyHeader aria-label="sticky table">
                     <TableHead>
                        <TableRow>
                           {columns.map((column) => (
                              <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                 {column.label}
                              </TableCell>
                           ))}
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                           return (
                              <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                 {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                       <TableCell key={column.id} align={column.align}>
                                          {column.format(value)}
                                          {/* {column.format && typeof value === "number" ? column.format(value) : value} */}
                                       </TableCell>
                                    );
                                 })}
                              </TableRow>
                           );
                        })}
                     </TableBody>
                  </Table>
               </TableContainer>
               <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
               />
            </Paper>
         </Box>
      </SwipeableDrawer>
   );
};
export default DrawerTable;
