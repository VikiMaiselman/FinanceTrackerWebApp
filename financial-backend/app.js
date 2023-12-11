import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const port = 3007;
let Global, Transaction, Subtype, Type, User; // mongoose models
const defaultSubtypes = [
  "Food&Drinks",
  "Entertainment",
  "Rent/Mortgage",
  "Bills",
  "Transport",
  "Beauty",
  "Health&Sports",
  "Miscellaneous",
  "Gifts",
  "Salary",
  "General Savings",
  "Other Incomes",
];

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ************ C O N F I G U R E   D A T A B A S E ************ */
async function initializeDatabase() {
  try {
    await mongoose.connect("mongodb://localhost:27017/FinanceTrackerVer2");
  } catch (error) {
    console.error(error);
    // handle error appropriately
  }

  /* create mongodb schemas */
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

  /* create mongodb models */
  Transaction = mongoose.model("Transaction", TransactionSchema);
  Subtype = mongoose.model("Subtype", SubtypeSchema);
  Type = mongoose.model("Type", TypeSchema);

  /* populate mongodb models with pre-defined values - 3 types "expenses", "incomes", "savings" & their subtypes */
  const salaryIncome = new Subtype({
    name: "Salary",
    color: "#5F6F52",
  });
  const otherIncome = new Subtype({
    name: "Other Incomes",
    color: "#A9B388",
  });

  const savingsSubcat = new Subtype({
    name: "General Savings",
    color: "#EAC696",
  });

  const food = new Subtype({
    name: "Food&Drinks",
    color: "#C8AE7D",
  });

  const entertainment = new Subtype({
    name: "Entertainment",
    color: "#765827",
  });

  const housing = new Subtype({
    name: "Rent/Mortgage",
    color: "#65451F",
  });

  const bills = new Subtype({
    name: "Bills",
    color: "#6C3428",
  });

  const transportation = new Subtype({
    name: "Transport",
    color: "#FEFAE0",
  });

  const beauty = new Subtype({
    name: "Beauty",
    color: "#BA704F",
  });

  const health = new Subtype({
    name: "Health&Sports",
    color: "#DFA878",
  });

  const miscellaneous = new Subtype({
    name: "Miscellaneous",
    color: "#DFA878",
  });

  const gifts = new Subtype({
    name: "Gifts",
    color: "#FF9B50",
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
      .json("Page unavailable. Try again later or contact the support.");
  }
});

app.post("/", async (req, res) => {
  const { name, sum, globalId, subtypeName, typeName } = req.body;
  const now = new Date();
  const date = `${now
    .getDate()
    .toString()}/${now.getMonth()}/${now.getFullYear()}`;

  const test = new Transaction({
    name: name,
    sum: Number(sum),
    date: date,
    globalId: globalId,
    subtypeName: subtypeName,
    typeName: typeName,
  });

  try {
    await test.save();
    await updateTotals(globalId, Number(sum), "addTx", typeName);

    return res.status(201).json("Successfully created");
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json(
        "Could not create a transaction. Action unavailable. Refresh and try again later."
      );
  }
});

app.post("/deleteTransaction", async (req, res) => {
  try {
    const { transaction, globalId } = req.body;
    await removeTransaction(transaction, globalId);
    return res.status(200).json("Successfully removed the transaction.");
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json(
        "Could not remove the transaction. Action unavailable. Refresh and try again later."
      );
  }
});

app.post("/updateTransaction", async (req, res) => {
  const { transaction, globalId } = req.body;

  try {
    const result = await Transaction.findOneAndUpdate(
      { _id: transaction._id },
      {
        name: transaction.name,
        sum: Number(transaction.sum),
        subtypeName: transaction.subtypeName,
      }
    );

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
      .json(
        "Could not update your transaction. Action unavailable. Refresh and try again later."
      );
  }
});

app.post("/addSubtype", async (req, res) => {
  const {
    newSubtype: { name, color },
    globalId,
    typeName,
  } = req.body;

  if (!name || !color)
    return res
      .status(400)
      .json("Please, enter all the required fields to create a subcategory.");

  const globalObj = await Global.findOne({ _id: globalId });
  const hasThisSubtypeAlready = globalObj.types
    .find((type) => type.name === typeName)
    .subtypes.some((subtype) => subtype.name === name);

  if (hasThisSubtypeAlready)
    return res.status(400).json("This subcategory of expenses already exists.");

  const newSubtypeObj = new Subtype({
    name: name,
    color: color,
  });

  try {
    await Global.findOneAndUpdate(
      { _id: globalId },
      {
        $push: {
          "types.$[type].subtypes": newSubtypeObj,
        },
      },
      {
        arrayFilters: [{ "type.name": typeName }],
      }
    );

    return res.json("Created");
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json(
        "Could not create the subcategory. Try again later or contact the support."
      );
  }
});

app.post("/removeSubtype", async (req, res) => {
  const {
    subtype: { name, _id },
    globalId,
    typeName,
  } = req.body;

  if (defaultSubtypes.includes(name))
    return res
      .status(400)
      .json(
        "Could not delete this subcategory. It is predefined and is not to be removed."
      );

  try {
    // 1. Remove the subtype
    await Global.updateOne(
      { _id: globalId },
      {
        $pull: {
          "types.$[type].subtypes": { _id: _id },
        },
      },
      {
        arrayFilters: [{ "type.name": typeName }],
      }
    );

    // 2. Delete All transactions with this subtype name
    const transactionsOfRemovedSubtype = await Transaction.find({
      subtypeName: name,
    });

    transactionsOfRemovedSubtype.map(async (transaction) => {
      await removeTransaction(transaction, globalId);
    });

    return res.json("Removed");
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json(
        "Could not remove the subcategory. Try again later or contact the support."
      );
  }
});

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

/* ************ H E L P E R   F U N C T I O N S ************ */

async function updateTotals(globalId, sum, txOperation, txType) {
  try {
    const global = await Global.findOne({ _id: globalId });
    const globalTotal = Number(global.total);
    let sumToAdd = Number(sum);

    const turnToNegative =
      (txOperation === "addTx" && txType === "Expenses") ||
      (txOperation === "removeTx" && txType !== "Expenses");

    if (turnToNegative) sumToAdd = -1 * sumToAdd;
    const newSum = globalTotal + sumToAdd;

    await Global.updateOne({ _id: globalId }, { total: newSum });
    await Global.updateOne(
      {
        _id: globalId,
        "types.name": txType,
      },
      {
        $inc: { "types.$.typeTotal": sumToAdd },
      }
    );
  } catch (error) {
    throw error;
  }
}

async function updateTotalsOnTransactionUpdate(
  globalId,
  prevSum,
  newSum,
  txType
) {
  try {
    const global = await Global.findOne({ _id: globalId });
    const globalTotal = Number(global.total);
    let sumToAdd = Number(newSum) - Number(prevSum);

    if (txType === "Expenses") sumToAdd = -1 * sumToAdd;

    await Global.updateOne(
      { _id: globalId },
      { total: globalTotal + sumToAdd }
    );

    await Global.updateOne(
      {
        _id: globalId,
        "types.name": txType,
      },
      {
        $inc: { "types.$.typeTotal": sumToAdd },
      }
    );
  } catch (error) {
    throw error;
  }
}

async function removeTransaction(transaction, globalId) {
  try {
    await Transaction.findByIdAndDelete(transaction._id);
    await updateTotals(
      globalId,
      transaction.sum,
      "removeTx",
      transaction.typeName
    );
  } catch (error) {
    throw error;
  }
}
