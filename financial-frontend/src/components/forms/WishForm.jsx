import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Swal from "sweetalert2";
import "../../styles/Form.css";
import { CustomThemeContext } from "../../contexts/CustomTheme.context";

export default function WishForm({
  action,
  setShouldShowModal,
  buttonText,
  wishData,
}) {
  const { theme } = React.useContext(CustomThemeContext);
  const [wishInfo, setWishInfo] = useState({
    wishName: wishData?.wish.name || "",
    wishDescription: wishData?.wish.description || "",
    imageURL: wishData?.wish.imageURL || "",
    linkURL: wishData?.wish.linkURL || "",
    dueDate: wishData?.wish.dueDate || "",
    neededAmount: wishData?.wish.neededSum || "",
    currentAmount: wishData?.wish.currentSum || "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    const updateTxState = (prevState) => {
      return { ...prevState, [name]: value };
    };

    setWishInfo(updateTxState);
  };

  const addNewWish = (event) => {
    event.preventDefault();
    action(wishInfo);
    setShouldShowModal(false);
    setWishInfo({
      wishName: "",
      wishDescription: "",
      imageURL: "",
      linkURL: "",
      dueDate: "",
      neededAmount: "",
      currentAmount: "",
    });
  };

  const updateWish = (event) => {
    event.preventDefault();
    action(wishInfo, wishData.id);
    setShouldShowModal(false);
  };

  const handleClick = (event) => {
    if (!wishInfo.wishName || !wishInfo.dueDate || !wishInfo.neededAmount) {
      Swal.fire({
        title: "Ooops!",
        text: "Fill in all the required fields, please.",
        icon: "error",
      });
      return;
    }

    if (wishInfo.neededAmount <= 0) {
      Swal.fire({
        title: "Ooops!",
        text: "Number cannot be negative.",
        icon: "error",
      });
      return;
    }

    if (buttonText === "Add wish" && !wishData) addNewWish(event);
    else updateWish(event);
  };

  return (
    <form className="Transfer WishForm">
      <div className="Multiple-inputs">
        <input
          required
          onChange={handleChange}
          name="wishName"
          value={wishInfo.wishName}
          placeholder={`*Enter wish name...`}
          autoComplete="off"
        />

        <input
          onChange={handleChange}
          name="wishDescription"
          value={wishInfo.wishDescription}
          placeholder={`Enter wish description... (optional)`}
          autoComplete="off"
        />

        <input
          onChange={handleChange}
          name="imageURL"
          value={wishInfo.imageURL}
          placeholder={`Enter wish image url as "https://..." (optional)`}
          autoComplete="off"
        />

        <input
          onChange={handleChange}
          name="linkURL"
          value={wishInfo.linkURL}
          placeholder={`Enter wish link url as "https://..." (optional)`}
          autoComplete="off"
        />

        <input
          required
          onChange={handleChange}
          type="date"
          name="dueDate"
          value={wishInfo.dueDate}
          placeholder={`*Enter due date as YYYY-MM-DD...`}
          autoComplete="off"
        />

        <input
          required
          onChange={handleChange}
          type="number"
          name="neededAmount"
          value={wishInfo.neededAmount}
          placeholder={`*Enter how much it costs...`}
          autoComplete="off"
        />

        <ThemeProvider theme={theme}>
          <Button
            onClick={handleClick}
            variant="contained"
            color="transfer"
            sx={{ marginTop: "2.5%" }}
          >
            <AddIcon fontSize="small" />
            {buttonText}
          </Button>
        </ThemeProvider>
      </div>
    </form>
  );
}
