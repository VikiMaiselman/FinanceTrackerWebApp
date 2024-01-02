import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "../../styles/Form.css";

const theme = createTheme({
  palette: {
    transfer: {
      main: "#5f6f52",
      light: "#E9DB5D",
      dark: "#A29415",
      contrastText: "#ffffff",
    },
  },
});

export default function WishForm({ addWish, setShouldShowModal }) {
  const [wishInfo, setWishInfo] = useState({
    wishName: "",
    wishDescription: "",
    imageURL: "",
    dueDate: "",
    neededAmount: "",
    currentAmount: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    const updateTxState = (prevState) => {
      return { ...prevState, [name]: value };
    };

    setWishInfo(updateTxState);
  };

  const handleClick = (event) => {
    event.preventDefault();
    addWish(wishInfo);
    setShouldShowModal(false);
    setWishInfo({
      wishName: "",
      wishDescription: "",
      imageURL: "",
      dueDate: "",
      neededAmount: "",
      currentAmount: "",
    });
  };

  return (
    <form className="Transfer WishForm">
      <div className="Multiple-inputs">
        <input
          onChange={handleChange}
          name="wishName"
          value={wishInfo.wishName}
          placeholder={`Enter wish name...`}
        />

        <input
          onChange={handleChange}
          name="wishDescription"
          value={wishInfo.wishDescription}
          placeholder={`Enter wish description (optional)...`}
        />

        <input
          onChange={handleChange}
          name="imageURL"
          value={wishInfo.imageURL}
          placeholder={`Enter wish image url as "https://..." (optional)...`}
        />

        <input
          onChange={handleChange}
          type="date"
          name="dueDate"
          value={wishInfo.dueDate}
          placeholder={`Enter due date as YYYY-MM-DD...`}
        />

        <input
          onChange={handleChange}
          name="neededAmount"
          value={wishInfo.neededAmount}
          placeholder={`Enter how much it costs...`}
        />

        <ThemeProvider theme={theme}>
          <Button
            onClick={handleClick}
            variant="contained"
            color="transfer"
            sx={{ marginTop: "2.5%" }}
          >
            <AddIcon fontSize="small" />
            Add Wish
          </Button>
        </ThemeProvider>
      </div>
    </form>
  );
}
