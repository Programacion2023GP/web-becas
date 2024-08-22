import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import Typography from "@mui/material/Typography";
import { forwardRef, useEffect, useLayoutEffect, useState } from "react";
import { Box, DialogActions, IconButton, Toolbar, Tooltip } from "@mui/material";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { IconWindowMaximize, IconWindowMinimize, IconX } from "@tabler/icons";
import { useAuthContext } from "../context/AuthContext";
import { gpcDark, gpcLight, useGlobalContext } from "../context/GlobalContext";
import { height } from "@mui/system";
import { LoadingButton } from "@mui/lab";
import { isMobile } from "react-device-detect";

const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="down" ref={ref} {...props} />;
});
export const ModalComponent = ({
   children,
   open,
   setOpen,
   modalTitle = "",
   maxWidth = "lg",
   height,
   dialogActions = null,
   formikRef,
   textBtnSubmit,
   fullScreen = isMobile ? true : false
}) => {
   const { auth } = useAuthContext();
   const mySwal = withReactContent(Swal);
   const [fullScreenDialog, setFullScreenDialog] = useState(fullScreen);
   const { setLoadingAction } = useGlobalContext();

   const handleClose = () => {
      setOpen(false);
   };

   useEffect(() => {
      // console.log("formikRef", formikRef);
      // console.log("estoy en el modal", voucher);
   }, []);
   useLayoutEffect(() => {
      // console.log("estoy en el useLayoutEffect", drivers);
   }, []);

   return (
      <div>
         <Dialog
            open={open}
            TransitionComponent={Transition}
            maxWidth={maxWidth}
            keepMounted
            fullWidth
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            sx={{ backgroundColor: "transparent" }}
            fullScreen={fullScreenDialog}
         >
            <DialogTitle my={0} py={0} sx={{ backgroundColor: "wheat", color: gpcDark }}>
               <Toolbar sx={{ py: 0 }}>
                  <Typography variant="h2" my={0} py={0} color={gpcDark} sx={{ ml: 2, flex: 1, py: 0, pt: 0, pb: 0, padding: "0px 24px !important" }}>
                     {modalTitle}
                  </Typography>
                  {/* <Typography sx={{ ml: 2, flex: 1 }} variant="h3" component="div">
                  {"title"}
               </Typography> */}
                  {/* <Tooltip title={`Exportar Reporte a PDF`} placement="top">
                  <IconButton color="inherit" onClick={() => downloadPDF("reportPaper")}>
                     <IconFileTypePdf color="red" />
                  </IconButton>
               </Tooltip>
               <Tooltip title={`Imprimir Reporte`} placement="top">
                  <IconButton color="inherit" onClick={() => printContent("reportPaper")}>
                     <IconPrinter />
                  </IconButton>
               </Tooltip> */}
                  <Tooltip title={fullScreenDialog ? `Minimizar ventana` : `Maximizar ventana`} placement="top">
                     <IconButton color="inherit" onClick={() => setFullScreenDialog(!fullScreenDialog)}>
                        {fullScreenDialog ? <IconWindowMinimize /> : <IconWindowMaximize />}
                     </IconButton>
                  </Tooltip>
                  <Tooltip title={`Cerrar ventana`} placement="top">
                     <IconButton edge="end" color="inherit" onClick={() => setOpen(false)} aria-label="close">
                        <IconX />
                     </IconButton>
                  </Tooltip>
               </Toolbar>
            </DialogTitle>
            <DialogContent sx={{ pb: 0, marginTop: 2, height: height, maxHeight: "90vh" }}>
               <Box sx={{ mt: 1, height: fullScreenDialog ? "100%" : height, maxHeight: "100%" }}>{children}</Box>
            </DialogContent>
            {dialogActions && (
               <DialogActions>
                  <LoadingButton
                     type="submit"
                     disabled={formikRef.isSubmitting}
                     loading={formikRef.isSubmitting}
                     // loadingPosition="start"
                     variant="contained"
                     fullWidth
                     size="large"
                  >
                     {textBtnSubmit}
                  </LoadingButton>
               </DialogActions>
            )}
         </Dialog>
      </div>
   );
};
