// import IconButton from "@mui/material/IconButton";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import * as tablerIcons from "@tabler/icons";

// import { useState } from "react";

// const options = ["None", "Atria", "Callisto", "Dione", "Ganymede", "Hangouts Call", "Luna", "Oberon", "Phobos", "Pyxis", "Sedna", "Titania", "Triton", "Umbriel"];

// const ITEM_HEIGHT = 48;

// export default function IconMenuComponent({ icon = null }) {
//    const [anchorEl, setAnchorEl] = useState(null);
//    const open = Boolean(anchorEl);
//    const handleClick = (event) => {
//       setAnchorEl(event.currentTarget);
//    };
//    const handleClose = () => {
//       setAnchorEl(null);
//    };

//    return (
//       <div>
//          <IconButton
//             aria-label="more"
//             id="long-button"
//             aria-controls={open ? "long-menu" : undefined}
//             aria-expanded={open ? "true" : undefined}
//             aria-haspopup="true"
//             onClick={handleClick}
//          >
//             {icon != null ? icon == "pdf" ? <PictureAsPdfIcon /> : tablerIcons[icon] : <MoreVertIcon />}
//          </IconButton>
//          <Menu
//             id="long-menu"
//             MenuListProps={{
//                "aria-labelledby": "long-button"
//             }}
//             anchorEl={anchorEl}
//             open={open}
//             onClose={handleClose}
//             PaperProps={{
//                style: {
//                   maxHeight: ITEM_HEIGHT * 4.5,
//                   width: "20ch"
//                }
//             }}
//          >
//             {options.map((option) => (
//                <MenuItem key={option} selected={option === "Pyxis"} onClick={handleClose}>
//                   {option}
//                </MenuItem>
//             ))}
//          </Menu>
//       </div>
//    );
// }
