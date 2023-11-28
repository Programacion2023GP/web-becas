import { Backdrop } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Axios } from "../context/AuthContext";
import { CorrectRes, ErrorRes } from "../utils/Response";

// export const useFetch = (method, url, data) => {
//    const [response, setResponse] = useState(CorrectRes);
//    const [loading, setLoading] = useState(true);
//    const [error, setError] = useState(null);

//    const getData = useCallback(
//       async (method, url, data = null) => {
//          try {
//             console.log("hacer peticion");
//             // <Backdrop open={loading} />;
//             let axiosData = null;
//             if (method == "get") axiosData = await Axios.get(url);
//             else if (method == "post") axiosData = await Axios.post(url, data);
//             else if (method == "put") axiosData = await Axios.put(url, data);
//             else if (method == "delete") axiosData = await Axios.delete(url);
//             // setResponse([...response], res.data.schools = axiosData.data.data.result);

//             console.log("peticion realizada");
//             // console.log(res);

//             // return res;
//          } catch (error) {
//             const res = ErrorRes;
//             console.log(error);
//             res.message = error;
//             res.alert_text = error;
//             setError(error.message);
//             // return res;
//          } finally {
//             setLoading(false);
//          }
//       },
//       [url]
//    );

//    const getDataFetch = useCallback(async () => {
//       setLoading(true);
//       try {
//          const response = await fetch(url);
//          if (!response.ok) {
//             throw new Error("Error fetching data");
//          }
//          const data = await response.json();
//          setData(data);
//       } catch (error) {
//          setError(error.message);
//       } finally {
//          setLoading(false);
//       }
//    }, [url]);

//    useEffect(() => {
//       console.log("el useEffect del Fetch");
//       getData(method, url, data);
//    }, [getData]);

//    return response;
// };

export const useAxios = async (method, url, data = null) => {
   let res = CorrectRes;
   try {
      console.log("hacer peticion");
      let axiosData = null;
      if (method == "get") axiosData = await Axios.get(url);
      else if (method == "post") axiosData = await Axios.post(url, data);
      else if (method == "put") axiosData = await Axios.put(url, data);
      else if (method == "delete") axiosData = await Axios.delete(url);
      res = axiosData.data.data;

      console.log("peticion realizada", axiosData);
      // console.log(res);

      // return res;
   } catch (error) {
      res = ErrorRes;
      console.log(error);
      res.message = error;
      res.alert_text = error;
      // setError(error.message);
      // return res;
   } finally {
      // setLoading(false);
   }
   return res;
};
