import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import { Tooltip } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddTaskIcon from "@mui/icons-material/AddTask";

import Modal from "./Modal";
import WishForm from "./forms/WishForm";
import "../styles/Wishes.css";

const url = "http://localhost:3007/transaction";
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "http://localhost:3000",
};

export default function CustomCard({
  id,
  wish,
  updateCurSum,
  deleteWish,
  updateWish,
  fulfillWish,
  transferMoney,
}) {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [currentSumLocal, setCurrentSumLocal] = useState("");
  const [currentSumTransfer, setCurrentSumTransfer] = useState("");
  const [currentSumToDisplay, setCurrentSumToDisplay] = useState(
    wish.currentSum
  );

  const handleChangeSum = (event) => {
    const { value } = event.target;
    setCurrentSumLocal(+value);
  };
  const handleAddSum = (event) => {
    if (event.key === "Enter" || event.type === "click") {
      event.preventDefault();
      if (currentSumLocal <= 0) {
        Swal.fire({
          title: "Ooops! The operation failed.",
          text: "You can't fill in a negative number or leave it empty.",
          icon: "warning",
          confirmButtonColor: "rgb(154, 68, 68)",
          iconColor: "rgb(154, 68, 68)",
        });
        setCurrentSumLocal("");
        return;
      }

      setCurrentSumToDisplay(wish.currentSum + Number(currentSumLocal));
      updateCurSum(currentSumLocal, id);
      setCurrentSumLocal("");
    }
  };
  const handleDelete = (event, toFullfill = false) => {
    deleteWish(id, toFullfill);
  };
  const handleUpdate = () => {
    setShouldShowModal(true);
  };
  const handleFulfill = async (event) => {
    event.preventDefault();

    if (wish.currentSum < wish.neededSum) {
      Swal.fire({
        title: "Ooops! ",
        text: "You don't have enough money for it :(",
        icon: "warning",
        confirmButtonColor: "rgb(154, 68, 68)",
        iconColor: "rgb(154, 68, 68)",
      });
      return;
    }
    const newExpenseTransaction = {
      name: wish.name,
      sum: wish.neededSum,
      subtypeName: "My Wishes",
      typeName: "Expenses",
    };
    await fulfillWish(newExpenseTransaction);
    handleDelete(event, true);
  };

  const getSavingsForWishesTransaction = async () => {
    try {
      const result = await axios.get(url, { withCredentials: true }, headers);
      if (!result.data) {
        throw new Error({ message: "No Wishes Fund" });
        return;
      }
      return result.data;
    } catch (error) {
      throw error;
    }
  };

  const handleChangeTransferSum = (event) => {
    const { value } = event.target;
    setCurrentSumTransfer(+value);
  };

  const handleTransfer = async (event) => {
    if (event.key === "Enter" || event.type === "click") {
      event.preventDefault();
      let transaction;

      try {
        transaction = await getSavingsForWishesTransaction();
      } catch (error) {
        Swal.fire({
          title: "Ooops! No fund to transfer money from.",
          text: " Go to Savings and create a new 'Wishes Fund' transaction.",
          icon: "warning",
          confirmButtonColor: "rgb(154, 68, 68)",
          iconColor: "rgb(154, 68, 68)",
        });
        setCurrentSumTransfer("");
        return;
      }

      if (currentSumTransfer <= 0) {
        Swal.fire({
          title: "Ooops! The operation failed.",
          text: "You can't fill in a negative number or leave it empty.",
          icon: "warning",
          confirmButtonColor: "rgb(154, 68, 68)",
          iconColor: "rgb(154, 68, 68)",
        });
        setCurrentSumLocal("");
        return;
      }

      if (transaction.sum < currentSumTransfer) {
        Swal.fire({
          title: "Ooops! The operation failed.",
          text: "Not enough money in Wishes Fund.",
          icon: "warning",
          confirmButtonColor: "rgb(154, 68, 68)",
          iconColor: "rgb(154, 68, 68)",
        });
        setCurrentSumLocal("");
        return;
      }

      const isTransferToWish = true;
      setCurrentSumToDisplay(wish.currentSum + Number(currentSumTransfer));
      transferMoney(transaction, currentSumTransfer, isTransferToWish);
      updateCurSum(currentSumTransfer, id);
      setCurrentSumTransfer("");
    }
  };

  const wishData = {
    id,
    wish,
  };
  const descriptionPart1 = wish.description ? <b>Description:</b> : null;
  const descriptionPart2 = wish.description ? wish.description : null;
  return (
    <>
      <Card
        sx={{ maxWidth: 345 }}
        className={`Wish ${
          currentSumToDisplay >= wish.neededSum && "fulfilled"
        }`}
      >
        <CardMedia
          className="Wish-img"
          component="img"
          alt="wish"
          height="140"
          image={wish.imageURL}
        />
        <CardContent className="Card-Content">
          <Typography
            gutterBottom
            variant="h5"
            color="#706233"
            component="div"
            className="Card-Header"
          >
            {wish.name}
          </Typography>
          <Typography variant="body2" color="#706233">
            {descriptionPart1} {descriptionPart2}
          </Typography>
          {wish.linkURL ? (
            <Typography variant="body2" color="#706233">
              <b>Link: </b> <a href={wish.linkURL}>Go to wish page</a>
            </Typography>
          ) : null}
          <Typography variant="body2" color="#706233">
            <b>Due date:</b> {new Date(wish.dueDate).toDateString()}
          </Typography>
          <Typography variant="body2" color="#706233">
            <b>Needed sum:</b> {wish.neededSum}₪
          </Typography>
          <Typography variant="body2" color="#706233">
            <b>Current sum:</b> {currentSumToDisplay}₪
          </Typography>
        </CardContent>

        <CardActions>
          <form>
            <input
              onChange={handleChangeSum}
              onKeyDown={handleAddSum}
              type="number"
              min={0}
              value={currentSumLocal}
              name="randomSum"
              size="small"
              placeholder="Add sum"
            />
            <Tooltip title="No transaction will be used" placement="top">
              <Button
                size="small"
                sx={{ color: "#706233" }}
                onClick={handleAddSum}
              >
                {" "}
                <SyncAltIcon sx={{ color: "#706233" }} />
                &nbsp;Add
              </Button>
            </Tooltip>
          </form>
        </CardActions>
        <CardActions>
          <form>
            <input
              onChange={handleChangeTransferSum}
              onKeyDown={handleTransfer}
              type="number"
              min={0}
              value={currentSumTransfer}
              name="transferSum"
              size="small"
              placeholder="Transfer from Savings (sum₪)"
            />
            <Tooltip title="Wishes Fund will be used" placement="top">
              <Button
                size="small"
                sx={{ color: "#706233" }}
                onClick={handleTransfer}
              >
                {" "}
                <SyncAltIcon sx={{ color: "#706233" }} />
                &nbsp;Transfer
              </Button>
            </Tooltip>
          </form>
        </CardActions>
        <CardActions>
          <Tooltip title="Don't want it anymore">
            <Button
              size="small"
              variant="outlined"
              sx={{
                color: "rgb(154, 68, 68)",
                borderColor: "rgb(154, 68, 68)",
              }}
              onClick={handleDelete}
            >
              <DeleteIcon sx={{ color: "rgb(154, 68, 68)" }} />
              Delete
            </Button>
          </Tooltip>
          <Tooltip title="Edit wish">
            <Button
              size="small"
              variant="outlined"
              sx={{ color: "#5F6F52", borderColor: "#5F6F52" }}
              onClick={handleUpdate}
            >
              <EditIcon sx={{ color: "#5F6F52" }} />
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="Remove from wishes and save as expense">
            <Button
              size="small"
              variant="outlined"
              sx={{ color: "#5F6F52", borderColor: "#5F6F52" }}
              onClick={handleFulfill}
            >
              <AddTaskIcon sx={{ color: "#5F6F52" }} />
              &nbsp;Fulfill
            </Button>
          </Tooltip>
        </CardActions>
      </Card>
      <Modal
        shouldShowModal={shouldShowModal}
        setShouldShowModal={setShouldShowModal}
        isBig={true}
      >
        <h2 className="Modal-h2-header">Update Wish</h2>
        <WishForm
          action={updateWish}
          setShouldShowModal={setShouldShowModal}
          buttonText="Update"
          wishData={wishData}
        />
      </Modal>
    </>
  );
}
