// material-ui
// import Grid from "@mui/material/Grid"; // Grid version 1

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
// import Grid from '@mui/material/Unstable_Grid2';

// project imports
import MainCard from "../../../ui-component/cards/MainCard";
import PerimeterTable from "../../../components/perimeters/PerimeterTable";
import PerimeterForm from "../../../components/perimeters/PerimeterForm";

import { CorrectRes, ErrorRes } from "../../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../../context/AuthContext";
// import Backdrop from "../../components/BackDrop";

import { useEffect, useState } from "react";
import { usePerimeterContext } from "../../../context/PerimeterContext";
import { Button } from "@mui/material";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import sAlert from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";

const PerimetersView = () => {
   // const { result } = useLoaderData();
   const { setLoading, setLoadingAction } = useGlobalContext();
   const { getPerimeters, setOpenDialog, resetFormData, setTextBtnSumbit, setFormTitle } = usePerimeterContext();

   const handleClickAdd = () => {
      try {
         resetFormData();
         setOpenDialog(true);
         setTextBtnSumbit("AGREGAR");
         setFormTitle("REGISTRAR PERÍMETRO");
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   useEffect(() => {
      try {
         setLoading(true);
         getPerimeters();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, []);

   return (
      <>
         {/* <Alert severity="warning" sx={{mb:1}}>
            <AlertTitle>Info</AlertTitle>
            Estas seguro de eliminar a — <strong>registro 1!</strong>
         </Alert> */}

         <MainCard /* title="Listado Escuelas" */>
            <Button variant="contained" fullWidth onClick={() => handleClickAdd()} sx={{ mb: 1 }}>
               <AddCircleOutlineOutlined sx={{ mr: 1 }}></AddCircleOutlineOutlined> AGREGAR
            </Button>
            <PerimeterTable />
         </MainCard>

         <PerimeterForm />
      </>
   );
};

export const loaderIndex = async () => {
   try {
      const res = CorrectRes;
      // const axiosData = await Axios.get("/perimeters");
      // res.result.perimeters = axiosData.data.data.result

      return res;
   } catch (error) {
      const res = ErrorRes;
      console.log(error);
      res.message = error;
      res.alert_text = error;
      sAlert.Error(error);
      return res;
   }
};

export default PerimetersView;
