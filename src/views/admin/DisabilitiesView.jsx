// material-ui
// import Grid from "@mui/material/Grid"; // Grid version 1

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
// import Grid from '@mui/material/Unstable_Grid2';

// project imports
import MainCard from "../../ui-component/cards/MainCard";
import DisabilityTable from "../../components/disabilities/DisabilityTable";
import DisabilityForm from "../../components/disabilities/DisabilityForm";

import { CorrectRes, ErrorRes } from "../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../context/AuthContext";
// import Backdrop from "../../components/BackDrop";

import { useEffect, useState } from "react";
import { useDisabilityContext } from "../../context/DisabilityContext";
import { Button } from "@mui/material";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import sAlert from "../../utils/sAlert";
import Toast from "../../utils/Toast";
import { useGlobalContext } from "../../context/GlobalContext";

const DisabilitiesView = () => {
   // const { result } = useLoaderData();
   const { setLoading, setLoadingAction } = useGlobalContext();
   const { getDisabilities, setOpenDialog, resetFormData, setTextBtnSumbit, setFormTitle } = useDisabilityContext();

   const handleClickAdd = () => {
      try {
         resetFormData();
         setOpenDialog(true);
         setTextBtnSumbit("AGREGAR");
         setFormTitle("REGISTRAR DISCAPACIDAD");
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   useEffect(() => {
      try {
         setLoading(true);
         getDisabilities();
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
            <DisabilityTable />
         </MainCard>

         <DisabilityForm />
      </>
   );
};

export const loaderIndex = async () => {
   try {
      const res = CorrectRes;
      // const axiosData = await Axios.get("/disabilities");
      // res.result.disabilities = axiosData.data.data.result

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

export default DisabilitiesView;
