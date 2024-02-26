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
// const checkMenus = {};
const MenusCards = () => {
   const classes = useStyles();
   const { roleSelect, setRoleSelect, showRoleSelect } = useRoleContext();
   const { menus, setMenus, getMenus, checkMenus, setCheckMenus } = useMenuContext();
   const [headerMenus, setHeaderMenus] = useState([]);
   const [childrenMenus, setChildrenMenus] = useState([]);
   const [checkMaster, setCheckMaster] = useState(false);
   const [checksModules, setChecksModules] = useState([]);
   const [checksPages, setChecksPages] = useState([]);
   const [checksPermissions, setChecksPermissions] = useState([]);
   // const [checks, setChecks] = useState([]);

   const handleChangeCheckMaster = (e) => {
      console.log("cambio", e.target.checked);
      setCheckMaster(!checkMaster);
      console.log("checkMaster", checkMaster);
   };

   const handleCheckboxChange = (target) => {
      const id = target.value.split("@")[1];
      const value = target.value.split("@")[0];
      const isChecked = target.checked;
      console.log("handleCheckboxChange()->id", id);
      console.log("handleCheckboxChange()->value", value);
      console.log("handleCheckboxChange()->isChecked", isChecked);
      let _checkMenus = [...checkMenus];
      console.log("_checkMenus", _checkMenus);
      _checkMenus = _checkMenus.map((check) => {
         if (Number(check.id) === Number(id)) {
            check.isChecked = isChecked;
            if (!["menu", "read"].includes(value)) {
               // agregar permisos...
               check.permissions.push(value);
            }
         }
         return check;
      });
      console.log("_checkMenus", _checkMenus);
      setCheckMenus(_checkMenus);

      console.log("checkMenus", checkMenus);
   };

   const CardMenu = ({ id = 0, title = "", others_permissions = [] }) => {
      return (
         <Card sx={{ p: 0 }} className={classes.cardChildren}>
            <Grid xs={12} sx={{ m: 0 }}>
               <FormControlLabel
                  value={`read@${id}`}
                  control={<Checkbox defaultChecked={false} />}
                  label={
                     <Typography variant="h3" className={classes.titleChildren}>
                        gris bajito - {title}
                     </Typography>
                  }
                  labelPlacement="start"
               />
            </Grid>

            <Masonry columns={4} spacing={2} sx={{ backgroundColor: "white", p: 0, m: 0, textAlign: "center" }}>
               {/* <Grid container spacing={2} sx={{ backgroundColor: "white" }}> */}
               <FormControlLabel
                  value={`read@${id}`}
                  control={<Checkbox defaultChecked onChange={(e) => handleCheckboxChange(e.target.checked)} />}
                  label="Ver"
                  labelPlacement="bottom"
               />
               <FormControlLabel
                  value={`create@${id}`}
                  control={<Checkbox defaultChecked onChange={(e) => handleCheckboxChange(e.target.checked)} />}
                  label="Crear"
                  labelPlacement="bottom"
               />
               <FormControlLabel
                  value={`update@${id}`}
                  control={<Checkbox defaultChecked onChange={(e) => handleCheckboxChange(e.target.checked)} />}
                  label="Editar"
                  labelPlacement="bottom"
               />
               <FormControlLabel
                  value={`delete@${id}`}
                  control={<Checkbox defaultChecked onChange={(e) => handleCheckboxChange(e.target.checked)} />}
                  label="Eliminar"
                  labelPlacement="bottom"
               />
               {others_permissions.map((op, opIndex) => (
                  <FormControlLabel
                     key={`COP_${id}_${opIndex}`}
                     value={`${op}`}
                     control={<Checkbox defaultChecked onChange={(e) => handleCheckboxChange(e.target.checked)} />}
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
                  control={<Checkbox defaultChecked={isChecked} onChange={(e) => handleCheckboxChange(e.target)} />}
                  label={
                     <Typography variant="h3" className={classes.titleHeader}>
                        CardHeaderMenu - {title.toUpperCase()}
                     </Typography>
                  }
                  labelPlacement="start"
               />
            </Box>

            <Masonry columns={children.length == 1 ? 1 : 2} spacing={2} sx={{ backgroundColor: "white", p: 0, m: 0 }}>
               {children.map((m) => {
                  // checks[m.id] = false;
                  // checks.push({id:m.id,})

                  return (
                     <CardMenu
                        key={`CMC_${m.id}`}
                        id={m.id}
                        title={m.title}
                        others_permissions={m.others_permissions}
                        // isChecked={checks.map((check, index) => index == m.id && check)}
                        // isChecked={checks.some((check) => check.value === 1 && check.isChecked)}
                     />
                  );
               })}
            </Masonry>
         </Card>
      );
   };

   useEffect(() => {
      // console.log("menus para permisos", menus);
      console.log("checks para permisos", checkMenus);
      // console.log(menus);
   }, [checkMenus]);

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
               {menus.map((m) => {
                  // checks.push({ id: id, isChecked: false });
                  // checks[m.id] = false;
                  // console.log(checks.map((check, index) => console.log(`menu ${index}: ${Boolean(check)}`)));
                  return (
                     <CardHeaderMenu
                        key={`CM_${m.id}`}
                        id={m.id}
                        title={m.title}
                        children={m.children}
                        // isChecked={checks.map((check) => index == m.id && !check)}
                        isChecked={checkMenus.some((check) => check.id === m.id && check.isChecked)}
                     />
                  );
               })}
            </Masonry>
         </Box>
      </>
   );
};
export default MenusCards;
