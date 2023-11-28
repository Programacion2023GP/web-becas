import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import * as serviceWorker from "./config/serviceWorker.js";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "./index.css";

import { Provider } from "react-redux";
import { store } from "./config/store/index.js";
import { SnackbarProvider } from "notistack";
import { GlobalContextProvider } from "./context/GlobalContext.jsx";
import AuthContextProvider from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
   <React.StrictMode>
      <Provider store={store}>
         <SnackbarProvider maxSnack={5} anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
            <GlobalContextProvider>
               <AuthContextProvider>
                  <App />
               </AuthContextProvider>
            </GlobalContextProvider>
         </SnackbarProvider>
      </Provider>
   </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
