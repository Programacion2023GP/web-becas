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
import { Button, ButtonGroup, Card, IconButton, Tooltip } from "@mui/material";
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
import { Toolbar } from "primereact/toolbar";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import * as XLSX from "xlsx";

/* COMO IMPROTAR
*    columns={columns}
         data={data}
         globalFilterFields={globalFilterFields}
         headerFilters={false}
         handleClickAdd={handleClickAdd}
         refreshTable={getUsers}
         btnAdd={true}
         showGridlines={false}
         btnsExport={true}
         rowEdit={false}
         // handleClickDeleteContinue={handleClickDeleteContinue}
         // ELIMINAR MULTIPLES REGISTROS
         btnDeleteMultiple={false}
         // handleClickDeleteMultipleContinue={handleClickDeleteMultipleContinue}
         // PARA HACER FORMULARIO EN LA TABLA
         // AGREGAR
         // createData={createUser}
         // newRow={newRow}
         // EDITAR
         // setData={setUsers}
         // updateData={updateUser}
      />
*/

/* const newRow = {
      key: 0,
      beca_id: becaId,
      relationship: "",
      age: "",
      occupation: "",
      monthly_income: ""
   }; */
/* FUNCIONES DE COMPLEMENTO
*  FUNCION PARA ELIMINAR MULTIPLES REGISTROS
   const handleClickDeleteContinue = async (selectedData) => {
      try {
         let ids = selectedData.map((d) => d.id);
         if (ids.length < 1) console.log("no hay registros");
         let msg = `¿Estas seguro de eliminar `;
         if (selectedData.length === 1) msg += `al familiar registrado como tu ${selectedData[0].relationship}?`;
         else if (selectedData.length > 1) msg += `a los familiares registrados como tu ${selectedData.map((d) => d.relationship)}?`;
         mySwal.fire(QuestionAlertConfig(msg)).then(async (result) => {
            if (result.isConfirmed) {
               setLoadingAction(true);
               const axiosResponse = await deleteFamily(ids);
               setLoadingAction(false);
               Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
            }
         });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };
*/
export default function DataTableComponent({
   idName = "table",
   columns,
   globalFilterFields,
   data,
   setData,
   headerFilters = true,
   rowEdit = false,
   handleClickAdd,
   createData,
   onRowEditCompleteContinue = null,
   toolBar = false,
   positionBtnsToolbar = "start",
   toolbarContent,
   updateData,
   refreshTable,
   btnAdd = true,
   newRow = null,
   btnsExport = true,
   showGridlines = false,
   btnDeleteMultiple = false,
   handleClickDeleteMultipleContinue
}) {
   const { setLoadingAction, setOpenDialog } = useGlobalContext();
   const [selectedData, setSelectedData] = useState(null);
   const [updating, setUpdating] = useState(false);

   const dt = useRef(null);
   // columns.unshift({ id: 0, label: "Selecciona una opción..." });

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
      // console.log(data);
      // console.log("newRow", newRow);

      let _data = [...data];
      // console.log("_data", _data);
      // // let { newData, index } = e;

      // // _data[index] = newData;
      _data.unshift(newRow);

      setData(_data);

      setTimeout(() => {
         document.querySelector(`#${idName} tbody`).childNodes[0].querySelector("button").click();
      }, 100); // // setData(newRow);
      // console.log(data);
   };

   const handleOnRowEditIinit = (e) => {
      setUpdating(true);
      const firtsColumn = e.originalEvent.target.closest("tr").childNodes[1];
      firtsColumn.querySelector(".p-inputtext");
   };
   const handleOnRowEditCancel = (e) => {
      setUpdating(false);
      const dataSelected = e.data;
      if (dataSelected.relationship == "" && dataSelected.age == "" && dataSelected.occupation == "" && dataSelected.monthly_income == null) {
         let _data = data.filter((val) => val.id !== dataSelected.id);
         setData(_data);
      }
   };

   const onRowEditComplete = async (e) => {
      try {
         // console.log(e);
         // console.log(data);
         let _data = [...data];
         let { newData, index } = e;

         _data[index] = newData;

         setData(_data);
         // onRowEditCompleteContinue(newData);
         const newNewData = newData;
         delete newNewData.actions;
         let ajaxResponse;
         if (newNewData.id > 0) ajaxResponse = await updateData(newNewData);
         else ajaxResponse = await createData(newNewData);
         Toast.Customizable(ajaxResponse.alert_text, ajaxResponse.alert_icon);
         setUpdating(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
         setUpdating(false);
      }
   };

   // const textEditor = (options) => {
   //    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
   // };

   // const statusEditor = (options) => {
   //    return (
   //       <Dropdown
   //          value={options.value}
   //          options={statuses}
   //          onChange={(e) => options.editorCallback(e.value)}
   //          placeholder="Select a Status"
   //          itemTemplate={(option) => {
   //             return <Tag value={option} severity={getSeverity(option)}></Tag>;
   //          }}
   //       />
   //    );
   // };

   // const priceEditor = (options) => {
   //    return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="currency" currency="USD" locale="en-US" />;
   // };

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
      if (data.length === 0) {
         Toast.Info("No hay datos para exportar.");
         return;
      }

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Hoja 1");
      XLSX.writeFile(workbook, "datos.xlsx");
      // import("xlsx").then((xlsx) => {
      //    const worksheet = xlsx.utils.json_to_sheet(data);
      //    const workbook = { Sheets: { data: worksheet }, SheetNames: ["Hoja 1"] };
      //    const excelBuffer = xlsx.write(workbook, {
      //       bookType: "xlsx",
      //       type: "array"
      //    });

      //    saveAsExcelFile(excelBuffer, "data");
      // });
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
         Toast.Success("Tabla Actualizada");
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };
   const confirmDeleteSelected = () => {
      setDeleteDataDialog(true);
   };
   const leftToolbarTemplate = () => {
      return (
         <div className="flex flex-wrap gap-2">
            {/* <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} /> */}
            <Button
               variant="contained"
               color="error"
               startIcon={<IconDelete />}
               onClick={confirmDeleteSelected} /* disabled={!selectedData || !selectedData.length} */
            >
               Eliminar Seleccionados
            </Button>
         </div>
      );
   };

   const handleClickDeleteMultiple = async () => {
      // console.log(selectedData);
      await handleClickDeleteMultipleContinue(selectedData);
      setSelectedData([]);
   };

   const header = (
      <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between", alignItems: "center" }}>
         {btnDeleteMultiple && (
            <Tooltip title="Eliminar Seleccionados" placement="top">
               <span>
                  <IconButton
                     type="button"
                     variant="text"
                     color="error"
                     onClick={handleClickDeleteMultiple}
                     disabled={!selectedData || !selectedData.length}
                     sx={{ borderRadius: "12px", mr: 1 }}
                  >
                     <i className="pi pi-trash"></i>
                  </IconButton>
               </span>
            </Tooltip>
         )}

         {btnsExport && (
            <>
               <Tooltip title="Exportar a Excel" placement="top">
                  <IconButton type="button" variant="text" color="success" sx={{ borderRadius: "12px", mr: 1 }} onClick={exportExcel}>
                     <IconFileSpreadsheet />
                  </IconButton>
               </Tooltip>

               <Tooltip title="Exportar a PDF" placement="top">
                  <IconButton type="button" variant="text" color="error" sx={{ borderRadius: "12px", mr: 1 }} onClick={exportPdf}>
                     <PictureAsPdfIcon />
                  </IconButton>
               </Tooltip>
            </>
         )}

         <Tooltip title="Refrescar Tabla" placement="top">
            <IconButton type="button" variant="text" color="primary" sx={{ borderRadius: "12px", mr: 1 }} onClick={handleClickRefresh}>
               <i className="pi pi-refresh"></i>
            </IconButton>
         </Tooltip>
         <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText value={globalFilterValue} type="search" onChange={onGlobalFilterChange} placeholder="Buscador General" />
         </span>
         {btnAdd && (
            <Button
               variant="contained"
               sx={{ width: 250 }}
               startIcon={<AddCircleOutlineOutlined sx={{ mr: 0.2 }} />}
               size="large"
               disabled={updating}
               onClick={() => (rowEdit ? addRow() : handleClickAdd())}
            >
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
            {toolBar && (
               <Toolbar
                  className="mb-4"
                  start={positionBtnsToolbar == "start" && toolbarContent}
                  center={positionBtnsToolbar == "center" && toolbarContent}
                  end={positionBtnsToolbar == "end" && toolbarContent}
                  style={{ marginBottom: "1px", paddingBlock: "10px" }}
               ></Toolbar>
            )}

            <DataTable
               id={idName}
               name={idName}
               ref={dt}
               style={{ borderRadius: "20px" }}
               stripedRows
               // rowHover
               showGridlines={showGridlines}
               removableSort
               size="small"
               value={data}
               editMode="row"
               header={header}
               dataKey="key"
               paginator
               rowsPerPageOptions={[5, 10, 50, 100, 1000]}
               rows={10}
               loading={loading}
               filters={filters}
               scrollable={true}
               scrollHeight="63vh"
               globalFilter={globalFilterValue}
               globalFilterFields={globalFilterFields}
               filterDisplay={headerFilters ? "row" : "menu"}
               tableStyle={{ minWidth: "5rem" }}
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
               emptyMessage="No se encontraron registros."
               currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} registros"
               selection={selectedData}
               onSelectionChange={(e) => setSelectedData(e.value)}
               onRowEditComplete={onRowEditComplete}
               onRowEditInit={handleOnRowEditIinit}
               onRowEditCancel={handleOnRowEditCancel}
            >
               {btnDeleteMultiple && <Column selectionMode="multiple" exportable={false}></Column>}
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
