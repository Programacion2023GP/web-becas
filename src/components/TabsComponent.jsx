import PropTypes from "prop-types";
// import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { cloneElement, useState } from "react";
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

export default function TabsComponent({
   TabsTitles = [],
   TabsContainer = [],
   errors,
   handleBlur,
   handleChange,
   handleSubmit,
   isSubmitting,
   touched,
   values,
   resetForm,
   setFieldValue,
   setValues
}) {
   const theme = useTheme();
   const [tabValue, setTabValue] = useState(0);

   const handleChangeTab = (event, newValue) => {
      setTabValue(newValue);
   };

   const handleChangeIndex = (index) => {
      setTabValue(index);
   };

   const onSubmit = () => {
      console.log("soy el onSubmit");
   };

   return (
      <Box sx={{ bgcolor: "background.paper", width: "100%" }} component={"form"} onSubmit={handleSubmit}>
         <AppBar position="static">
            <Tabs
               value={tabValue}
               onChange={handleChangeTab}
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
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  // loadingPosition="start"
                  variant="contained"
                  fullWidth={false}
                  sx={{ width: "auto" }}
                  size="large"
               >
                  {"GUARDAR CONFIGURACIÓN"}
               </LoadingButton>
            </Tabs>
         </AppBar>
         {/* <SwipeableViews axis={theme.direction === "rtl" ? "x-reverse" : "x"} index={value} onChangeIndex={handleChangeIndex}> */}
         {TabsContainer.map((container, index) => (
            <TabPanel key={`container_${index}`} value={tabValue} index={index} dir={theme.direction}>
               {console.log("values", values)}
               {cloneElement(container, { values, handleBlur, handleChange, errors, touched, resetForm, setFieldValue, setValues })}
            </TabPanel>
         ))}
         {/* </SwipeableViews> */}
      </Box>
   );
}
