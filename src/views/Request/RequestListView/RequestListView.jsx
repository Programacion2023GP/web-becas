import { Fragment, useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../../../context/GlobalContext";
import { Box } from "@mui/system";
import {
   Button,
   ButtonGroup,
   Divider,
   FormControl,
   FormControlLabel,
   FormHelperText,
   FormLabel,
   Radio,
   RadioGroup,
   Step,
   StepLabel,
   Stepper,
   TextField,
   Tooltip,
   Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Formik } from "formik";
import * as Yup from "yup";

import { useRequestBecaContext } from "../../../context/RequestBecaContext";
import { IconEdit, IconEye, IconInfoCircle, IconPrinter } from "@tabler/icons";
import { useStudentContext } from "../../../context/StudentContext";
import Toast from "../../../utils/Toast";
import sAlert from "../../../utils/sAlert";
import IconSended from "../../../components/icons/IconSended";
import Select2Component from "../../../components/Form/Select2Component";
import InputsCommunityComponent, { getCommunity } from "../../../components/Form/InputsCommunityComponent";
import { formatDatetime, handleInputFormik } from "../../../utils/Formats";

import DatePickerComponent from "../../../components/Form/DatePickerComponent";
import { useDisabilityContext } from "../../../context/DisabilityContext";
import { useSchoolContext } from "../../../context/SchoolContext";
import { TableComponent } from "../../../components/Table/TableComponent";
import { any } from "prop-types";
import IconDelete from "../../../components/icons/IconDelete";
import DataTableComponent from "../../../components/DataTableComponent";
import RequestBecaDT from "./RequestDT";

const RequestListView = () => {
   const {
      setLoading,
      setLoadingAction,
      setDisabledState,
      setDisabledCity,
      setDisabledColony,
      setShowLoading,
      setDataStates,
      setDataCities,
      setDataColonies,
      setDataColoniesComplete
   } = useGlobalContext();

   const {
      singularName,
      formData,
      setFormData,
      requestBecas,
      getRequestBecas,
      setRequestBecas,
      getRequestBecasByuser,
      resetFormData,
      createRequestBeca,
      updateRequestBeca
   } = useRequestBecaContext();
   const [data, setData] = useState([]);
   const [dataUpload, setDataUpload] = useState(false);

   // const rows = [];
   // const createRow = async () => {
   //    await requestBecas.map((obj) => {
   //       const row = obj;
   //       row.created_at = formatDatetime(obj.created_at, true);
   //       row.actions = <ButtonsAction id={obj.id} folio={obj.folio} />;
   //       rows.push(row);
   //    });
   //    setData(rows);
   //    setDataUpload(true);
   //    console.log("los rows", rows);
   //    // return { id, folio, school, student, average };
   // };
   // createRow();

   useEffect(() => {
      getRequestBecas();
      setLoading(false);
      // console.log("useEffect - formData", requestBecas);
   }, []);

   return (
      <Box sx={{ width: "100%", height: "100%" }}>
         <Typography variant="h1" color={"#364152"} mb={2} textAlign={"center"}>
            {"LISTADO DE SOLICITUDES".toUpperCase()}
         </Typography>
         <RequestBecaDT />
      </Box>
   );
};

export default RequestListView;
