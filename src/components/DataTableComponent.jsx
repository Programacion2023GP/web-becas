import React, { useEffect, useRef, useState } from "react";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import { Button as Btn } from "primereact/button";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { Button, ButtonGroup, Card, Tooltip } from "@mui/material";
import { IconEdit, IconFile, IconFileSpreadsheet, IconSearch } from "@tabler/icons";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Box } from "@mui/system";
import { AddCircleOutlineOutlined } from "@mui/icons-material";

import { useGlobalContext } from "../context/GlobalContext";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Toast from "../utils/Toast";
import { QuestionAlertConfig } from "../utils/sAlert";
import IconDelete from "./icons/IconDelete";

export default function DataTableComponent({ columns, globalFilterFields, data, setData, headerFilters = true, rowEdit = false, handleClickAdd, refreshTable }) {
   const { setLoadingAction, setOpenDialog } = useGlobalContext();

   const dt = useRef(null);

   // FILTROS
   let filtersColumns = columns.map((c) => [c.field, { value: null, matchMode: FilterMatchMode.STARTS_WITH }]);
   filtersColumns = Object.fromEntries(filtersColumns);
   filtersColumns.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
   const [filters, setFilters] = useState(filtersColumns);
   const [loading, setLoading] = useState(false);
   const [globalFilterValue, setGlobalFilterValue] = useState("");
   // FILTROS

   const getSeverity = (value) => {
      switch (value) {
         case "INSTOCK":
            return "success";

         case "LOWSTOCK":
            return "warning";

         case "OUTOFSTOCK":
            return "danger";

         default:
            return null;
      }
   };

   const addRow = () => {
      console.log(data);
      const newProducts = {
         // id: cont++,
         code: "",
         name: "",
         description: "",
         image: "",
         price: "",
         category: "",
         quantity: "",
         inventoryStatus: "",
         rating: ""
      };

      let _products = [...data];
      console.log("_products", _products);
      // let { newData, index } = e;

      // _products[index] = newData;
      _products.push(newProducts);

      setData(_products);

      // setData(newProducts);
      console.log(data);
   };

   const onRowEditComplete = (e) => {
      console.log(e);
      let _products = [...data];
      let { newData, index } = e;

      _products[index] = newData;

      setData(_products);
   };

   const textEditor = (options) => {
      return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
   };

   const statusEditor = (options) => {
      return (
         <Dropdown
            value={options.value}
            options={statuses}
            onChange={(e) => options.editorCallback(e.value)}
            placeholder="Select a Status"
            itemTemplate={(option) => {
               return <Tag value={option} severity={getSeverity(option)}></Tag>;
            }}
         />
      );
   };

   const priceEditor = (options) => {
      return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="currency" currency="USD" locale="en-US" />;
   };

   //#region EXPORTAR
   const exportColumns = columns.map((col) => {
      if (col.field !== "actions") return { title: col.header, dataKey: col.field };
   });

   const exportCSV = (selectionOnly) => {
      dt.current.exportCSV({ selectionOnly });
   };

   const exportPdf = async () => {
      import("jspdf").then((jsPDF) => {
         import("jspdf-autotable").then(() => {
            const doc = new jsPDF.default(0, 0);

            doc.autoTable(exportColumns, data);
            doc.save("data.pdf");
         });
      });
   };

   const exportExcel = () => {
      import("xlsx").then((xlsx) => {
         const worksheet = xlsx.utils.json_to_sheet(data);
         const workbook = { Sheets: { data: worksheet }, SheetNames: ["Hoja 1"] };
         const excelBuffer = xlsx.write(workbook, {
            bookType: "xlsx",
            type: "array"
         });

         saveAsExcelFile(excelBuffer, "data");
      });
   };

   const saveAsExcelFile = (buffer, fileName) => {
      import("file-saver").then((module) => {
         if (module && module.default) {
            let EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
            let EXCEL_EXTENSION = ".xlsx";
            const data = new Blob([buffer], {
               type: EXCEL_TYPE
            });

            module.default.saveAs(data, fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION);
         }
      });
   };
   //#endregion EXPORTAR

   const onGlobalFilterChange = (e) => {
      try {
         let value = e.target.value;
         // console.log("buscador", value);
         if (value === undefined || value === null) value = "";
         let _filters = { ...filters };

         _filters["global"].value = value;

         setFilters(_filters);
         setGlobalFilterValue(value);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickRefresh = async () => {
      try {
         setLoading(true);
         await refreshTable();
         setLoading(false);
         Toast.Info("Tabla Actualizada");
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const header = (
      <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between", alignItems: "center" }}>
         <Tooltip title="Exportar a Excel" placement="top">
            <Button type="button" variant="text" color="success" sx={{ borderRadius: "12px", mr: 1 }} onClick={exportExcel}>
               <IconFileSpreadsheet />
            </Button>
         </Tooltip>

         <Tooltip title="Exportar a PDF" placement="top">
            <Button type="button" variant="text" color="error" sx={{ borderRadius: "12px", mr: 1 }} onClick={exportPdf}>
               <PictureAsPdfIcon />
            </Button>
         </Tooltip>
         <Tooltip title="Refrescar Tabla" placement="top">
            <Button type="button" variant="text" sx={{ borderRadius: "12px", mr: 1 }} onClick={handleClickRefresh}>
               <i className="pi pi-refresh"></i>
            </Button>
         </Tooltip>
         <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText value={globalFilterValue} type="search" onChange={onGlobalFilterChange} placeholder="Buscador General" />
         </span>
         {rowEdit && (
            <Button variant="contained" fullWidth onClick={() => (rowEdit ? addRow() : handleClickAdd())}>
               <AddCircleOutlineOutlined sx={{ mr: 0.2 }} />
               AGREGAR
            </Button>
         )}
      </Box>
   );

   useEffect(() => {
      // if (data.length > 0) setGlobalFilterFields(Object.keys(data[0]));
   }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

   return (
      <div className="card p-fluid">
         {/* <Tooltip target=".export-buttons>button" position="bottom" /> */}
         <Card>
            <DataTable
               style={{ borderRadius: "20px" }}
               stripedRows
               removableSort
               size="small"
               value={data}
               editMode="row"
               header={header}
               dataKey="id"
               paginator
               rowsPerPageOptions={[5, 10, 50, 100, 1000]}
               rows={10}
               loading={loading}
               filters={filters}
               scrollable={true}
               scrollHeight="67vh"
               globalFilter={globalFilterValue}
               globalFilterFields={globalFilterFields}
               filterDisplay={headerFilters ? "row" : "menu"}
               onRowEditComplete={onRowEditComplete}
               tableStyle={{ minWidth: "50rem" }}
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
               emptyMessage="No se encontraron registros."
               currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} registros"
            >
               {columns.map((col, index) => (
                  <Column
                     key={index}
                     field={col.field}
                     header={col.header}
                     headerStyle={{ backgroundColor: "#E9ECEF", color: "#364152", textAlign: "center" }}
                     headerClassName="text-center"
                     filter={headerFilters}
                     filterField={col.filterField}
                     filterHeaderStyle={{ backgroundColor: "#E9ECEF", color: "#364152" }}
                     editor={(options) => col.functionEdit(options)}
                     sortable={col.sortable}
                     body={col.body}
                     style={{ width: "auto" }}
                     footerStyle={{ backgroundColor: "#E9ECEF", color: "#364152" }}
                  ></Column>
               ))}
               {rowEdit ? (
                  <Column
                     rowEditor
                     // headerStyle={{ width: "10%", minWidth: "8rem" }}
                     headerStyle={{ backgroundColor: "#E9ECEF", color: "#364152", textAlign: "center" }}
                     headerClassName="text-center"
                     filter={false}
                     filterHeaderStyle={{ backgroundColor: "#E9ECEF", color: "#364152" }}
                     bodyStyle={{ textAlign: "center" }}
                  ></Column>
               ) : (
                  <Column
                     key={"index"}
                     field={"actions"}
                     header={"Acciones"}
                     headerClassName="text-center"
                     headerStyle={{ backgroundColor: "#E9ECEF", color: "#364152" }}
                     filterHeaderStyle={{ backgroundColor: "#E9ECEF", color: "#364152" }}
                     // editor={(options) => col.functionEdit(options)}
                     // body={col.body}
                     sortable={false}
                     bodyStyle={{ textAlign: "center" }}
                     filter={false}
                     style={{ width: "auto" }}
                     footerStyle={{ backgroundColor: "#E9ECEF", color: "#364152" }}
                  ></Column>
               )}
            </DataTable>
         </Card>
      </div>
   );
}
