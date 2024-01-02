import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Modal from "./Modal";
import "../styles/Wishes.css";
import Swal from "sweetalert2";

export default function CustomCard({
  id,
  imgUrl,
  name,
  description,
  dueDate,
  neededSum,
  currentSum,
  updateCurSum,
}) {
  const [currentSumLocal, setCurrentSumLocal] = useState("");
  const [currentSumToDisplay, setCurrentSumToDisplay] = useState(currentSum);

  const handleChangeSum = (event) => {
    const { value } = event.target;
    setCurrentSumLocal(+value);
  };
  const handleAddSum = (event) => {
    if (event.key === "Enter") {
      setCurrentSumToDisplay(currentSum + Number(currentSumLocal));
      updateCurSum(currentSumLocal, id);
      setCurrentSumLocal("");
    }
  };

  return (
    <Card
      sx={{ maxWidth: 345 }}
      className={`Wish ${currentSumToDisplay >= neededSum && "fulfilled"}`}
    >
      <CardMedia component="img" alt="wish" height="140" image={imgUrl} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Due date: {dueDate}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Needed sum: {neededSum}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Current sum: {currentSumToDisplay}
        </Typography>
      </CardContent>
      <CardActions>
        <input
          onChange={handleChangeSum}
          onKeyDown={handleAddSum}
          value={currentSumLocal}
          size="small"
          placeholder="Add sum"
        />

        <Button size="small">
          {" "}
          <DeleteIcon sx={{ color: "#706233" }} />
        </Button>
      </CardActions>
    </Card>
  );
}
