// import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const port = 3007;
let Global, Transaction, Subtype, Type, Temp, User; // mongoose models

app.use(
  cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
  })
);
app.use("*", function (req, res, next) {
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
// enable pre-flight
app.options("*", cors());

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function initializeDatabase() {
  try {
    await mongoose.connect("mongodb://localhost:27017/FinanceTrackerVer2");
  } catch (error) {
    console.error(error);
    // handle error appropriately
  }

  const SubtypeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  });

  const TypeSchema = new mongoose.Schema({
    name: {
      type: String,
      enum: ["Expenses", "Incomes", "Savings"],
    },
    subtypes: [SubtypeSchema],
    typeTotal: Number,
  });

  const GlobalSchema = new mongoose.Schema({
    name: String,
    total: Number,
    types: [TypeSchema],
  });

  Global = mongoose.model("Global", GlobalSchema);

  const TransactionSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    sum: {
      type: Number,
      required: true,
    },
    date: String,
    globalId: { type: mongoose.Schema.Types.ObjectId, ref: "Global" },
    subtypeName: String,
    typeName: String,
  });

  Transaction = mongoose.model("Transaction", TransactionSchema);
  Subtype = mongoose.model("Subtype", SubtypeSchema);
  Type = mongoose.model("Type", TypeSchema);

  const salaryIncome = new Subtype({
    name: "Salary",
    color: "#5F6F52",
  });
  const otherIncome = new Subtype({
    name: "Other Incomes",
    color: "#A9B388",
  });

  const savingsSubcat = new Subtype({
    name: "Savings",
    color: "#FEFAE0",
  });

  const food = new Subtype({
    name: "Food&Drinks",
    color: "#FEFAE0",
  });

  const entertainment = new Subtype({
    name: "Entertainment",
    color: "#FEFAE0",
  });

  const housing = new Subtype({
    name: "Rent/Mortgage",
    color: "#FEFAE0",
  });

  const bills = new Subtype({
    name: "Bills",
    color: "#FEFAE0",
  });

  const transportation = new Subtype({
    name: "Transport",
    color: "#FEFAE0",
  });

  const beauty = new Subtype({
    name: "Beauty",
    color: "#FEFAE0",
  });

  const health = new Subtype({
    name: "Health&Sports",
    color: "#FEFAE0",
  });

  const miscellaneous = new Subtype({
    name: "Miscellaneous",
    color: "#FEFAE0",
  });

  const gifts = new Subtype({
    name: "Gifts",
    color: "#FEFAE0",
  });

  const incomes = new Type({
    name: "Incomes",
    subtypes: [salaryIncome, otherIncome],
    typeTotal: 0,
  });

  const expenses = new Type({
    name: "Expenses",
    subtypes: [
      food,
      entertainment,
      housing,
      bills,
      transportation,
      beauty,
      health,
      miscellaneous,
      gifts,
    ],
    typeTotal: 0,
  });

  const savings = new Type({
    name: "Savings",
    subtypes: [savingsSubcat],
    typeTotal: 0,
  });

  const dbCondition = await Global.find();

  if (dbCondition.length === 0) {
    const global = new Global({
      //   username: "viki",
      //   password: "viki",
      name: "Viki",
      total: 0,
      types: [incomes, expenses, savings],
    });
    await global.save();
  }
}
initializeDatabase();

/* ************ R O U T E R   F U N C T I O N S ************ */
app.get("/", async (req, res) => {
  let generalStructure, allTransactions;
  try {
    generalStructure = await Global.findOne({});
    const globalId = generalStructure._id;
    // console.log(globalId);

    allTransactions = await Transaction.find({ globalId: globalId });

    const dataToReturn = {
      generalStructure: generalStructure,
      allTransactions: allTransactions,
    };
    return res.json(dataToReturn);
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json("Something went wrong. Page unavailable. Try again later.");
  }
});

app.post("/", async (req, res) => {
  try {
    // const generalStructure = await Global.findOne({});
    // const globalId = generalStructure._id;
    // console.log(globalId);

    const { name, sum, globalId, subtypeName, typeName } = req.body;
    const now = new Date();
    const date = `${now
      .getDate()
      .toString()}/${now.getMonth()}/${now.getFullYear()}`;
    console.log(date);

    const test = new Transaction({
      name: name,
      sum: Number(sum),
      date: date,
      globalId: globalId,
      subtypeName: subtypeName,
      typeName: typeName,
    });

    await test.save();
    await updateTotals(globalId, Number(sum), "addTx", typeName);

    return res.status(201).json("Successfully created");
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json("Something went wrong. Action unavailable. Try again later.");
  }
});

async function updateTotals(globalId, sum, txOperation, txType) {
  try {
    const global = await Global.findOne({ _id: globalId });
    const globalTotal = global.total;
    let sumToAdd = sum;

    const turnToNegative =
      (txOperation === "addTx" && txType === "Expenses") ||
      (txOperation === "removeTx" && txType !== "Expenses");

    if (turnToNegative) sumToAdd = -1 * sumToAdd;

    const result = await Global.updateOne(
      { _id: globalId },
      { total: globalTotal + sumToAdd }
    );
    // console.log(result, globalId, global);

    const type = await Global.updateOne(
      {
        _id: globalId,
        "types.name": txType,
      },
      {
        $inc: { "types.$.typeTotal": sumToAdd },
      }
    );
    // console.log(type);
  } catch (error) {
    throw error;
  }
}

app.post("/deleteTransaction", async (req, res) => {
  try {
    const { transaction, globalId } = req.body;
    // console.log(transactionId, globalId);

    const result = await Transaction.findByIdAndDelete(transaction._id);
    // console.log(result);

    await updateTotals(
      globalId,
      transaction.sum,
      "removeTx",
      transaction.typeName
    );

    return res.status(200).json("Successfully removed the transaction.");
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json("The transaction wasn't performed. Refresh and try again.");
  }
});

app.post("/updateTransaction", async (req, res) => {
  const { transaction, globalId } = req.body;

  // console.log(transactionId, globalId);
  try {
    const prevTxData = await Transaction.findOne({ _id: transaction._id });
    const result = await Transaction.findOneAndUpdate(
      { _id: transaction._id },
      {
        name: transaction.name,
        sum: Number(transaction.sum),
        subtypeName: transaction.subtypeName,
      }
    );

    // console.log(prevTxData, result, transaction.sum);

    await updateTotalsOnTransactionUpdate(
      globalId,
      result.sum,
      transaction.sum,
      result.typeName
    );

    return res.status(200).json("Successfully updated the transaction.");
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json("The transaction wasn't performed. Refresh and try again.");
  }
});

async function updateTotalsOnTransactionUpdate(
  globalId,
  prevSum,
  newSum,
  txType
) {
  try {
    const global = await Global.findOne({ _id: globalId });
    const globalTotal = global.total;
    let sumToAdd = Number(newSum) - Number(prevSum);

    if (txType === "Expenses") sumToAdd = -1 * sumToAdd;

    const result = await Global.updateOne(
      { _id: globalId },
      { total: globalTotal + sumToAdd }
    );
    // console.log("updating global.total", result, globalId, global);

    const type = await Global.updateOne(
      {
        _id: globalId,
        "types.name": txType,
      },
      {
        $inc: { "types.$.typeTotal": sumToAdd },
      }
    );
    // console.log(type);
  } catch (error) {}
}

app.listen(port, () => console.log(`Server's up. Listening on port ${port}`));

process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log(
      "Mongoose connection is disconnected due to application termination"
    );
    process.exit(0);
  } catch (error) {
    console.error(error);
  }
});
