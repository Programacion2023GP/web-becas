import * as Yup from "yup";

import { useState } from "react";
import { useCommunityContext } from "../../../context/CommunityContext";
import { useEffect } from "react";
import Toast from "../../../utils/Toast";
import { useGlobalContext } from "../../../context/GlobalContext";
import { usePerimeterContext } from "../../../context/PerimeterContext";
// import InputComponent from "../Form/InputComponent";
import { ModalComponent } from "../../../components/ModalComponent";
import { FormikComponent, InputComponent, Select2Component } from "../../../components/Form/FormikComponents";

const checkAddInitialState = localStorage.getItem("checkAdd") == "true" ? true : false || false;
const colorLabelcheckInitialState = checkAddInitialState ? "" : "#ccc";

const CommunityFormAssignPerimeter = ({ openDialog, setOpenDialog }) => {
   const { setLoadingAction } = useGlobalContext();
   const { formData, setFormData, textBtnSubmit, resetFormData, assignPerimeterToCommunity, formikRefAssing } = useCommunityContext();

   const { perimeters, getPerimetersSelectIndex } = usePerimeterContext();

   const [checkAdd, setCheckAdd] = useState(checkAddInitialState);
   const [colorLabelcheck, setColorLabelcheck] = useState(colorLabelcheckInitialState);

   const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
         // values.id = community_id;
         return console.log("values", values);
         setLoadingAction(true);
         let axiosResponse = await assignPerimeterToCommunity(values.perimeter_id, values.id);
         resetForm();
         resetFormData();
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
      perimeter_id: Yup.number().min(1, "Ésta opción no es valida").required("Perímetro requerido")
      // perimeter: Yup.string().trim().required("Perímetro requerido")
   });

   useEffect(() => {
      try {
         console.log("formData", formData);
         // const btnModify = document.getElementById("btnModify");
         // if (btnModify != null) btnModify.click();
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   }, [formData]);

   return (
      <ModalComponent
         open={openDialog}
         setOpen={setOpenDialog}
         maxWidth="sm"
         modalTitle="ASIGNACIÓN DE PERÍMETRO"
         height={"100%"}
         dialogActions={false}
         formikRef={formikRefAssing}
         textBtnSubmit={textBtnSubmit}
      >
         <FormikComponent
            key={"formikComponent"}
            initialValues={formData}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            textBtnSubmit={textBtnSubmit}
            formikRef={formikRefAssing}
            handleCancel={handleCancel}
            // maxHeight={null}
            // showActionButtons={false}
         >
            <InputComponent col={12} idName={"id"} label={"ID"} placeholder={"ID"} textStyleCase={true} hidden={true} />
            {/* Perímetro */}
            <Select2Component
               col={12}
               idName={"perimeter_id"}
               label={"Perímetro *"}
               options={perimeters}
               pluralName={"Perímetros"}
               refreshSelect={getPerimetersSelectIndex}
            />
         </FormikComponent>
      </ModalComponent>
   );
};
export default CommunityFormAssignPerimeter;
