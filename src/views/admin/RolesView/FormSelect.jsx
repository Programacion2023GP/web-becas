import { Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

import Select2Component from "../../../components/Form/Select2Component";
import { useRoleContext } from "../../../context/RoleContext";
import { useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import { Button, ButtonGroup } from "@mui/material";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useAuthContext } from "../../../context/AuthContext";

const FormSelect = ({ setOpenDialogTable }) => {
   const { auth } = useAuthContext();
   const { openDialog, setOpenDialog, toggleDrawer, setLoadingAction } = useGlobalContext();
   const {
      singularName,
      rolesSelect,
      createRole,
      updateRole,
      formData,
      setFormData,
      showRole,
      textBtnSubmit,
      resetRoleSelect,
      setTextBtnSumbit,
      formTitle,
      setFormTitle,
      roleSelect,
      setRoleSelect,
      showRoleSelect
   } = useRoleContext();

   const handleChangeRole = async (value2, setFieldValue) => {
      try {
         // console.log("amanas", value2);
         if (value2.id < 1) return; //tal vez reiniciar los checks
         const axiosResponse = await showRoleSelect(value2.id);
         console.log(axiosResponse);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickShowTable = () => {
      try {
         setOpenDialogTable(true);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleModify = (setValues, setFieldValue) => {
      try {
         // fillCheckMenus()
         if (roleSelect.description) roleSelect.description == null && (roleSelect.description = "");
         setValues(roleSelect);
         // console.log(roleSelect);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickEdit = async (id) => {
      try {
         if (id < 1) return Toast.Info("No has seleccionado ningún rol.");
         setLoadingAction(true);
         setTextBtnSumbit("GUARDAR");
         setFormTitle(`EDITAR ${singularName.toUpperCase()}`);
         await showRole(id);
         setOpenDialog(true);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickAdd = () => {
      try {
         // resetRole();
         resetRoleSelect();
         // setFormData({ ...roleSelect, rol: "" });
         setOpenDialog(true);
         setTextBtnSumbit("AGREGAR");
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
         return console.log("values", values);
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createRole(values);
         else axiosResponse = await updateRole(values);
         resetForm();
         resetRoleSelect();
         setTextBtnSumbit("AGREGAR");
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
         setSubmitting(false);
         setLoadingAction(false);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         if (!checkAdd) setOpenDialog(false);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
      } finally {
         setSubmitting(false);
      }
   };

   const validationSchema = Yup.object().shape({
      role: Yup.string().trim().required("Menú requerido")
      // belongs_to: Yup.number().min(1, "Esta opción no es valida").required("Pertenencia requerida"),
      // url: Yup.string().trim().required("URL requerido"),
      // icon: Yup.string().trim().required("Icono requerido"),
      // order: Yup.number().required("Orden requerido")
   });

   useEffect(() => {
      try {
         const btnModify = document.getElementById("btnModify");
         if (btnModify != null && roleSelect.id > 0) btnModify.click();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [roleSelect]);

   return (
      <>
         <Formik initialValues={roleSelect} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
               <Grid container spacing={2} component={"form"} onSubmit={handleSubmit}>
                  <Grid xs={12} sm={2} sx={{ mb: 1 }}>
                     <Button type="reset" variant="outlined" color="secondary" size="large" sx={{ mt: 1 }} fullWidth onClick={() => handleClickShowTable()}>
                        VER TODOS
                     </Button>
                  </Grid>
                  {auth.permissions.update && (
                     <Grid xs={12} sm={2} sx={{ mb: 1 }}>
                        <Button type="button" variant="outlined" color="info" fullWidth size="large" sx={{ mt: 1 }} onClick={() => handleClickEdit(values.id)}>
                           EDITAR
                        </Button>
                     </Grid>
                  )}
                  {auth.permissions.create && (
                     <Grid xs={12} sm={2} sx={{ mb: 1 }}>
                        <Button type="button" variant="outlined" color="success" fullWidth size="large" sx={{ mt: 1 }} onClick={() => handleClickAdd(values.id)}>
                           AGREGAR
                        </Button>
                     </Grid>
                  )}

                  <Grid xs={12} sm={4} sx={{ mb: 1 }}>
                     <Select2Component
                        idName={"id"}
                        label={"Rol *"}
                        valueLabel={values.role}
                        values={values}
                        formData={roleSelect}
                        setFormData={setRoleSelect}
                        formDataLabel={"role"}
                        placeholder={"Selecciona una opción..."}
                        options={rolesSelect}
                        fullWidth={true}
                        handleChange={handleChange}
                        handleChangeValueSuccess={handleChangeRole}
                        setValues={setValues}
                        handleBlur={handleBlur}
                        error={errors.id}
                        touched={touched.id}
                        disabled={false}
                     />
                  </Grid>
                  {auth.permissions.update && (
                     <Grid xs={12} sm={2} sx={{ mb: 1 }}>
                        <LoadingButton
                           type="submit"
                           disabled={isSubmitting}
                           loading={isSubmitting}
                           // loadingPosition="start"
                           variant="contained"
                           fullWidth
                           size="large"
                        >
                           {" "}
                           GUARDAR
                           {/* {textBtnSubmit} */}
                        </LoadingButton>
                     </Grid>
                  )}
               </Grid>
            )}
         </Formik>
      </>
   );
};
export default FormSelect;
