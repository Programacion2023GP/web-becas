import { Fragment, createFactory, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { Button, ButtonGroup, IconButton, Tooltip, Typography } from "@mui/material";
import IconEdit from "../../../components/icons/IconEdit";
import IconDelete from "../../../components/icons/IconDelete";

import { useFamilyContext } from "../../../context/FamilyContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import sAlert, { QuestionAlertConfig } from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../context/GlobalContext";
import DataTableComponent from "../../../components/DataTableComponent";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { IconCircleXFilled } from "@tabler/icons-react";
import { formatCurrency, formatDatetime } from "../../../utils/Formats";
import { useAuthContext } from "../../../context/AuthContext";
import SwitchIOSComponent from "../../../components/SwitchIOSComponent";
import { useParams } from "react-router-dom";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "@mui/icons-material";
import { useRequestBecaContext } from "../../../context/RequestBecaContext";

export let monthlyIncome = 0;

const FamilyDT = ({ becaId, setFieldValue, values }) => {
   let { folio, pagina = 0 } = useParams();

   const { auth } = useAuthContext();
   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const {
      singularName,
      family,
      families,
      setFamilies,
      getIndexByFolio,
      createFamily,
      updateFamily,
      deleteFamily,
      DisEnableFamily,
      resetFormData,
      resetFamily,
      setTextBtnSumbit,
      setFormTitle
      // setMonthlyIncome
   } = useFamilyContext();
   const globalFilterFields = ["relationship", "age", "occupation", "monthly_income", "active", "created_at"];

   // #region BodysTemplate
   const RelationshipBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.relationship ? obj.relationship.toUpperCase() : ""} </Typography>;
   const AgeBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.age}</Typography>;
   const OccupationBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.occupation}</Typography>;
   const MonthlyIcomeBodyTemplate = (obj) => <Typography textAlign={"center"}>{formatCurrency(obj.monthly_income, true, true)}</Typography>;
   // #endregion BodysTemplate

   // #region BodysTemplateEditor
   const textEditor = (options) => <InputText type="text" value={options.value ? options.value : ""} onChange={(e) => options.editorCallback(e.target.value)} />;

   const textMayusEditor = (options) => (
      <InputText type="text" value={options.value ? options.value : ""} onChange={(e) => options.editorCallback(e.target.value.toUpperCase())} />
   );

   const numberEditor = (options) => <InputText type="number" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;

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

   const priceEditor = (options) => (
      <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="currency" currency="MXN" locale="es-MX" />
   );

   // const addRow = () => {
   //    console.log("addRow - data", data);
   //    const newRow = {
   //       id: data.length + 1,
   //       beca_id: 1,
   //       relationship: "",
   //       age: 0,
   //       occupation: "",
   //       monthly_income: 0,
   //       actions: "asa"
   //       // finished: false
   //    };

   //    let _data = [...data];
   //    console.log("_data", _data);
   //    // let { newData, index } = e;

   //    // _data[index] = newData;
   //    _data.push(newRow);

   //    setFamilies(_data);

   //    // setData(newRow);
   //    console.log(data);
   // };
   // const onRowEditCompleteContinue = async (newData) => {
   //    delete newData.actions;
   //    console.log("onRowEditCompleteContinue -> newData", newData);
   //    const ajaxResponse = await updateFamily(newData);
   //    console.log(ajaxResponse);
   //    // console.log(e);
   //    // let _products = [...data];
   //    // let { newData, index } = e;
   //    // _products[index] = newData;
   //    // setData(_products);
   // };
   // #endregion BodysTemplateEditor

   const columns = [
      { field: "relationship", header: "Parentesco", sortable: true, functionEdit: textMayusEditor, body: RelationshipBodyTemplate, filterField: null },
      { field: "age", header: "Edad (años)", sortable: true, functionEdit: numberEditor, body: AgeBodyTemplate, filterField: null },
      { field: "occupation", header: "Ocupación", sortable: true, functionEdit: textMayusEditor, body: OccupationBodyTemplate, filterField: null },
      { field: "monthly_income", header: "Ingresos Mensuales", sortable: true, functionEdit: priceEditor, body: MonthlyIcomeBodyTemplate, filterField: null }
   ];

   const mySwal = withReactContent(Swal);

   const handleClickAdd = () => {
      try {
         // resetFamily();
         resetFormData();
         setOpenDialog(true);
         setTextBtnSumbit("AGREGAR");
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickEdit = async (id) => {
      try {
         setLoadingAction(true);
         setTextBtnSumbit("GUARDAR");
         setFormTitle(`EDITAR ${singularName.toUpperCase()}`);
         await showFamily(id);
         setOpenDialog(true);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDeleteMultipleContinue = async (selectedData) => {
      try {
         let ids = selectedData.map((d) => d.id);
         if (ids.length < 1) console.log("no hay registros");
         let msg = `¿Estas seguro de eliminar `;
         if (selectedData.length === 1) msg += `al familiar registrado como tu ${selectedData[0].relationship}?`;
         else if (selectedData.length > 1) msg += `a los familiares registrados como tu ${selectedData.map((d) => d.relationship)}?`;
         mySwal.fire(QuestionAlertConfig(msg)).then(async (result) => {
            if (result.isConfirmed) {
               setLoadingAction(true);
               const axiosResponse = await deleteFamily(ids, folio);
               setLoadingAction(false);
               Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
            }
         });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const ButtonsAction = ({ id, name, active }) => {
      return (
         <ButtonGroup variant="outlined">
            <Tooltip title={`Editar ${singularName}`} placement="top">
               <IconButton color="info" onClick={() => handleClickEdit(id)}>
                  <IconEdit />
               </IconButton>
            </Tooltip>
            <Tooltip title={`Eliminar ${singularName}`} placement="top">
               <IconButton color="error" onClick={() => handleClickDelete(id, name)}>
                  <IconDelete />
               </IconButton>
            </Tooltip>
         </ButtonGroup>
      );
   };

   const data = [];
   const formatData = async () => {
      try {
         // console.log("cargar listado", families);
         families.sort((a, b) => a.id - b.id);
         monthlyIncome = 0;

         await families.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            // register.actions = <ButtonsAction id={obj.id} name={obj.family} active={obj.active} />;
            data.push(register);

            monthlyIncome += Number(obj.monthly_income);
         });
         // console.log("monthlyIncome", monthlyIncome);
         // console.log("values", values.monthly_income);
         if (values.monthly_income != monthlyIncome + Number(values.extra_income)) {
            monthlyIncome += Number(values.extra_income);
            setFieldValue("monthly_income", monthlyIncome);
         }
         // if (data.length > 0) setGlobalFilterFields(Object.keys(families[0]));
         // console.log("la data del formatData", globalFilterFields);
         setLoading(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };
   formatData();

   const newRow = {
      key: 0,
      beca_id: becaId,
      relationship: "",
      age: "",
      occupation: "",
      monthly_income: ""
   };

   useEffect(() => {
      getIndexByFolio(folio);
      setLoading(false);
   }, []);

   return (
      <DataTableComponent
         idName="dtFamilies"
         columns={columns}
         data={data}
         setData={setFamilies}
         globalFilterFields={globalFilterFields}
         headerFilters={false}
         handleClickAdd={handleClickAdd}
         rowEdit={true}
         // onRowEditCompleteContinue={onRowEditCompleteContinue}
         createData={createFamily}
         updateData={updateFamily}
         btnAdd={true}
         newRow={newRow}
         btnDeleteMultiple={true}
         handleClickDeleteMultipleContinue={handleClickDeleteMultipleContinue}
         refreshTable={(e) => getIndexByFolio(folio)}
         btnsExport={false}
      />
   );
};
export default FamilyDT;
