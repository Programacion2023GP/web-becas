import { Formik, useFormikContext } from "formik";
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
import { useMenuContext } from "../../../context/MenuContext";
import { FormikComponent } from "../../../components/Form/FormikComponents";

const FormSelect = ({ setOpenDialogTable, setLoadPermissions }) => {
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
      showRoleSelect,
      updatePermissions,
      getRolesSelectIndex,
      formikRef
   } = useRoleContext();
   const { menus, checkMenus, setCheckMenus, checkMaster, setCheckMaster } = useMenuContext();
   // const formik = useFormikContext();

   const resetCheckMenus = () => {
      setCheckMaster(false);
      const resetCheck = checkMenus.map((check) => {
         check.isChecked = false;
         check.permissions = { read: false, create: false, update: false, delete: false, more_permissions: [] };
         return check;
      });
      setCheckMenus(resetCheck);
   };

   const handleChangeRole = async (inputName, value2, setFieldValue) => {
      try {
         // console.log("amanas", value2);
         setLoadPermissions(true);
         resetCheckMenus();
         // console.log("resetCheckMenus", resetCheckMenus);
         if (value2.id < 1) return setLoadPermissions(false); // checks se quedan reiniciados
         const axiosResponse = await showRoleSelect(value2.id);
         // console.log(axiosResponse);
         const permissions = {
            read: [],
            create: [],
            update: [],
            delete: [],
            more_permissions: []
         };
         permissions.read = axiosResponse.result.read === "todas" ? "todas" : axiosResponse.result.read === null ? [] : axiosResponse.result.read.split(",");
         permissions.create = axiosResponse.result.create === "todas" ? "todas" : axiosResponse.result.create === null ? [] : axiosResponse.result.create.split(",");
         permissions.update = axiosResponse.result.update === "todas" ? "todas" : axiosResponse.result.update === null ? [] : axiosResponse.result.update.split(",");
         permissions.delete = axiosResponse.result.delete === "todas" ? "todas" : axiosResponse.result.delete === null ? [] : axiosResponse.result.delete.split(",");
         permissions.more_permissions =
            axiosResponse.result.more_permissions === "todas"
               ? "todas"
               : axiosResponse.result.more_permissions === null
               ? []
               : axiosResponse.result.more_permissions.split(",");
         // console.log("permissions.more_permissions", permissions.more_permissions);

         let newCheckMenus = [];
         if (
            permissions.read === "todas" &&
            permissions.create === "todas" &&
            permissions.update === "todas" &&
            permissions.delete === "todas"
            // && permissions.more_permissions === "todas"
         )
            newCheckMenus = checkMenus.map((check) => {
               check.isChecked = true;
               check.permissions = { read: true, create: true, update: true, delete: true, more_permissions: [] };
               // check.permissions = { read: true, create: true, update: true, delete: true, more_permissions: ["todas"] };
               return check;
            });
         else {
            newCheckMenus = checkMenus.map((check) => {
               // console.log(`${permissions.read}includes(${check.id.toString()})`);
               if (permissions.read.includes(check.id.toString()) || permissions.read === "todas") check.isChecked = true;
               if (permissions.read.includes(check.id.toString()) || permissions.read === "todas") check.permissions.read = true;
               if (permissions.create.includes(check.id.toString()) || permissions.create === "todas") check.permissions.create = true;
               if (permissions.update.includes(check.id.toString()) || permissions.update === "todas") check.permissions.update = true;
               if (permissions.delete.includes(check.id.toString()) || permissions.delete === "todas") check.permissions.delete = true;
               // console.log(`${permissions.more_permissions}includes(${check.id.toString()})`);
               check.permissions.more_permissions = [];
               if (permissions.more_permissions === "todas") check.permissions.more_permissions = ["todas"];
               // else check.permissions.more_permissions = permissions.more_permissions;
               // else {
               //    permissions.more_permissions.map((mp) => {
               //       console.log("el mp", mp);
               //       // else check.permissions.more_permissions = permissions.more_permissions;
               //    });
               // }
               return check;
            });
         }
         permissions.more_permissions.map((mp) => {
            // console.log("el mp", mp);
            const id = mp.split("@")[0];
            newCheckMenus.find((check) => check.id === Number(id) && check.permissions.more_permissions.push(mp));
            // else check.permissions.more_permissions = permissions.more_permissions;
         });
         setCheckMenus(newCheckMenus);
         setLoadPermissions(false);
         // console.log("FormSelect - checkMenus", checkMenus);
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

   // const handleModify = (setValues, setFieldValue) => {
   //    try {
   //       // fillCheckMenus()
   //       if (roleSelect.description) roleSelect.description == null && (roleSelect.description = "");
   //       setValues(roleSelect);
   //       // console.log(roleSelect);
   //    } catch (error) {
   //       console.log(error);
   //       Toast.Error(error);
   //    }
   // };

   const handleClickEdit = async () => {
      try {
         // console.log("el roleSelect:", roleSelect);
         if (roleSelect.id < 1) return Toast.Info("No has seleccionado ningún rol.");
         setLoadingAction(true);
         setTextBtnSumbit("GUARDAR");
         setFormTitle(`EDITAR ${singularName.toUpperCase()}`);
         // const axiosResponse = await showRole(roleSelect.id);
         // console.log(axiosResponse.result);
         formikRef.current.setValues(roleSelect);

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
         formData.role = "";
         // setFormData({ ...roleSelect, rol: "" });
         formikRef.current.resetForm();

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
         // console.log("values", values);
         // console.log("checkMenus", checkMenus);
         if (values.id < 1) return Toast.Info("Selecciona un Role");
         setLoadingAction(true);
         values.read = [];
         values.create = [];
         values.update = [];
         values.delete = [];
         values.more_permissions = [];
         let count_more_permissions = 0;
         const totalMenus = checkMenus.length;
         checkMenus.map((check) => {
            // console.log("check", check);
            if (check.permissions.read) values.read.push(check.id);
            if (check.permissions.create) values.create.push(check.id);
            if (check.permissions.update) values.update.push(check.id);
            if (check.permissions.delete) values.delete.push(check.id);
            if (check.permissions.more_permissions.length > 0) {
               check.permissions.more_permissions.map((permission) => {
                  values.more_permissions.push(permission);
               });
            }
         });
         menus.map((m) => m.children.map((mc) => (count_more_permissions += mc.others_permissions.length)));
         // console.log("values", values);
         // console.log("values.more_permissions", values.more_permissions, "-- count", count_more_permissions);
         if (values.read.length == totalMenus) values.read = "todas";
         else values.read = values.read.join();
         if (values.create.length == totalMenus) values.create = "todas";
         else values.create = values.create.join();
         if (values.update.length == totalMenus) values.update = "todas";
         else values.update = values.update.join();
         if (values.delete.length == totalMenus) values.delete = "todas";
         else values.delete = values.delete.join();
         // if (values.more_permissions.length > 0 && values.more_permissions.length == count_more_permissions) values.more_permissions = "todas";
         // else
         // console.log(values.more_permissions);
         values.more_permissions = values.more_permissions.join();
         // console.log("valuesFinal", values);
         // return;
         const axiosResponse = await updatePermissions(values);
         if (axiosResponse.status_code === 200) {
            resetForm();
            resetRoleSelect();
            resetCheckMenus();
         }
         // setTextBtnSumbit("AGREGAR");
         // setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
         setSubmitting(false);
         setLoadingAction(false);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         // if (!checkAdd) setOpenDialog(false);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
      } finally {
         setSubmitting(false);
      }
   };

   const validationSchema = Yup.object().shape({
      id: Yup.number().min(1, "Esta opción no es valida").required("Rol requerido")
   });

   useEffect(() => {
      try {
         // console.log(formikRef);
         // const btnModify = document.getElementById("btnModify");
         // if (btnModify != null && roleSelect.id > 0) btnModify.click();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [roleSelect]);

   return (
      <FormikComponent
         key={"formikComponent"}
         initialValues={roleSelect}
         validationSchema={validationSchema}
         onSubmit={onSubmit}
         textBtnSubmit={textBtnSubmit}
         showActionButtons={false}
         // formikRef={formikRef}
         // ref={formikRef}
      >
         <Grid xs={12} sm={2} sx={{ mb: 1 }}>
            <Button type="reset" variant="outlined" color="secondary" size="large" sx={{ mt: 1 }} fullWidth onClick={handleClickShowTable}>
               VER TODOS
            </Button>
         </Grid>
         {auth.permissions.update && (
            <Grid xs={12} sm={2} sx={{ mb: 1 }}>
               <Button type="button" variant="outlined" color="info" fullWidth size="large" sx={{ mt: 1 }} onClick={handleClickEdit}>
                  EDITAR
               </Button>
            </Grid>
         )}
         {auth.permissions.create && (
            <Grid xs={12} sm={2} sx={{ mb: 1 }}>
               <Button type="button" variant="outlined" color="success" fullWidth size="large" sx={{ mt: 1 }} onClick={handleClickAdd}>
                  AGREGAR
               </Button>
            </Grid>
         )}

         <Select2Component
            col={4}
            idName={"id"}
            label={"Rol *"}
            options={rolesSelect}
            refreshSelect={getRolesSelectIndex}
            handleChangeValueSuccess={handleChangeRole}
         />
         {auth.permissions.more_permissions.includes(`6@Asignar Permisos`) && (
            <Grid xs={12} sm={2} sx={{ mb: 1 }}>
               <LoadingButton
                  type="submit"
                  disabled={formikRef.isSubmitting}
                  loading={formikRef.isSubmitting}
                  // loadingPosition="start"
                  variant="contained"
                  fullWidth
                  size="large"
               >
                  GUARDAR
               </LoadingButton>
            </Grid>
         )}
      </FormikComponent>
   );
};
export default FormSelect;
