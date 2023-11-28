# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh



> COMANDOS DE INSTALACION

# crear proyecto de react + vite
````bash 
npm create vite@latest  
````


# instalar Material UI - emotion/react - emotion/styled
````bash 
npm install @mui/material @emotion/react @emotion/styled @emotion/cache
npm install @mui/system @tabler/icons @mui/utils 
npm install apexcharts react-apexcharts framer-motion material-ui-popup-state prop-types
````

# instalar fuente Roboto
````bash 
npm install @fontsource/roboto
````

# importar fuentes en el main.jsx
````bash 
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
````

# instalar icons de MaterialUI
````bash 
npm install @mui/icons-material
````

# opcional, opcional para poder utilizar componentes que aun no estan en produccion, entre ellos el <LoadingButton>
````bash 
npm install @mui/lab
````

# acoplar plantilla Admin de Material UI
- agregar en "dependencies": {
   "@emotion/cache": "^11.9.3",
   "@mui/icons-material": "^5.8.4", //no confirmado
   "@mui/system": "^5.8.6", //no confirmado
   "@mui/utils": "^5.8.6", //no confirmado
   "@tabler/icons": "^1.72.0",
   "apexcharts": "^3.35.3",
   "framer-motion": "^6.3.16",
   "material-ui-popup-state": "^4.0.1",
   "prop-types": "^15.8.1",
   "react-apexcharts": "^1.4.0",
   "react-device-detect": "^2.2.2",
   "react-perfect-scrollbar": "^1.5.8",
   "react-redux": "^8.0.2", //no confirmado
   "react-router": "6.3.0",
   "react-scripts": "^5.0.1",
   "redux": "^4.2.0", //no confirmado
}

# instalar React-Router-Dom
````bash 
npm install react-router-dom
````

# instalamos react-redux y redux
````bash 
npm install redux
npm install react-redux
````

# instalar react-perfect-scrollbar
````bash 
npm install react-perfect-scrollbar
````

# instalar react-dive-detected
````bash
npm install react-device-detect --save
````

# instalar formulario Formik / Yup
````bash  
npm i formik
npm i yup
````

# instalar FireBase (solo para pruebas de conexion login/register)
````bash
npm install firebase
````