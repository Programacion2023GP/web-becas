import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Card, CardContent, CardHeader, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { Title } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { useRoleContext } from "../../../context/RoleContext";
import { useMenuContext } from "../../../context/MenuContext";
import { Box } from "@mui/system";
import { useEffect, useLayoutEffect, useState } from "react";
import { Masonry } from "@mui/lab";

const useStyles = makeStyles((theme) => ({
   title: { color: "#1E2126" },

   cardHeader: { border: "2px solid #525C6A", backgroundColor: "#525C6A" },
   titleHeader: { color: "whitesmoke" },

   cardChildren: { border: "1px solid #c2cddd", backgroundColor: "#c2cddd" },
   titleChildren: { color: "#1E2126" }
}));

const MenusCards = () => {
   const classes = useStyles();
   const { roleSelect, setRoleSelect, showRoleSelect } = useRoleContext();
   const { menus, setMenus, getMenus } = useMenuContext();
   const [headerMenus, setHeaderMenus] = useState([]);
   const [childrenMenus, setChildrenMenus] = useState([]);

   const CardMenu = ({ id = 0, title = "" }) => {
      return (
         <Card sx={{ p: 0 }} className={classes.cardChildren}>
            <Grid xs={12} sx={{ m: 0 }}>
               <FormControlLabel
                  value={`read@${id}`}
                  control={<Checkbox defaultChecked />}
                  label={
                     <Typography variant="h3" className={classes.titleChildren}>
                        {title}
                     </Typography>
                  }
                  labelPlacement="start"
               />
            </Grid>

            <Grid container spacing={2} sx={{ backgroundColor: "white" }}>
               <Grid xs={"auto"} sx={{ m: 0 }}>
                  <FormControlLabel value={`read@${id}`} control={<Checkbox defaultChecked={true} />} label="Ver" labelPlacement="bottom" />
               </Grid>
               <Grid xs={"auto"} sx={{ m: 0 }}>
                  <FormControlLabel value={`create@${id}`} control={<Checkbox defaultChecked={true} />} label="Crear" labelPlacement="bottom" />
               </Grid>
               <Grid xs={"auto"} sx={{ m: 0 }}>
                  <FormControlLabel value={`update@${id}`} control={<Checkbox defaultChecked={true} />} label="Editar" labelPlacement="bottom" />
               </Grid>
            </Grid>
         </Card>
      );
   };

   const CardHeaderMenu = ({ id = 0, title = "", children = [] }) => {
      return (
         <Card sx={{ p: 1 }} className={classes.cardHeader}>
            <Box textAlign={"center"} mb={1}>
               <FormControlLabel
                  value={`menu@${id}`}
                  control={<Checkbox defaultChecked />}
                  label={
                     <Typography variant="h3" className={classes.titleHeader}>
                        {title.toUpperCase()}
                     </Typography>
                  }
                  labelPlacement="start"
               />
            </Box>

            <Grid container spacing={2} sx={{ backgroundColor: "white" }}>
               {children.map((m) => (
                  <Grid xs={12} sx={{ mb: 1 }}>
                     <CardMenu key={`CMC_${m.id}`} id={m.id} title={m.title} />
                  </Grid>
               ))}
            </Grid>
         </Card>
      );
   };

   useEffect(() => {
      console.log("menus para permisos", menus);
   }, []);

   return (
      <>
         <Box textAlign={"center"} mb={2}>
            <FormControlLabel
               value={`todas`}
               control={<Checkbox defaultChecked />}
               label={
                  <Typography variant="h1" className={classes.title}>
                     {"MENUS"}
                  </Typography>
               }
               labelPlacement="start"
            />
         </Box>
         {/* <Grid container spacing={2}> */}
         <Box sx={{ width: "100%", height: "60vh", overflowY: "auto" }}>
            <Masonry columns={3} spacing={2}>
               {menus.map((m) => (
                  <Grid key={m.id} xs={12} md={6} sx={{ mb: 1 }}>
                     <CardHeaderMenu key={`CM_${m.id}`} id={m.id} title={m.title} children={m.children} />
                  </Grid>
               ))}
            </Masonry>
            {/* </Grid> */}
         </Box>
      </>
   );
};
export default MenusCards;
