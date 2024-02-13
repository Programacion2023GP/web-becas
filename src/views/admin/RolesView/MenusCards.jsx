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
   const [checkMaster, setCheckMaster] = useState(false);
   const [checksModules, setChecksModules] = useState([]);
   const [checksPages, setChecksPages] = useState([]);
   const [checksPermissions, setChecksPermissions] = useState([]);
   const [checks, setChecks] = useState([]);

   const handleChangeCheckMaster = (e) => {
      console.log("cambio", e.isTrusted);
      // setCheckMaster(!checkMaster);
      const newChecks = checks.map((check) => ({ ...check, isChecked: !checkMaster }));
      setChecks(newChecks);
      setCheckMaster(!checkMaster);
   };

   const handleCheckboxChange = (value) => {
      const newChecks = checks.map((check) => (check.value === value ? { ...check, isChecked: !check.isChecked } : check));
      setChecks(newChecks);

      // Aquí puedes realizar lógica adicional si es necesario.
   };

   const CardMenu = ({ id = 0, title = "", others_permissions = [], isChecked }) => {
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

            <Masonry columns={4} spacing={2} sx={{ backgroundColor: "white", p: 0, m: 0, textAlign: "center" }}>
               {/* <Grid container spacing={2} sx={{ backgroundColor: "white" }}> */}
               <FormControlLabel
                  value={`read@${id}`}
                  control={<Checkbox checked={isChecked} onChange={() => handleCheckboxChange(value)} />}
                  label="Ver"
                  labelPlacement="bottom"
               />
               <FormControlLabel
                  value={`create@${id}`}
                  control={<Checkbox checked={isChecked} onChange={() => handleCheckboxChange(value)} />}
                  label="Crear"
                  labelPlacement="bottom"
               />
               <FormControlLabel
                  value={`update@${id}`}
                  control={<Checkbox checked={isChecked} onChange={() => handleCheckboxChange(value)} />}
                  label="Editar"
                  labelPlacement="bottom"
               />
               <FormControlLabel
                  value={`delete@${id}`}
                  control={<Checkbox checked={isChecked} onChange={() => handleCheckboxChange(value)} />}
                  label="Eliminar"
                  labelPlacement="bottom"
               />
               {others_permissions.map((op, opIndex) => (
                  <FormControlLabel
                     key={`COP_${id}_${opIndex}`}
                     value={`${op}`}
                     control={<Checkbox checked={isChecked} onChange={() => handleCheckboxChange(value)} />}
                     label={op.split("@").reverse()[0]}
                     labelPlacement="bottom"
                     // isChecked={checks.some((check) => check.value === op && check.isChecked)}
                  />
               ))}
               {/* </Grid> */}
            </Masonry>
         </Card>
      );
   };

   const CardHeaderMenu = ({ id = 0, title = "", children = [], isChecked }) => {
      // const _checksModules = [...checksModules];
      // console.log(_checksModules);
      // setChecksModules(_checksModules);
      return (
         <Card sx={{ p: 0 }} className={classes.cardHeader}>
            <Box textAlign={"center"} mb={1}>
               <FormControlLabel
                  value={`menu@${id}`}
                  control={<Checkbox checked={isChecked} onChange={() => handleCheckboxChange(value)} />}
                  label={
                     <Typography variant="h3" className={classes.titleHeader}>
                        {title.toUpperCase()}
                     </Typography>
                  }
                  labelPlacement="start"
               />
            </Box>

            <Masonry columns={children.length == 1 ? 1 : 2} spacing={2} sx={{ backgroundColor: "white", p: 0, m: 0 }}>
               {children.map((m) => (
                  <CardMenu
                     key={`CMC_${m.id}`}
                     id={m.id}
                     title={m.title}
                     others_permissions={m.others_permissions}
                     isChecked={checks.some((check) => check.value === 1 && check.isChecked)}
                  />
               ))}
            </Masonry>
         </Card>
      );
   };

   useEffect(() => {
      // console.log("menus para permisos", menus);
      console.log("checks para permisos", checks);
   }, [checks]);

   return (
      <>
         <Box textAlign={"center"} mb={2}>
            <FormControlLabel
               value={`todas`}
               control={<Checkbox checked={checkMaster} onChange={handleChangeCheckMaster} />}
               label={
                  <Typography variant="h1" className={classes.title}>
                     {"MENUS"}
                  </Typography>
               }
               labelPlacement="start"
            />
         </Box>
         <Box sx={{ width: "100%", height: "60vh", overflowY: "auto" }}>
            <Masonry columns={3} spacing={2}>
               {menus.map((m) => (
                  <CardHeaderMenu
                     key={`CM_${m.id}`}
                     id={m.id}
                     title={m.title}
                     children={m.children}
                     isChecked={checks.some((check) => check.value === m.id && check.isChecked)}
                  />
               ))}
            </Masonry>
         </Box>
      </>
   );
};
export default MenusCards;