import React, { useState } from "react";
import Swal from "sweetalert2";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Modal from "./Modal";
import WishForm from "./forms/WishForm";
import "../styles/Wishes.css";

export default function CustomCard({
  id,
  wish,
  updateCurSum,
  deleteWish,
  updateWish,
}) {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [currentSumLocal, setCurrentSumLocal] = useState("");
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
          text: "You can't fill in a negative number",
          icon: "warning",
        });
        setCurrentSumLocal("");
        return;
      }

      setCurrentSumToDisplay(wish.currentSum + Number(currentSumLocal));
      updateCurSum(currentSumLocal, id);
      setCurrentSumLocal("");
    }
  };
  const handleDelete = () => {
    deleteWish(id);
  };
  const handleUpdate = () => {
    setShouldShowModal(true);
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
          <Typography variant="body2" color="#706233">
            <b>Link: </b> {wish.linkURL}
          </Typography>
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
              size="small"
              placeholder="Add sum"
            />
            <Button
              size="small"
              sx={{ color: "#706233" }}
              onClick={handleAddSum}
            >
              {" "}
              <SyncAltIcon sx={{ color: "#706233" }} />
              &nbsp;Add
            </Button>
          </form>
        </CardActions>
        <CardActions>
          <Button
            size="small"
            variant="outlined"
            sx={{ color: "rgb(154, 68, 68)", borderColor: "rgb(154, 68, 68)" }}
            onClick={handleDelete}
          >
            <DeleteIcon sx={{ color: "rgb(154, 68, 68)" }} />
            Don't want it!
          </Button>
          <Button
            size="small"
            variant="outlined"
            sx={{ color: "#5F6F52", borderColor: "#5F6F52" }}
            onClick={handleUpdate}
          >
            <EditIcon sx={{ color: "#5F6F52" }} />
            Edit
          </Button>
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
