import { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import logo_gpd from "/src/assets/images/logo-gpd.png";
import { width } from "@mui/system";
import { Typography } from "@mui/material";

const columns = [
   { id: "name", label: "Name", minWidth: 170 },
   { id: "code", label: "ISO\u00a0Code", minWidth: 100 },
   {
      id: "population",
      label: "Population",
      minWidth: 170,
      align: "right",
      format: (value) => value.toLocaleString("en-US")
   },
   {
      id: "size",
      label: "Size\u00a0(km\u00b2)",
      minWidth: 170,
      align: "right",
      format: (value) => value.toLocaleString("en-US")
   },
   {
      id: "density",
      label: "Density",
      minWidth: 170,
      align: "right",
      format: (value) => value.toFixed(2)
   }
];

function createData(name, code, population, size) {
   const density = population / size;
   return { name, code, population, size, density };
}

const rows = [
   createData("India", "IN", 1324171354, 3287263),
   createData("China", "CN", 1403500365, 9596961),
   createData("Italy", "IT", 60483973, 301340),
   createData("United States", "US", 327167434, 9833520),
   createData("Canada", "CA", 37602103, 9984670),
   createData("Australia", "AU", 25475400, 7692024),
   createData("Germany", "DE", 83019200, 357578),
   createData("Ireland", "IE", 4857000, 70273),
   createData("Mexico", "MX", 126577691, 1972550),
   createData("Japan", "JP", 126317000, 377973),
   createData("France", "FR", 67022000, 640679),
   createData("United Kingdom", "GB", 67545757, 242495),
   createData("Russia", "RU", 146793744, 17098246),
   createData("Nigeria", "NG", 200962417, 923768),
   createData("Brazil", "BR", 210147125, 8515767)
];

export default function SimpleTableComponent() {
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);

   const handleChangePage = (event, newPage) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
   };

   return (
      <Paper id="reportPaper" sx={{ width: "100%", overflow: "hidden" }}>
         <Table stickyHeader aria-label="sticky table">
            <TableHead>
               <TableRow sx={{ border: "none" }}>
                  <TableCell align={"left"}>
                     <img src={logo_gpd} style={{ width: 150 }} />
                  </TableCell>
                  <TableCell align={"center"}>
                     <img src={logo_gpd} style={{ width: 150 }} />
                  </TableCell>
                  <TableCell align={"right"}>
                     <img src={logo_gpd} style={{ width: 150 }} />
                  </TableCell>
               </TableRow>
               <TableRow>
                  <TableCell colSpan={3} align={"center"}>
                     <Typography variant="h1">DIRECCIÓN DE EDUCACIÓN</Typography>
                     <Typography variant="h4">PROGRAMA DE BECAS MUNICIPALES</Typography>
                     <Typography variant="p">ESTUDIO-SOCIOECONOMICO</Typography>
                  </TableCell>
               </TableRow>
               <TableRow>
                  <TableCell colSpan={3} align={"center"}>
                     <Typography variant="p" align="justify" mb={2} sx={{ fontWeight: "normal", maxWidth: "70%" }}>
                        El presente cuestionario tiene por objetivo conocer el perfil de los aspirantes a obtener una beca del <b>R. Ayuntamiento de Gómez Palacio</b>.
                        La información proporcionada de aqui debe ser completamente verdadera, por ello, lee con atención cada pregunta y contesta adecuadamente.
                     </Typography>
                  </TableCell>
               </TableRow>
            </TableHead>
         </Table>
         <TableContainer sx={{ maxHeight: 550 }}>
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
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                           {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                 <TableCell key={column.id} align={column.align}>
                                    {column.format && typeof value === "number" ? column.format(value) : value}
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
   );
}
