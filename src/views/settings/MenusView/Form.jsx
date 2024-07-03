import * as Yup from "yup";

import { Card, Typography } from "@mui/material";
import { useState } from "react";
import { useMenuContext } from "../../../context/MenuContext";
import { Box } from "@mui/system";
import { useEffect } from "react";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import Select2Component from "../../../components/Form/Select2Component";
import { useAuthContext } from "../../../context/AuthContext";
import { FormikComponent, InputComponent, RadioButtonComponent, SwitchComponent } from "../../../components/Form/FormikComponents";
// import InputComponent from "../Form/InputComponent";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const MenuForm = () => {
   const { auth } = useAuthContext();
   const { openDialog, setOpenDialog, toggleDrawer, setLoadingAction } = useGlobalContext();
   const {
      singularName,
      menus,
      createMenu,
      updateMenu,
      formData,
      setFormData,
      textBtnSubmit,
      resetFormData,
      setTextBtnSumbit,
      formTitle,
      setFormTitle,
      headerMenus,
      getHeaderMenusSelectIndex,
      isItem,
      setIsItem,
      formikRef
   } = useMenuContext();
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

   const handleChangeType = (idName, value) => {
      // console.log("handleChangeType - value", value);
      setIsItem(value == "item" ? true : false);
   };

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
         // return console.log("values", values);
         if (!isItem) values.belongs_to = 0; //es menu padre
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createMenu(values);
         else axiosResponse = await updateMenu(values);
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
      }
   };

   const handleReset = (resetForm, setFieldValue, id) => {
      try {
         resetForm();
         setFieldValue("id", id);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleCancel = (resetForm) => {
      try {
         resetForm();
         resetFormData();
         // setOpenDialog(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const validationSchemas = () => {
      let validationSchema = Yup.object().shape({
         menu: Yup.string().trim().required("Menú requerido"),
         // caption: Yup.string().trim().required("Leyenda requerida"),
         order: Yup.number().required("Orden requerido")
      });
      if (isItem)
         validationSchema = Yup.object().shape({
            menu: Yup.string().trim().required("Menú requerido"),
            belongs_to: Yup.number().min(1, "Esta opción no es valida").required("Pertenencia requerida"),

            url: Yup.string().trim().required("URL requerido"),
            icon: Yup.string().trim().required("Icono requerido"),
            order: Yup.number().required("Orden requerido")
         });
      // console.log("🚀 ~ validationSchemas ~ validationSchema:", validationSchema);
      return validationSchema;
   };

   useEffect(() => {
      try {
         // console.log("validationSchema", validationSchemas());
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [formData, isItem]);

   return (
      // <SwipeableDrawer anchor={"right"} open={openDialog} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
      <Card>
         <Box role="presentation" p={3} pt={5} className="form" sx={{ maxHeight: "77.2vh", overflowY: "auto" }}>
            <Typography variant="h2" mb={3} textAlign={"center"}>
               {formTitle}
               {/* <FormControlLabel
                  sx={{ float: "right", color: colorLabelcheck }}
                  control={<Switch checked={checkAdd} onChange={(e) => handleChangeCheckAdd(e)} />}
                  label="Seguir Agregando"
               /> */}
            </Typography>
            <FormikComponent
               key={"formikComponent"}
               initialValues={formData}
               validationSchema={validationSchemas}
               onSubmit={onSubmit}
               textBtnSubmit={textBtnSubmit}
               formikRef={formikRef}
               handleCancel={handleCancel}
               maxHeight={"66vh"}
            >
               <InputComponent col={12} idName={"id"} label={"ID"} placeholder={"ID"} textStyleCase={true} hidden={true} />

               {/* Padre o Hijo */}
               <RadioButtonComponent
                  col={12}
                  idName={"type"}
                  title={"Tipo de Menú"}
                  options={[
                     { value: "group", label: "Padre" },
                     { value: "item", label: "Hijo" }
                  ]}
                  rowLayout={true}
                  handleGetValue={handleChangeType}
               />

               {/* Menú */}
               <InputComponent col={12} idName={"menu"} label={"Nombre del Menú"} placeholder={"Usuarios"} textStyleCase={null} />

               {/* Leyenda */}
               {!isItem && <InputComponent col={12} idName={"caption"} label={"Ingresas Leyenda"} placeholder={"Texto de ayuda"} textStyleCase={null} />}

               {isItem && (
                  <>
                     {/* Pertence a */}
                     <Select2Component
                        col={12}
                        idName={"belongs_to"}
                        label={"Pertenezco a *"}
                        options={headerMenus}
                        pluralName={"Menús Padres"}
                        refreshSelect={getHeaderMenusSelectIndex}
                     />

                     {/* URL */}
                     <InputComponent col={12} idName={"url"} label={"URL / Path *"} placeholder={"/app/nombre-de-pagina"} textStyleCase={false} />

                     {/* Icono */}
                     <InputComponent
                        col={12}
                        idName={"icon"}
                        label={"Ingrese el nombre del icono *"}
                        placeholder={"NombreDelIcono"}
                        textStyleCase={null}
                        helperText={
                           <small style={{ fontStyle: "italic" }}>
                              <a href="https://tabler.io/icons" target="_blank">
                                 Pagina de iconos - copiar el "React Name"
                              </a>
                           </small>
                        }
                     />

                     {/* Otros Permisos */}
                     <InputComponent
                        col={12}
                        idName={"others_permissions"}
                        label={"Ingrese los permisos especiales"}
                        placeholder={"Otros Permisos"}
                        textStyleCase={null}
                        rows={5}
                        helperText={
                           <small style={{ fontStyle: "italic" }}>
                              Los permisos serán separados por coma "<b>( , )</b>" y su estructura: "Nombre Del Permiso"
                           </small>
                        }
                     />
                  </>
               )}
               {/* Orden */}
               <InputComponent col={12} idName={"order"} label={"Ingrese el orden *"} placeholder={"0"} textStyleCase={null} />

               {isItem && (
                  <>
                     {/* Solo lectura */}
                     <SwitchComponent col={12} idName={"read_only"} label={"¿Solo lectura?"} textEnable={"Solo lectura"} textDisable={"Con Permisos"} />

                     {/* Mostrar contador */}
                     <SwitchComponent col={5} idName={"show_counter"} label={"¿Mostrar contador?"} textEnable={"Mostrar"} textDisable={"Ocultar"} />

                     {/* Nombre del Contador */}
                     <InputComponent col={7} idName={"counter_name"} label={"Nombre del Contador"} placeholder={"requestApproved"} textStyleCase={null} />
                  </>
               )}
               {/* Activar */}
               <SwitchComponent col={12} idName={"active"} label={"Menú Activo?"} textEnable={"Activo"} textDisable={"Inactivo"} />
            </FormikComponent>
         </Box>
      </Card>

      // </SwipeableDrawer>
   );
};
export default MenuForm;
