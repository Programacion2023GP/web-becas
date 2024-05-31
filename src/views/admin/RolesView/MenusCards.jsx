/// import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Grid, Backdrop, Card, CardContent, CardHeader, Checkbox, CircularProgress, FormControlLabel, Typography } from "@mui/material";
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

const CardMenu = ({ id = 0, title = "", others_permissions = [], checkMenus, handleCheckboxChange, isChecked }) => {
   const classes = useStyles();
   // console.log("others_permissions", others_permissions);
   // console.log("isChecked", isChecked);
   return (
      <Card sx={{ p: 0 }} className={classes.cardChildren}>
         <Grid item xs={12} sx={{ m: 0 }}>
            <FormControlLabel
               value={`${id}@page`}
               id={`${id}@page`}
               control={<Checkbox checked={isChecked} onChange={(e) => handleCheckboxChange(e.target)} />}
               label={
                  <Typography variant="h3" className={classes.titleChildren}>
                     {title}
                  </Typography>
               }
               labelPlacement="start"
            />
         </Grid>
         <Masonry columns={3} spacing={2} sx={{ backgroundColor: "white", p: 0, m: 0, textAlign: "center" }}>
            <FormControlLabel
               value={`${id}@read`}
               id={`${id}@read`}
               control={<Checkbox checked={checkMenus.some((check) => check.id === id && check.permissions.read)} onChange={(e) => handleCheckboxChange(e.target)} />}
               label="Ver"
               labelPlacement="bottom"
            />
            <FormControlLabel
               value={`${id}@create`}
               id={`${id}@create`}
               control={
                  <Checkbox checked={checkMenus.some((check) => check.id === id && check.permissions.create)} onChange={(e) => handleCheckboxChange(e.target)} />
               }
               label="Crear"
               labelPlacement="bottom"
            />
            <FormControlLabel
               value={`${id}@update`}
               id={`${id}@update`}
               control={
                  <Checkbox checked={checkMenus.some((check) => check.id === id && check.permissions.update)} onChange={(e) => handleCheckboxChange(e.target)} />
               }
               label="Editar"
               labelPlacement="bottom"
            />
            <FormControlLabel
               value={`${id}@delete`}
               id={`${id}@delete`}
               control={
                  <Checkbox checked={checkMenus.some((check) => check.id === id && check.permissions.delete)} onChange={(e) => handleCheckboxChange(e.target)} />
               }
               label="Eliminar"
               labelPlacement="bottom"
            />
            {others_permissions.map((op, opIndex) => (
               <FormControlLabel
                  key={`COP_${id}_${opIndex}`}
                  value={`${op}`}
                  id={`${op}`}
                  control={
                     <Checkbox
                        checked={checkMenus.some(
                           (check) => check.id === id && (check.permissions.more_permissions.includes(`${op}`) || check.permissions.more_permissions.includes("todas"))
                        )}
                        onChange={(e) => handleCheckboxChange(e.target)}
                     />
                  }
                  label={op.split("@")[1]}
                  labelPlacement="bottom"
               />
            ))}
         </Masonry>
      </Card>
   );
};

const CardHeaderMenu = ({ id = 0, title = "", children = [], checkMenus, handleCheckboxChange, isChecked }) => {
   const classes = useStyles();
   // const _checksModules = [...checksModules];
   // console.log(_checksModules);
   // setChecksModules(_checksModules);
   return (
      <Card sx={{ p: 0 }} className={classes.cardHeader}>
         <Box textAlign={"center"} mb={1}>
            <FormControlLabel
               value={`${id}@menu`}
               id={`${id}@menu`}
               control={<Checkbox checked={isChecked} onChange={(e) => handleCheckboxChange(e.target)} />}
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
                  checkMenus={checkMenus}
                  handleCheckboxChange={handleCheckboxChange}
                  isChecked={checkMenus.some((check) => check.id === m.id && check.isChecked)}
               />
            ))}
         </Masonry>
      </Card>
   );
};

// const checkMenus = {};
const MenusCards = ({ loadPermissions }) => {
   const classes = useStyles();
   const { roleSelect, setRoleSelect, showRoleSelect } = useRoleContext();
   const { menus, setMenus, getMenus, checkMenus, setCheckMenus, checkMaster, setCheckMaster } = useMenuContext();
   const [headerMenus, setHeaderMenus] = useState([]);
   const [childrenMenus, setChildrenMenus] = useState([]);
   const [checksModules, setChecksModules] = useState([]);
   const [checksPages, setChecksPages] = useState([]);
   const [checksPermissions, setChecksPermissions] = useState([]);
   // const [checks, setChecks] = useState([]);

   const handleChangeCheckMaster = (e) => {
      // console.log("cambio", e.target.checked);
      const isChecked = e.target.checked;
      const _checkMenus = checkMenus.map((check) => {
         check.isChecked = isChecked;
         check.permissions = isChecked
            ? { read: true, create: true, update: true, delete: true, more_permissions: ["todas"] }
            : { read: false, create: false, update: false, delete: false, more_permissions: [] };
         // check.permissions = isChecked ? ["todas"] : [];
         return check;
      });
      setCheckMaster(!checkMaster);
      setCheckMenus(_checkMenus);
      // console.log("checkMaster", checkMaster);
   };

   const handleCheckboxChange = (target) => {
      const id = target.value.split("@")[0];
      let value = target.value.split("@")[1];
      if (!["menu", "page", "read", "create", "update", "delete"].includes(value)) value = target.value;
      const isChecked = target.checked;
      // console.log("handleCheckboxChange()->id", id);
      // console.log("handleCheckboxChange()->value", value);
      // console.log("handleCheckboxChange()->isChecked", isChecked);
      let _checkMenus = [...checkMenus];
      // console.log("_checkMenus", _checkMenus);
      _checkMenus = _checkMenus.map((check) => {
         if (Number(check.id) === Number(id)) {
            // console.log(value);
            if (["menu", "page"].includes(value)) check.isChecked = isChecked;
            // console.log("value", value);
            // if (!["menu"].includes(value)) {
            // if (!check.permissions.includes(value)) check.permissions.push(value);
            if (value === "menu") check.permissions.read = isChecked;
            if (value === "page") check.permissions.read = isChecked;
            if (value === "read") check.permissions.read = isChecked;
            if (value === "create") check.permissions.create = isChecked;
            if (value === "update") check.permissions.update = isChecked;
            if (value === "delete") check.permissions.delete = isChecked;
            // }
            if (!["menu", "page"].includes(value)) {
               if (!["read", "create", "update", "delete"].includes(value)) {
                  if (isChecked) {
                     if (!check.permissions.more_permissions.includes(value)) check.permissions.more_permissions.push(value);
                  } else {
                     // console.log("quitar permiso:", value);
                     // console.log("check.permissions.more_permissions", check.permissions.more_permissions);
                     // if (check.permissions.more_permissions == ["todas"]) console.log("tiene todas");
                     const new_more_permissions = check.permissions.more_permissions.filter((permission) => permission !== value);
                     check.permissions.more_permissions = new_more_permissions;
                  }
               }
            }
         }
         return check;
      });
      // console.log("_checkMenus", _checkMenus);
      setCheckMenus(_checkMenus);

      // console.log("checkMenus", checkMenus);
   };

   useEffect(() => {
      // console.log("menus para permisos", menus);
      // console.log("checks para permisos", checkMenus);
      // console.log(menus);
   }, []);

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
         <Box sx={{ width: "100%", height: "60vh", overflowY: loadPermissions ? "hidden" : "auto", position: "relative" }}>
            <Masonry columns={3} spacing={2}>
               {menus.map((m) => (
                  <CardHeaderMenu
                     key={`CM_${m.id}`}
                     id={m.id}
                     title={m.title}
                     children={m.children}
                     // isChecked={checks.map((check) => index == m.id && !check)}
                     checkMenus={checkMenus}
                     handleCheckboxChange={handleCheckboxChange}
                     isChecked={checkMenus.some((check) => check.id === m.id && check.isChecked)}
                  />
               ))}
            </Masonry>
            {true && (
               // <Box sx={{ position: "absolute", top: 0, left: 0, backgroundColor: "#000000c0", width: "100%", height: "1000%", overflowY: "hidden", ":disabled": false }}
               <Backdrop
                  sx={{ color: "#fff", position: "absolute", height: "auto", zIndex: (theme) => theme.zIndex.drawer + 1000000, backgroundColor: "#000000c0" }}
                  open={loadPermissions}
               >
                  <CircularProgress disableShrink size={150} sx={{ position: "fixed", top: "50%", left: "53%", zIndex: 10 }} />
               </Backdrop>
            )}
         </Box>
      </>
   );
};
export default MenusCards;
