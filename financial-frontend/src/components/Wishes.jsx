import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import { ThemeProvider } from "@mui/material/styles";
import { Button } from "@mui/material";
import ReorderTwoToneIcon from "@mui/icons-material/ReorderTwoTone";
import CustomCard from "./CustomCard";
import Modal from "./Modal";
import WishForm from "./forms/WishForm";
import "../styles/Wishes.css";
import { CustomThemeContext } from "../contexts/CustomTheme.context";
import useFinanceState from "../hooks/useFinanceState";

const url = "http://localhost:3007/wishes";
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "http://localhost:3000",
};

export default function Wishes() {
  const { theme } = React.useContext(CustomThemeContext);

  const { transfer } = useFinanceState();

  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [wishes, setWishes] = useState([]);

  const getWishes = async () => {
    try {
      const result = await axios.get(url, { withCredentials: true }, headers);
      setWishes(result.data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Ooops! The operation failed.",
        text: error.response.data,
        icon: "error",
        confirmButtonColor: "rgb(154, 68, 68)",
        iconColor: "rgb(154, 68, 68)",
      });
    }
  };

  useEffect(() => {
    getWishes();
  }, []);

  const addWish = async (wish) => {
    wish.dueDate = new Date(wish.dueDate).toISOString();
    if (
      !wish.imageURL ||
      !wish.imageURL.startsWith("http://") ||
      !wish.imageURL.startsWith("https://")
    ) {
      wish.imageURL =
        "https://cdn.pixabay.com/photo/2015/05/24/21/19/wish-782424_1280.jpg";
    }

    try {
      await axios.post(url, { wish: wish }, { withCredentials: true }, headers);
      Swal.fire({
        title: "Success!",
        text: "Wish added!",
        icon: "success",
        confirmButtonColor: "#5f6f52",
        iconColor: "#5f6f52",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Ooops! The operation failed.",
        text: error.response.data,
        icon: "error",
        confirmButtonColor: "rgb(154, 68, 68)",
        iconColor: "rgb(154, 68, 68)",
      });
    }

    getWishes();
  };

  const updateWish = async (wish, wishId) => {
    if (!wish.imageURL) {
      wish.imageURL =
        "https://cdn.pixabay.com/photo/2015/05/24/21/19/wish-782424_1280.jpg";
    }

    try {
      await axios.patch(
        `${url}/upd`,
        { wish: wish, wishId: wishId },
        { withCredentials: true },
        headers
      );
      Swal.fire({
        title: "Success!",
        text: `Wish successfully updated!`,
        icon: "success",
        confirmButtonColor: "#5f6f52",
        iconColor: "#5f6f52",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Ooops! The operation failed.",
        text: error.response.data,
        icon: "error",
        confirmButtonColor: "rgb(154, 68, 68)",
        iconColor: "rgb(154, 68, 68)",
      });
    }

    getWishes();
  };

  const updateCurSum = async (currentSum, wishId) => {
    try {
      await axios.patch(
        `${url}`,
        { currentSum: currentSum, wishId: wishId },
        { withCredentials: true },
        headers
      );
      Swal.fire({
        title: "Success!",
        text: `Wish updated by ${currentSum}₪!`,
        icon: "success",
        confirmButtonColor: "#5f6f52",
        iconColor: "#5f6f52",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Ooops! The operation failed.",
        text: error.response.data,
        icon: "error",
        confirmButtonColor: "rgb(154, 68, 68)",
        iconColor: "rgb(154, 68, 68)",
      });
    }

    getWishes();
  };

  const deleteWish = async (wishId, toFullfill) => {
    try {
      await axios.post(
        `${url}/delete`,
        { wishId: wishId },
        { withCredentials: true },
        headers
      );

      Swal.fire({
        title: "Success!",
        text: `Wish successfully ${toFullfill ? "fulfilled" : "removed"}!`,
        icon: "success",
        confirmButtonColor: "#5f6f52",
        iconColor: "#5f6f52",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Ooops! The operation failed.",
        text: error.response.data,
        icon: "error",
        confirmButtonColor: "rgb(154, 68, 68)",
        iconColor: "rgb(154, 68, 68)",
      });
    }

    getWishes();
  };

  const handleClick = async (event) => {
    event.preventDefault();
    setShouldShowModal(true);
  };

  return (
    <>
      <h1 className="Wishlist-header Header">
        <ReorderTwoToneIcon
          sx={{ fontSize: "2.6rem", verticalAlign: "middle" }}
        />
        My Wishlist:
      </h1>

      <div className="Wishes-list">
        {wishes.map((wish) => {
          return (
            <CustomCard
              key={wish._id}
              id={wish._id}
              wish={wish}
              updateCurSum={updateCurSum}
              deleteWish={deleteWish}
              updateWish={updateWish}
              transferMoney={transfer}
            />
          );
        })}
      </div>

      <ThemeProvider theme={theme}>
        <Button
          onClick={handleClick}
          variant="contained"
          color="transfer"
          sx={{ marginTop: "2.5%", marginBottom: "2.5%" }}
        >
          Create new wish
        </Button>
      </ThemeProvider>

      <Modal
        shouldShowModal={shouldShowModal}
        setShouldShowModal={setShouldShowModal}
        isBig={true}
      >
        <h2 className="Modal-h2-header">Create a new wish</h2>
        <WishForm
          action={addWish}
          setShouldShowModal={setShouldShowModal}
          buttonText="Add wish"
        />
      </Modal>
    </>
  );
}
