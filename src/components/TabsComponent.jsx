import PropTypes from "prop-types";
// import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState } from "react";
import { Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";

function TabPanel(props) {
   const { children, value, index, ...other } = props;

   return (
      <div role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`} {...other}>
         {value === index && (
            <Box sx={{ p: 3 }}>
               <Typography>{children}</Typography>
            </Box>
         )}
      </div>
   );
}

TabPanel.propTypes = {
   children: PropTypes.node,
   index: PropTypes.number.isRequired,
   value: PropTypes.number.isRequired
};

function a11yProps(index) {
   return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`
   };
}

export default function TabsComponent({ TabsTitles = [], TabsContainer = [] }) {
   const theme = useTheme();
   const [value, setValue] = useState(0);

   const handleChange = (event, newValue) => {
      setValue(newValue);
   };

   const handleChangeIndex = (index) => {
      setValue(index);
   };

   return (
      <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
         <AppBar position="static">
            <Tabs
               value={value}
               onChange={handleChange}
               sx={{ backgroundColor: "green" }}
               indicatorColor="secondary"
               textColor="inherit"
               variant="fullWidth"
               aria-label="full width tabs example"
            >
               {TabsTitles.map((title, index) => (
                  <Tab key={`title_${index}`} label={title} {...a11yProps(index)} />
               ))}
               <LoadingButton
                  type="submit"
                  // disabled={isSubmitting}
                  // loading={isSubmitting}
                  // loadingPosition="start"
                  variant="contained"
                  fullWidth={false}
                  sx={{ width: "auto" }}
                  size="large"
               >
                  {"GUARDAR CONFIGURACIÓN"}
               </LoadingButton>
               {/* <Button color="info" variant="contained" sx={{ width: "auto" }}>
                  GUARDAR CONFIGURACIÓN
               </Button> */}
            </Tabs>
         </AppBar>
         {/* <SwipeableViews axis={theme.direction === "rtl" ? "x-reverse" : "x"} index={value} onChangeIndex={handleChangeIndex}> */}
         {TabsContainer.map((container, index) => (
            <TabPanel key={`container_${index}`} value={value} index={index} dir={theme.direction}>
               {container}
            </TabPanel>
         ))}
         {/* </SwipeableViews> */}
      </Box>
   );
}
