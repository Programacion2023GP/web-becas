// import MaterialTable from "material-table";
// import TableIcons from "./MaterialTableIcons";
// import { esES } from "@material-ui/core/locale";
// import "date-fns/locale/es"; // Importa el idioma español
// import { useEffect, useState } from "react";
// import { Button, ButtonGroup, Tooltip } from "@mui/material";
// import { IconEdit } from "@tabler/icons";
// import IconDelete from "../icons/IconDelete";
// import { useGlobalContext } from "../../context/GlobalContext";
// import withReactContent from "sweetalert2-react-content";
// import Swal from "sweetalert2";
// import Toast from "../../utils/Toast";
// import { QuestionAlertConfig } from "../../utils/sAlert";

// /**
//  *
//  * @param {*} columns [{title: "Encabezado", field: "referencia", render?: (rowData) => <img src={rowData.imageUrl} style={{ width: 40, borderRadius: "5%" }} /> }]
//  * @param {*} data [{nameField: "value"}]
//  * @returns
//  */
export const TableComponent = ({ columns, data, singularName, addBtnsDefault }) => {
   return "TablaComponent";
};
//    const [dataRows, setDataRows] = useState([]);
//    const { setLoadingAction, setOpenDialog } = useGlobalContext();

//    // const { singularName, showUser, deleteUser, setTextBtnSumbit, setFormTitle } = useUserContext();

//    const mySwal = withReactContent(Swal);

//    const handleClickEdit = async (id) => {
//       try {
//          setLoadingAction(true);
//          // setTextBtnSumbit("GUARDAR");
//          // setFormTitle(`EDITAR ${singularName.toUpperCase()}`);
//          // await showUser(id);
//          setOpenDialog(true);
//          setLoadingAction(false);
//       } catch (error) {
//          console.log(error);
//          Toast.Error(error);
//       }
//    };

//    const handleClickDelete = async (id, name) => {
//       try {
//          mySwal.fire(QuestionAlertConfig(`Estas seguro de eliminar a "${name}"`)).then(async (result) => {
//             if (result.isConfirmed) {
//                setLoadingAction(true);
//                const axiosResponse = await deleteUser(id);
//                setLoadingAction(false);
//                Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
//             }
//          });
//       } catch (error) {
//          console.log(error);
//          Toast.Error(error);
//       }
//    };

//    const ButtonsAction = ({ id, name }) => {
//       return (
//          <ButtonGroup variant="outlined">
//             <Tooltip title={`Editar ${singularName}`} placement="top">
//                <Button color="info" onClick={() => handleClickEdit(id)}>
//                   <IconEdit />
//                </Button>
//             </Tooltip>
//             <Tooltip title={`Eliminar ${singularName}`} placement="top">
//                <Button color="error" onClick={() => handleClickDelete(id, name)}>
//                   <IconDelete />
//                </Button>
//             </Tooltip>
//          </ButtonGroup>
//       );
//    };

//    useEffect(() => {
//       // console.log("data", data);
//       if (addBtnsDefault) {
//          const datas = data.map((obj) => {
//             return { ...obj, actions: <ButtonsAction id={obj.id} name={obj.folio} /> };
//          });
//          setDataRows(datas);
//       } else setDataRows(data);
//       console.log("dataRows", dataRows);
//    }, [data]);

//    return (
//       <MaterialTable
//          title=""
//          localization={esES}
//          icons={TableIcons}
//          columns={columns}
//          data={dataRows}
//          options={{ exportButton: true }}
//          components={{
//             Action: (props) => <button onClick={(event) => props.action.onClick(event, props.data)}>Custom Delete Button</button>
//          }}
//       />
//    );
// };
