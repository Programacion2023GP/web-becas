import { FormControl, FormHelperText, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import propTypes from "prop-types";
import { useCallback, useState } from "react";
import Toast from "../../utils/Toast";
import { Field } from "formik";
import { useDropzone } from "react-dropzone";

export const setObjImg = (img, setImg) => {
   if (img == "") return setImg([]);
   // console.log("setObjImg --> ", img, " <--");
   const imgObj = {
      file: {
         name: `${img}`
      },
      dataURL: `${import.meta.env.VITE_HOST}/${img}`
   };
   setImg([imgObj]);
};

/**
 * 
 * <InputFileComponent
      idName="img_path"
      label="Foto de la marca"
      filePreviews={imgFile}
      setFilePreviews={setImgFile}
      error={errors.img_path}
      touched={touched.img_path}
      multiple={false}
      accept={"image/*"}
   />
*
* ENVIAR (onSubmit) ----------> values.img_preview = imgPreview.length == 0 ? "" : imgPreview[0].file;
* MODIFICAR (handleModify) ---> setObjImg(formData.img_preview, setImgPreview);
* RESET ----------------------> setImagePreview([]);
*
*/
//  ===================================== COMPONENTE =====================================

const InputFileComponent = ({ idName, label, inputProps, filePreviews, setFilePreviews, error, touched, multiple, maxImages = -1, accept = null }) => {
   const [uploadProgress, setUploadProgress] = useState(0);
   // const [filePreviews, setFilePreviews] = useState([]);
   const [ttShow, setTtShow] = useState("");

   const validationQuantityImages = () => {
      if (multiple) {
         if (maxImages != -1) {
            if (filePreviews.length >= maxImages) {
               console.log("maxImages", maxImages);
               Toast.Info(`Solo se permiten cargar ${maxImages} imagenes.`);
               return false;
            }
         }
      } else {
         if (filePreviews.length >= 1) {
            Toast.Info(`Solo se permite cargar una imagen.`);
            return false;
         }
      }
      return true;
   };

   const onDrop = useCallback((acceptedFiles) => {
      setFilePreviews([]);
      // if (multiple) if (!validationQuantityImages()) return
      // Puedes manejar los archivos aceptados aquí y mostrar las vistas previas.
      acceptedFiles.forEach((file) => {
         const reader = new FileReader();

         reader.onload = async (e) => {
            const preview = {
               file,
               dataURL: reader.result
            };
            // if (multiple) if (!validationQuantityImages) return;

            // if (multiple) await setFilePreviews((prevPreviews) => [...prevPreviews, preview]);
            // else
            await setFilePreviews([preview]);
            // console.log(filePreviews);
         };

         reader.readAsDataURL(file);
      });
   }, []);

   const simulateUpload = () => {
      // Simulamos la carga con un temporizador.
      setTimeout(() => {
         const progress = uploadProgress + 10;
         setUploadProgress(progress);

         if (progress < 100) {
            // Si no se ha alcanzado el 100% de progreso, simulamos más carga.
            simulateUpload();
         } else {
            // Cuando se completa la carga, restablecemos el progreso.
            setUploadProgress(0);
         }
      }, 1000);
   };
   const handleRemoveImage = async (fileToRemove) => {
      // Filtra la lista de vistas previas para eliminar el archivo seleccionado.
      // console.log(filePreviews);
      // setFilePreviews((prevPreviews) => prevPreviews.filter((preview) => preview.file !== fileToRemove));
      await setFilePreviews([]);
      // console.log(filePreviews);
   };

   const { getRootProps, getInputProps } = useDropzone({
      onDrop
   });

   const handleMouseEnter = () => {
      setTtShow("tt_show");
   };
   const handleMouseLeave = () => {
      setTtShow("");
   };

   return (
      <>
         <FormControl fullWidth sx={{}}>
            <Typography variant="p" mb={1} sx={{ fontWeight: "bolder" }} htmlFor={idName}>
               {label}
            </Typography>

            <Field name={idName} id={idName}>
               {({ field, form }) => (
                  <>
                     <div className="dropzone-container">
                        <div {...getRootProps({ className: "dropzone" })}>
                           <input {...getInputProps()} multiple={multiple} accept={accept} />
                           <p style={{ display: filePreviews.length > 0 ? "none" : "block", fontStyle: "italic" }}>
                              Arrastra y suelta archivos aquí, o haz clic para seleccionar archivos
                           </p>

                           {/* Vista previa de la imagen */}
                           <aside className="file-preview">
                              {filePreviews.map((preview) => (
                                 <div key={preview.file.name} className="preview-item">
                                    <img className="preview-img" src={preview.dataURL} alt={preview.file.name} />
                                    {/* <img width={"auto"} src={preview.dataURL} alt={preview.file.name} srcset="" className={`tooltip_imagen ${ttShow}`} /> */}
                                    <button
                                       className="remove-button"
                                       onClick={(e) => {
                                          e.preventDefault();
                                          handleRemoveImage(preview.file);
                                       }}
                                       onMouseEnter={handleMouseEnter}
                                       onMouseLeave={handleMouseLeave}
                                    >
                                       Eliminar
                                    </button>
                                 </div>
                              ))}
                           </aside>
                        </div>
                     </div>
                     {touched && error && (
                        <FormHelperText error id={`ht-${idName}`}>
                           {error}
                        </FormHelperText>
                     )}
                  </>
               )}
            </Field>
         </FormControl>
      </>
   );
};

const InputFileComponent1 = ({
   idName,
   label,
   placeholder,
   handleChange,
   handleBlur,
   inputProps,
   setFieldValue,
   setImgFile,
   imagePreview,
   setImagePreview,
   error,
   touched
}) => {
   const handleChangeImg = (event) => {
      // if (event.target.files)
      const file = event.target.files[0]; // Obtenemos el primer archivo del campo de entrada
      setImgFile(file);

      if (file) {
         const reader = new FileReader();

         reader.onload = (e) => {
            setImagePreview(e.target.result);
         };

         reader.readAsDataURL(file);
      }
   };

   return (
      <>
         <TextField
            id={idName}
            name={idName}
            label={label}
            type="file"
            // value={value}
            placeholder={placeholder}
            onChange={(e) => {
               handleChange(e);
               handleChangeImg(e, setFieldValue);
            }}
            onBlur={handleBlur}
            variant="standard"
            inputProps={inputProps}
            fullWidth
            // disabled={values.id == 0 ? false : true}
            // inputRef={(el) => (inputsRef.current[0] = el)}
            // inputRef={inputRefVehicle}
            error={error && touched}
            helperText={error && touched && error}
         />

         {/* Vista previa de la imagen */}
         <Box textAlign={"center"} sx={{ bgcolor: "#E9ECEF", borderRadius: "0  0 12px 12px" }}>
            {imagePreview && <img alt="Vista previa de la imagen" src={imagePreview} style={{ maxWidth: 250, maxHeight: 250 }} />}
         </Box>
      </>
   );
};

InputFileComponent.propTypes = {
   idName: propTypes.string.isRequired,
   label: propTypes.string.isRequired,
   inputProps: propTypes.object,
   // filePreviews: propTypes.any.isRequired,
   // setFilePreviews: propTypes.func.isRequired,
   error: propTypes.any,
   touched: propTypes.any,
   multiple: propTypes.bool,
   maxImages: propTypes.number
};

export default InputFileComponent;
