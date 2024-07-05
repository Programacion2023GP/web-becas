import { Card, CardContent, FormControl, FormControlLabel, InputAdornment, OutlinedInput, Radio, RadioGroup, Tooltip } from "@mui/material";
import { IconSearch } from "@tabler/icons";
import { display, shouldForwardProp } from "@mui/system";
import { styled } from "@mui/material/styles";
import { useTheme } from "@emotion/react";
import { useState } from "react";
import { colorPrimaryDark, useGlobalContext } from "../context/GlobalContext";
import { handleInputStringCase } from "../utils/Formats";

const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
   // width: 434,
   // marginLeft: 16,
   // paddingLeft: 16,
   // paddingRight: 16,
   "& input": {
      background: "transparent !important",
      paddingLeft: "4px !important"
   },
   [theme.breakpoints.down("lg")]: {
      width: 250
   },
   [theme.breakpoints.down("md")]: {
      width: "100%",
      marginLeft: 4,
      background: "#fff"
   }
}));
// const HeaderAvatarStyle = styled(Avatar, { shouldForwardProp })(({ theme }) => ({
//    ...theme.typography.commonAvatar,
//    ...theme.typography.mediumAvatar,
//    background: theme.palette.secondary.light,
//    color: theme.palette.secondary.dark,
//    "&:hover": {
//       background: theme.palette.secondary.dark,
//       color: theme.palette.secondary.light
//    }
// }));

// ========================== COMPONENTE ==========================
const SearchInput = ({
   idName,
   backgroundColor,
   titleTooltip,
   positionTooltip,
   search,
   setSearch,
   searchType,
   setSearchType,
   placeholder,
   handleKeyUpSearchSuccess,
   showOptions = true
}) => {
   const theme = useTheme();
   const { setLoading } = useGlobalContext();

   // const [search, setSearch] = useState(vSearch);
   // const [searchType, setSearchType] = useState(vSearchType);

   const handleChangeSearch = (value) => {
      setSearch(value);
   };

   const handleChangeSearchBy = (value) => {
      setSearchType(value);
      setSearch("");
      document.querySelector(`#${idName}`).focus();
      // setTypeInputSearch(value);
   };
   const handleKeyUpSearch = (e) => {
      return handleKeyUpSearchSuccess(e);
   };

   return (
      <Card sx={{ backgroundColor: backgroundColor || "transparent" }}>
         <CardContent>
            {/* <InputLabel id="search-label" sx={{ marginBottom: 2 }}>
                    Buscar Vehículo
                 </InputLabel> */}
            <Tooltip title={titleTooltip || "Presiona ENTER para comenzar la busqueda"} placement={positionTooltip || "top"}>
               <OutlineInputStyle
                  id={idName || "search"}
                  name={idName || "search"}
                  type={searchType || "text"}
                  fullWidth
                  value={search || ""}
                  onInput={(e) => handleInputStringCase(e, setSearch, true)}
                  onChange={(e) => handleChangeSearch(e.target.value)}
                  onKeyUp={(e) => handleKeyUpSearch(e)}
                  placeholder={placeholder || "Buscar vehículo"}
                  startAdornment={
                     <InputAdornment position="start">
                        <IconSearch stroke={2.5} size="1.5rem" color={theme.palette.grey[500]} />
                     </InputAdornment>
                  }
                  aria-describedby={`${search}-helper-text`}
                  inputProps={{ "aria-label": "weight" }}
                  sx={{}}
               />
            </Tooltip>

            {showOptions && (
               <FormControl
                  fullWidth
                  sx={{ color: colorPrimaryDark /* "#1F2227" */, alignItems: "center", backgroundColor: "whitesmoke", borderRadius: "10px", mt: 0.5, p: 0.5 }}
               >
                  <RadioGroup
                     row
                     aria-labelledby="searchType-label"
                     id="searchType"
                     name="searchType"
                     value={searchType}
                     onChange={(e) => handleChangeSearchBy(e.target.value)}
                  >
                     <FormControlLabel value={"number"} control={<Radio />} label="No. de Unidad" />
                     <FormControlLabel value={"text"} control={<Radio />} label="Placas" />
                  </RadioGroup>
               </FormControl>
            )}
         </CardContent>
      </Card>
   );
};

export default SearchInput;
