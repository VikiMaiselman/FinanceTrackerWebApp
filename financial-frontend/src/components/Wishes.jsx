import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import { Button } from "@mui/material";
import CustomCard from "./CustomCard";
import Modal from "./Modal";
import WishForm from "./forms/WishForm";
import "../styles/Wishes.css";

const url = "http://localhost:3007/wishes";
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "http://localhost:3000",
};

export default function Wishes({ globalId }) {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [wishes, setWishes] = useState([]);

  const getWishes = async () => {
    try {
      const result = await axios.get(url, { withCredentials: true }, headers);
      console.log(result.data);
      setWishes(result.data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Ooops! The operation failed.",
        text: error.response.data,
        icon: "error",
      });
    }
  };

  useEffect(() => {
    getWishes();
  }, []);

  const addWish = async (wish) => {
    wish.dueDate = new Date(wish.dueDate).toISOString();

    try {
      await axios.post(
        url,
        { wish: wish, globalId: globalId },
        { withCredentials: true },
        headers
      );
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
      console.log("?????????");
      Swal.fire({
        title: "Success!",
        text: `Wish updated by ${currentSum}₪!`,
        icon: "success",
        confirmButtonColor: "#5f6f52",
        iconColor: "#5f6f52",
      });
    } catch (error) {}

    getWishes();
  };

  const handleClick = async (event) => {
    event.preventDefault();
    setShouldShowModal(true);
  };

  return (
    <>
      <h1>My wishes:</h1>
      <div className="Wishes-list">
        {wishes.map((wish) => {
          {
            /* console.log(wish); */
          }
          return (
            <CustomCard
              key={wish._id}
              id={wish._id}
              imgUrl={wish.imageURL}
              name={wish.name}
              description={wish.description}
              dueDate={wish.dueDate}
              neededSum={wish.neededSum}
              currentSum={wish.currentSum}
              updateCurSum={updateCurSum}
            />
          );
        })}
      </div>

      <Button onClick={handleClick}>Create new wish</Button>

      <Modal
        shouldShowModal={shouldShowModal}
        setShouldShowModal={setShouldShowModal}
        isBig={true}
      >
        <h2 className="Modal-h2-header">Create a new wish</h2>
        <WishForm addWish={addWish} setShouldShowModal={setShouldShowModal} />
      </Modal>
    </>
  );
}
