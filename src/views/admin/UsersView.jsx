import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

import MainCard from "../../ui-component/cards/MainCard";
import UserTable from "../../components/users/Table";
import UserForm from "../../components/users/Form";

import { CorrectRes, ErrorRes } from "../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../context/AuthContext";

import { useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import { Button } from "@mui/material";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import sAlert from "../../utils/sAlert";
import Toast from "../../utils/Toast";
import { useGlobalContext } from "../../context/GlobalContext";
import RoleContextProvider from "../../context/RoleContext";

const Item = styled(Paper)(({ theme }) => ({
   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#f1f1f1",
   ...theme.typography.body2,
   padding: theme.spacing(1),
   textAlign: "center",
   color: theme.palette.text.secondary
}));

const UsersView = () => {
   // const { result } = useLoaderData();
   const { setLoading, setOpenDialog } = useGlobalContext();
   const { singularName, pluralName, formData, setUser, users, resetUser, getUsers, resetFormData, setTextBtnSumbit, setFormTitle } = useUserContext();

   const handleClickAdd = () => {
      try {
         resetUser();
         formData.role = "Selecciona una opción...";
         resetFormData();
         setOpenDialog(true);
         setTextBtnSumbit("AGREGAR");
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   useEffect(() => {
      try {
         setLoading(true);
         getUsers();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [formData]);

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
            <UserTable />
         </MainCard>

         <RoleContextProvider>
            <UserForm />
         </RoleContextProvider>
      </>
   );
};

export const loaderIndexUsersView = async () => {
   try {
      const res = CorrectRes;
      // const axiosData = await Axios.get("/users");
      // res.result.users = axiosData.data.data.result;

      const axiosRoles = await Axios.get("/roles/selectIndex");
      res.result.roles = axiosRoles.data.data.result;
      res.result.roles.unshift({ id: 0, label: "Selecciona una opción..." });
      // // console.log(res);

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

export default UsersView;
