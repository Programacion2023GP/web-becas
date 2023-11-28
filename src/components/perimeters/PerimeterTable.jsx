import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { Button, ButtonGroup, Tooltip } from "@mui/material";
import IconEdit from "../icons/IconEdit";
import IconDelete from "../icons/IconDelete";

import { usePerimeterContext } from "../../context/PerimeterContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import sAlert, { QuestionAlertConfig } from "../../utils/sAlert";
import Toast from "../../utils/Toast";
import { useGlobalContext } from "../../context/GlobalContext";

const muiCache = createCache({
   key: "mui-datatables",
   prepend: true
});

const PerimeterTable = () => {
   const [responsive, setResponsive] = useState("vertical");
   const [tableBodyHeight, setTableBodyHeight] = useState("61vh");
   const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("58vh");
   const [searchBtn, setSearchBtn] = useState(true);
   const [downloadBtn, setDownloadBtn] = useState(true);
   const [printBtn, setPrintBtn] = useState(true);
   const [viewColumnBtn, setViewColumnBtn] = useState(true);
   const [filterBtn, setFilterBtn] = useState(true);

   const { setLoading, setLoadingAction } = useGlobalContext();
   const { perimeters, showPerimeter, deletePerimeter, setTextBtnSumbit, setFormTitle } = usePerimeterContext();

   const mySwal = withReactContent(Swal);

   const handleClickEdit = async (id) => {
      try {
         setLoadingAction(true);
         setTextBtnSumbit("GUARDAR");
         setFormTitle("EDITAR NIVEL");
         const axiosResponse = await showPerimeter(id);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDelete = async (id, name) => {
      try {
         mySwal.fire(QuestionAlertConfig(`Estas seguro de eliminar a ${name}`)).then(async (result) => {
            if (result.isConfirmed) {
               setLoadingAction(true);
               const axiosResponse = await deletePerimeter(id);
               setLoadingAction(false);
               Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
            }
         });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const options = {
      search: searchBtn,
      download: downloadBtn,
      print: printBtn,
      viewColumns: viewColumnBtn,
      filter: filterBtn,
      filterType: "dropdown",
      responsive,
      tableBodyHeight,
      tableBodyMaxHeight,
      onTableChange: (action, state) => {
         // console.log("onTableChange-action:", action);
         // console.dir("onTableChange-state:", state);
      }
   };

   // const columns = [{ name: "Clave", options: { filterOptions: { fullWidth: true } } }, "Title", "Location", "Acciones"];
   const columns = ["Perímetro", "Acciones"];

   const ButtonsAction = ({ id, name }) => {
      return (
         <ButtonGroup variant="outlined">
            <Tooltip title={"Editar Perímetro"} placement="top">
               <Button color="info" onClick={() => handleClickEdit(id)}>
                  <IconEdit />
               </Button>
            </Tooltip>
            <Tooltip title={"Eliminar Perímetro"} placement="top">
               <Button color="error" onClick={() => handleClickDelete(id, name)}>
                  <IconDelete />
               </Button>
            </Tooltip>
         </ButtonGroup>
      );
   };

   const data = [];
   const chargerData = async () => {
      try {
         // console.log("cargar listado", perimeters);
         await perimeters.map((obj) => {
            // console.log(obj);
            const register = [];
            register.push(obj.perimeter);
            register.push(<ButtonsAction id={obj.id} name={obj.perimeter} />);
            data.push(register);
         });
         setLoading(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };
   // useEffect(() => {
   chargerData();
   // }, [perimeters]);

   return (
      <>
         <CacheProvider value={muiCache}>
            <ThemeProvider theme={createTheme()}>
               <MUIDataTable title={"Listado de Perímetros"} data={data} columns={columns} options={options} />
            </ThemeProvider>
         </CacheProvider>
      </>
   );
};
export default PerimeterTable;
