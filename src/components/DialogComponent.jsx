import {
   Box,
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogTitle,
   FormControl,
   FormControlLabel,
   InputLabel,
   MenuItem,
   Select
} from "@mui/material";
import { useEffect, useState } from "react";

const DialogComponent = ({ openDialog = false, setOpenDialog, title = "aqui va el titulo", content = "aqui va el contenido", actions = "botones" }) => {
   // const [openDialog, setOpenDialog] = useState(open);
   console.log("hola, este es el open", openDialog);

   // const handleClickOpen = () => {
   //    console.log("clickk");
   //    setOpenDialog(true);
   // };
   // const handleClose = () => {
   //    setOpenDialog(false);
   // };

   // useEffect(() => {}, [openDialog]);

   return (
      <Dialog maxWidth={"lg"} open={openDialog} onClose={() => setOpenDialog(false)}>
         <DialogTitle>{title}</DialogTitle>
         <DialogContent>
            <DialogContentText>You can set my maximum width and whether to adapt or not.</DialogContentText>
            <Box
               noValidate
               component="form"
               sx={{
                  display: "flex",
                  flexDirection: "column",
                  m: "auto",
                  width: "fit-content"
               }}
            >
               {content}
            </Box>
         </DialogContent>
         <DialogActions>
            {actions}
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
         </DialogActions>
      </Dialog>
   );
};

export default DialogComponent;
