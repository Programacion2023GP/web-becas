import * as Yup from "yup";

import { FormControlLabel, Switch, Typography } from "@mui/material";
import { SwipeableDrawer } from "@mui/material";
import { useState } from "react";
import { useSchoolContext } from "../../../context/SchoolContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useLevelContext } from "../../../context/LevelContext";
import { FormikComponent, InputComponent, InputsCommunityComponent, RadioButtonComponent, Select2Component } from "../../../components/Form/FormikComponents";
// import InputComponent from "../Form/InputComponent";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const SchoolForm = () => {
   const {
      openDialog,
      setOpenDialog,
      toggleDrawer,
      setLoadingAction   } = useGlobalContext();
   const { singularName, levels, getLevelsSelectIndex } = useLevelContext();
   const {
      createSchool,
      updateSchool,
      formData,
      setFormData,
      textBtnSubmit,
      resetFormData,
      setTextBtnSumbit,
      formTitle,
      setFormTitle,
      formikRef
   } = useSchoolContext();
   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);

   const handleChangeCheckAdd = (e) => {
      try {
         const active = e.target.checked;
         localStorage.setItem("checkAdd", active);
         setCheckAdd(active);
         setColorLabelcheck("");
         if (!active) setColorLabelcheck("#ccc");
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
         // return console.log("values", values);
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createSchool(values);
         else axiosResponse = await updateSchool(values);
         resetForm();
         resetFormData();
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
         // if (error.code === "auth/user-not-found") setErrors({ email: "Usuario no registrado" });
         // if (error.code === "auth/wrong-password") setErrors({ password: "Contraseña incorrecta" });
      } finally {
         setSubmitting(false);
         setLoadingAction(false);
      }
   };



   const handleCancel = (resetForm) => {
      try {
         resetForm();
         setOpenDialog(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const validationSchema = Yup.object().shape({
      code: Yup.string().trim().required("Clave de escuela requerida"),
      level_id: Yup.number().min(1, "Ésta opción no es valida").required("Nivel requerido"),
      school: Yup.string().trim().required("Nombre de escuela requerida"),
      // city_id: Yup.string().trim().required("Ciudad requerido"),
      // colony_id: Yup.string().trim().required("Colonia requerida"),
      street: Yup.string().trim().required("Calle requerida"),
      num_ext: Yup.string().trim().required("Número exterior requerida"),
      phone: Yup.string()
         .trim()
         .matches("[0-9]{10}", "Formato invalido - teléfono a 10 digitos")
         .max(10, "Formato invalido - teléfono a 10 digitos")
         .required("Número telefónico requerido"),
      director: Yup.string().trim().required("Nombre del director requerido"),
      loc_for: Yup.string().required("Indica si la esculea esá dentro o fuera del municipio de Gomez Palacio"),
      zone: Yup.string().trim().required("Zona requerida")
   });

   useEffect(() => {
      try {
         getLevelsSelectIndex();
         const btnModify = document.getElementById("btnModify");
         if (btnModify != null) btnModify.click();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [formData]);

   return (
      <SwipeableDrawer anchor={"right"} open={openDialog} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
         <Box role="presentation" p={3} pt={5} className="form">
            <Typography variant="h2" mb={3}>
               {formTitle}
               <FormControlLabel
                  sx={{ float: "right", color: colorLabelcheck }}
                  control={<Switch checked={checkAdd} onChange={(e) => handleChangeCheckAdd(e)} />}
                  label="Seguir Agregando"
               />
            </Typography>
            <FormikComponent
               key={"formikComponent"}
               initialValues={formData}
               validationSchema={validationSchema}
               onSubmit={onSubmit}
               textBtnSubmit={textBtnSubmit}
               formikRef={formikRef}
               handleCancel={handleCancel}
            >
               <InputComponent col={12} idName={"id"} label={"id"} placeholder={"ID"} hidden={true} />

               {/* Codigo */}
               <InputComponent
                  col={4}
                  idName={"code"}
                  label={"Código de la Escuela *"}
                  placeholder={"AS5D16A158"}
                  textStyleCase={true}
                  inputProps={{ maxLength: 10 }}
               />

               {/* Nivel */}
               <Select2Component col={8} idName={"level_id"} label={"Nivel *"} options={levels} pluralName={"Niveles"} refreshSelect={getLevelsSelectIndex} />

               {/* Escuela */}
               <InputComponent col={12} idName={"school"} label={"Nombre de la Escuela *"} placeholder={"Lazaro Cardenas de Rio"} textStyleCase={true} />

               {/* INPUTS DE COMUNIDAD */}
               <InputsCommunityComponent formData={formData} setFormData={setFormData} columnsByTextField={6} />

               {/* Telefono */}
               <InputComponent col={4} idName={"phone"} label={"Número Telefónico *"} placeholder={"10 dígitos"} inputProps={{ maxLength: 10 }} />

               {/* Director */}
               <InputComponent col={8} idName={"director"} label={"Nombre del director *"} placeholder={"Lic. Nombre Completo"} textStyleCase={true} />

               {/* Local o Foraneo */}
               <RadioButtonComponent
                  col={6}
                  idName={"loc_for"}
                  title={"Ubicación de la escuela"}
                  options={[
                     { value: "1", label: "Local" },
                     { value: "0", label: "Foranea" }
                  ]}
               />

               {/* Zona */}
               <RadioButtonComponent
                  col={6}
                  idName={"zone"}
                  title={"Zona"}
                  options={[
                     { value: "U", label: "Urbana" },
                     { value: "R", label: "Rural" }
                  ]}
               />
            </FormikComponent>
         </Box>
      </SwipeableDrawer>
   );
};
export default SchoolForm;
