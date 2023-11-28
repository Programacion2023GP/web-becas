// material-ui
// import Grid from "@mui/material/Grid"; // Grid version 1

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
// import Grid from '@mui/material/Unstable_Grid2';

// project imports
import SchoolTable from "../../components/schools/SchoolTable";
import SchoolForm from "../../components/schools/SchoolForm";

import { CorrectRes, ErrorRes } from "../../utils/Response";
import { Axios } from "../../context/AuthContext";

import { useEffect } from "react";
import { useSchoolContext } from "../../context/SchoolContext";
import { Button } from "@mui/material";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import sAlert from "../../utils/sAlert";
import Toast from "../../utils/Toast";
import { useGlobalContext } from "../../context/GlobalContext";
import LevelContextProvider from "../../context/LevelContext";

const Item = styled(Paper)(({ theme }) => ({
   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#f1f1f1",
   ...theme.typography.body2,
   padding: theme.spacing(1),
   textAlign: "center",
   color: theme.palette.text.secondary
}));

const SchoolsView = () => {
   // const { result } = useLoaderData();
   const { setLoading, setLoadingAction } = useGlobalContext();
   const { getSchools, setOpenDialog, resetFormData, setTextBtnSumbit, setFormTitle } = useSchoolContext();

   const handleClickAdd = () => {
      try {
         resetFormData();
         setOpenDialog(true);
         setTextBtnSumbit("AGREGAR");
         setFormTitle("REGISTRAR ESCUELA");
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   useEffect(() => {
      try {
         setLoading(true);
         getSchools();
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

         {/* <MainCard /* title="Listado Escuelas"  style={{ m: 0, p: 0, mb: 1 }}> */}
         <Button variant="contained" fullWidth onClick={() => handleClickAdd()} sx={{ mb: 1 }}>
            <AddCircleOutlineOutlined sx={{ mr: 1 }}></AddCircleOutlineOutlined> AGREGAR
         </Button>
         <SchoolTable />
         {/* </MainCard> */}

         <LevelContextProvider>
            <SchoolForm />
         </LevelContextProvider>
      </>
   );
};

export const loaderIndexSchoolsView = async () => {
   try {
      const res = CorrectRes;
      // const axiosData = await Axios.get("/schools");
      // res.result.schools = axiosData.data.data.result;

      const axiosLevels = await Axios.get("/levels/selectIndex");
      res.result.levels = axiosLevels.data.data.result;
      const axiosCities = await Axios.get("/cities/selectIndex");
      res.result.cities = axiosCities.data.data.result;
      const axiosColonies = await Axios.get("/colonies/selectIndex");
      res.result.colonies = axiosColonies.data.data.result;
      // console.log(res);

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

export default SchoolsView;
