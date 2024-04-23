import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Field } from "formik";
import Toast from "../../utils/Toast";
import { CircularProgress, TextField } from "@mui/material";
import { handleInputFormik } from "../../utils/Formats";
import { useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../context/GlobalContext";
import Select2Component from "./Select2Component";

/** ESTRUCTURTAS PARA IMPORTAR EL COMPONENTE
 * hay que importar ciertos sets de GlobalContext
  const {
      setDisabledState,
      setDisabledCity,
      setDisabledColony,
      setShowLoading,
      setDataStates,
      setDataCities,
      setDataColonies,
      setDataColoniesComplete
   } = useGlobalContext();


 * esta es la estructura del componente a insertar
   <InputsCommunityComponent
      formData={formData}
      setFormData={setFormData}
      values={values}
      setValues={setValues}
      setFieldValue={setFieldValue}
      handleChange={handleChange}
      handleBlur={handleBlur}
      errors={errors}
      touched={touched}
   />

   * esta es la estructura para la funcion getCommunity al editar (handleModify)
   getCommunity(
      formData.zip,
      setFieldValue,
      formData.community_id,
      formData,
      setFormData,
      setDisabledState,
      setDisabledCity,
      setDisabledColony,
      setShowLoading,
      setDataStates,
      setDataCities,
      setDataColonies,
      setDataColoniesComplete
   );
*/

export const getCommunityById = async (community_id) => {
   const axiosMyCommunity = axios;
   const { data } = await axiosMyCommunity.get(`${import.meta.env.VITE_API_CP}/cp/colonia/${community_id}`);
   // console.log(data.data);
   return data.data.result;
};

export const getCommunity = async (
   zip,
   setFieldValue,
   community_id = null,
   formData,
   setFormData,
   setDisabledState,
   setDisabledCity,
   setDisabledColony,
   setShowLoading,
   setDataStates,
   setDataCities,
   setDataColonies,
   setDataColoniesComplete
) => {
   try {
      // return console.log("vamos bine aqui");
      let _community_id = null;
      setShowLoading(true);
      setDisabledState(true);
      setDisabledCity(true);
      setDisabledColony(true);
      let states = ["Selecciona una opción..."];
      let cities = ["Selecciona una opción..."];
      let colonies = ["Selecciona una opción..."];
      let coloniesComplete = ["Selecciona una opción..."];
      setDataStates(states);
      setDataCities(cities);
      setDataColonies(colonies);
      setDataColoniesComplete(coloniesComplete);
      setFieldValue("state", "Selecciona una opción...");
      setFieldValue("city", "Selecciona una opción...");
      setFieldValue("colony", "Selecciona una opción...");
      formData.street !== "" && setFieldValue("street", formData.street);
      formData.num_ext !== "" && setFieldValue("num_ext", formData.num_ext);
      formData.num_int !== "" && setFieldValue("num_int", formData.num_int);
      if (community_id) {
         const axiosMyCommunity = axios;
         const { data } = await axiosMyCommunity.get(`${import.meta.env.VITE_API_CP}/cp/colonia/${community_id}`);

         if (data.data.status_code != 200) return Toast.Error(data.data.alert_text);
         formData.zip = data.data.result.CodigoPostal;
         formData.state = data.data.result.Estado;
         formData.city = data.data.result.Municipio;
         formData.colony = data.data.result.Colonia;
         // formData.colony = community_id;
         await setFormData(formData);
         zip = formData.zip;
      }
      if (zip.length > 1) {
         const axiosCommunities = axios;
         const axiosRes = await axiosCommunities.get(`${import.meta.env.VITE_API_CP}/cp/${zip}`);
         if (axiosRes.data.data.status_code != 200) return Toast.Error(axiosRes.data.data.alert_text);
         await axiosRes.data.data.result.map((d) => {
            states.push(d.Estado);
            cities.push(d.Municipio);
            colonies.push(d.Colonia);
            coloniesComplete.push({ id: d.id, label: d.Colonia });
         });
      }
      states = [...new Set(states)];
      cities = [...new Set(cities)];
      colonies = [...new Set(colonies)];
      coloniesComplete = [...new Set(coloniesComplete)];

      if (zip !== "" && states.length === 1) {
         setShowLoading(false);
         return Toast.Info("No hay comunidades registradas con este C.P.");
      }
      if (states.length > 2) setDisabledState(false);
      if (cities.length > 2) setDisabledCity(false);
      if (colonies.length > 1) setDisabledColony(false);
      setDataStates(states);
      setDataCities(cities);
      setDataColonies(colonies);
      setDataColoniesComplete(coloniesComplete);
      setFieldValue("zip", community_id ? formData.zip : zip);
      setFieldValue("state", community_id ? formData.state : states.length == 1 ? states[0] : states[1]);
      setFieldValue("city", community_id ? formData.city : cities.length == 1 ? cities[0] : cities[1]);
      setFieldValue("colony", community_id ? formData.colony : colonies.length == 2 ? colonies[1] : colonies[0]);
      if (!community_id) setFieldValue("community_id", coloniesComplete.length == 2 && coloniesComplete[1].id);
      // setFieldValue("colony", community_id ? community_id : colonies[0]["id"]);
      setShowLoading(false);
   } catch (error) {
      console.log(error);
      Toast.Error(error);
      setShowLoading(false);
   }
};

/**
 * Estos Inputs, deben de estar dentro de Formik, validados con Yup y dentro de grillas
 * @param {*} param0
 * @returns community_id: int
 */
const InputsCommunityComponent = ({
   formData,
   setFormData,
   values,
   setFieldValue,
   setValues,
   handleChange,
   handleBlur,
   errors,
   touched,
   columnsByTextField = 6,
   registerCommunity = false,
   disabled = false
}) => {
   const {
      setCursorLoading,
      disabledState,
      setDisabledState,
      disabledCity,
      setDisabledCity,
      disabledColony,
      setDisabledColony,
      showLoading,
      setShowLoading,
      dataStates,
      setDataStates,
      dataCities,
      setDataCities,
      dataColonies,
      setDataColonies,
      dataColoniesComplete,
      setDataColoniesComplete
   } = useGlobalContext();

   const handleKeyUpZip = async (e, setFieldValue, community_id = null) => {
      try {
         const zip = e.target.value;
         if (e.target.value == "0") {
            await getCommunity(
               zip,
               setFieldValue,
               community_id,
               formData,
               setFormData,
               setDisabledState,
               setDisabledCity,
               setDisabledColony,
               setShowLoading,
               setDataStates,
               setDataCities,
               setDataColonies,
               setDataColoniesComplete
            );
         } else {
            setDisabledColony(true);
            setFieldValue("state", "Selecciona una opción...");
            setFieldValue("city", "Selecciona una opción...");
            setFieldValue("colony", "Selecciona una opción...");
         }
         if (e.key === "Enter" || e.keyCode === 13) return;
         if (e.target.value.length == 0) return Toast.Info("C.P. vacio.");

         if (e.target.value.length == 5) {
            await getCommunity(
               zip,
               setFieldValue,
               community_id,
               formData,
               setFormData,
               setDisabledState,
               setDisabledCity,
               setDisabledColony,
               setShowLoading,
               setDataStates,
               setDataCities,
               setDataColonies,
               setDataColoniesComplete
            );
         } else {
            setDisabledColony(true);
            setFieldValue("state", "Selecciona una opción...");
            setFieldValue("city", "Selecciona una opción...");
            setFieldValue("colony", "Selecciona una opción...");
         }
      } catch (error) {
         console.log(error);
         Toast.Error(error);
         // setCursorLoading(false);
         setShowLoading(false);
      }
   };
   // const handleBlurZip = async (zip, setFieldValue, community_id = null) => {
   //    try {
   //       if (zip.length < 1) {
   //          setFieldValue("state", "Selecciona una opción...");
   //          setFieldValue("city", "Selecciona una opción...");
   //          setFieldValue("colony", "Selecciona una opción...");
   //          Toast.Info("C.P. vacio");
   //       }
   //       setCursorLoading(true);
   //       await getCommunity(
   //          zip,
   //          setFieldValue,
   //          community_id,
   //          formData,
   //          setFormData,
   //          setDisabledState,
   //          setDisabledCity,
   //          setDisabledColony,
   //          setShowLoading,
   //          setDataStates,
   //          setDataCities,
   //          setDataColonies,
   //          setDataColoniesComplete
   //       );
   //       setCursorLoading(false);
   //    } catch (error) {
   //       console.log(error);
   //       Toast.Error(error);
   //       setCursorLoading(false);
   //       setShowLoading(false);
   //    }
   // };

   const handleChangeColony = async (inputName, colony, setFieldValue) => {
      try {
         const community_selected = dataColoniesComplete.find((c) => c.label === colony);
         // values.community_id = community_selected.id;
         setFieldValue("community_id", community_selected.id);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   useEffect(() => {}, [formData, values]);

   return (
      <>
         {/* community_id */}
         <Field id="community_id" name="community_id" type="hidden" value={values.community_id} onChange={handleChange} onBlur={handleBlur} />
         {/* Comunidad */}
         <Grid container spacing={2} xs={12} sx={{ p: 1 }}>
            {/* C.P. */}
            <Grid xs={12} md={columnsByTextField} sx={{ mb: 2 }}>
               <TextField
                  id="zip"
                  name="zip"
                  label="Código Postal *"
                  value={values.zip}
                  placeholder="35000"
                  inputProps={{ maxLength: 5 }}
                  onChange={handleChange}
                  onBlur={async (e) => {
                     handleBlur(e);
                     // await handleBlurZip(e.target.value, setFieldValue);
                  }}
                  onKeyUp={(e) => handleKeyUpZip(e, setFieldValue)}
                  fullWidth
                  // disabled={values.id == 0 ? false : true}
                  disabled={showLoading}
                  error={errors.zip && touched.zip}
                  helperText={errors.zip && touched.zip && errors.zip}
               />
               {showLoading && <CircularProgress disableShrink sx={{ position: "relative", right: "-65%", top: "-52px", mt: 0.75, zIndex: 10 }} />}
            </Grid>
            {/* Estado */}
            <Grid xs={12} md={columnsByTextField} sx={{ mb: 2 }}>
               <Select2Component
                  idName={"state"}
                  label={"Estado *"}
                  valueLabel={values.state}
                  formDataLabel={"state"}
                  placeholder={"Selecciona una opción..."}
                  options={dataStates}
                  fullWidth={true}
                  // handleChangeValueSuccess={handleChangeState}
                  handleBlur={handleBlur}
                  error={errors.state}
                  touched={touched.state}
                  disabled={disabledState}
               />
               {/* <Select2Component
                  idName={"state"}
                  label={"Estado"}
                  valueLabel={values.state}
                  values={values}
                  formData={formData}
                  setFormData={setFormData}
                  formDataLabel={"state"}
                  placeholder={"Selecciona una opción..."}
                  options={dataStates}
                  fullWidth={true}
                  handleChange={handleChange}
                  // handleChangeValueSuccess={handleChangeState}
                  setValues={setValues}
                  handleBlur={handleBlur}
                  error={errors.state}
                  touched={touched.state}
                  disabled={disabledState}
               /> */}
            </Grid>

            {/* Ciduad */}
            <Grid xs={12} md={columnsByTextField} sx={{ mb: 2 }}>
               <Select2Component
                  idName={"city"}
                  label={"Ciudad *"}
                  valueLabel={values.city}
                  formDataLabel={"city"}
                  placeholder={"Selecciona una opción..."}
                  options={dataCities}
                  fullWidth={true}
                  // handleChangeValueSuccess={handleChangeCity}
                  handleBlur={handleBlur}
                  error={errors.city}
                  touched={touched.city}
                  disabled={disabledCity}
               />
               {/* <Select2Component
                  idName={"city"}
                  label={"Ciudad"}
                  valueLabel={values.city}
                  values={values}
                  formData={formData}
                  setFormData={setFormData}
                  formDataLabel={"city"}
                  placeholder={"Selecciona una opción..."}
                  options={dataCities}
                  fullWidth={true}
                  handleChange={handleChange}
                  // handleChangeValueSuccess={handleChangeState}
                  setValues={setValues}
                  handleBlur={handleBlur}
                  error={errors.city}
                  touched={touched.city}
                  disabled={disabledCity}
               /> */}
            </Grid>
            {/* Colonia */}
            {!registerCommunity && (
               <Grid xs={12} md={columnsByTextField} sx={{ mb: 2 }}>
                  <Select2Component
                     idName={"colony"}
                     label={"Colonia *"}
                     valueLabel={values.colony}
                     formDataLabel={"colony"}
                     placeholder={"Selecciona una opción..."}
                     options={dataColonies}
                     fullWidth={true}
                     handleChangeValueSuccess={handleChangeColony}
                     handleBlur={handleBlur}
                     error={errors.colony}
                     touched={touched.colony}
                     disabled={disabledColony}
                  />
               </Grid>
            )}
         </Grid>
         {/* Calle */}
         {!registerCommunity && (
            <Grid xs={12} md={8} sx={{ mb: 2 }}>
               <TextField
                  id="street"
                  name="street"
                  label="Calle *"
                  type="text"
                  value={values.street}
                  placeholder="Calle de las Garzas"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  disabled={disabled}
                  onInput={(e) => handleInputFormik(e, setFieldValue, "street", true)}
                  error={errors.street && touched.street}
                  helperText={errors.street && touched.street && errors.street}
               />
            </Grid>
         )}
         {/* No. Ext. */}
         {!registerCommunity && (
            <Grid xs={12} md={2} sx={{ mb: 2 }}>
               <TextField
                  id="num_ext"
                  name="num_ext"
                  label="No. Ext. *"
                  type="text"
                  value={values.num_ext}
                  placeholder="S/N"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  onInput={(e) => handleInputFormik(e, setFieldValue, "num_ext", true)}
                  disabled={disabled}
                  error={errors.num_ext && touched.num_ext}
                  helperText={errors.num_ext && touched.num_ext && errors.num_ext}
               />
            </Grid>
         )}
         {/* No. Int. */}
         {!registerCommunity && (
            <Grid xs={12} md={2} sx={{ mb: 2 }}>
               <TextField
                  id="num_int"
                  name="num_int"
                  label="No. Int."
                  type="text"
                  value={values.num_int}
                  placeholder="S/N"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  onInput={(e) => handleInputFormik(e, setFieldValue, "num_int", true)}
                  disabled={disabled}
                  error={errors.num_int && touched.num_int}
                  helperText={errors.num_int && touched.num_int && errors.num_int}
               />
            </Grid>
         )}
      </>
   );
};

export default InputsCommunityComponent;
