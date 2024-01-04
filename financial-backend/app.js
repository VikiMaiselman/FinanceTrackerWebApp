import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";

const app = express();
const port = 3007;
let Global, Transaction, Subtype, Type, Wish, User; // mongoose models
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

// cors
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

// configure session and initialize passport to manage the session
app.use(
  session({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

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

  const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
  });

  const GlobalSchema = new mongoose.Schema({
    user: UserSchema,
    total: Number,
    types: [TypeSchema],
  });

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
    dateForDB: Date,
    globalId: { type: mongoose.Schema.Types.ObjectId, ref: "Global" },
    subtypeName: String,
    typeName: String,
  });

  const WishSchema = new mongoose.Schema({
    globalId: { type: mongoose.Schema.Types.ObjectId, ref: "Global" },
    name: String,
    description: String,
    imageURL: String,
    linkURL: String,
    created: Date,
    dueDate: Date,
    neededSum: Number,
    currentSum: Number,
  });

  /* create mongodb models */
  Global = mongoose.model("Global", GlobalSchema);
  Transaction = mongoose.model("Transaction", TransactionSchema);
  Subtype = mongoose.model("Subtype", SubtypeSchema);
  Type = mongoose.model("Type", TypeSchema);
  Wish = mongoose.model("Wish", WishSchema);

  UserSchema.plugin(passportLocalMongoose);
  User = mongoose.model("User", UserSchema);
  passport.use(User.createStrategy()); // creates local login strategy
  passport.serializeUser(User.serializeUser()); // creates session cookie
  passport.deserializeUser(User.deserializeUser()); // cracks session cookie to obtain info
}
initializeDatabase();

/* ************ R O U T E R   F U N C T I O N S ************ */
app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // a method provided by the package, abstracts away our interaction with DB
  User.register({ username: username }, password, async function (err, user) {
    if (err) {
      console.error(err);
      res.status(401).send(err);
      return;
    }

    // if the user was successfully authenticated
    passport.authenticate("local")(req, res, async function () {
      res.send(true);
    });
  });
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = new User({
    username: username,
    password: password,
  });

  req.login(user, function (err) {
    if (err) {
      console.error(err);
      res.status(401).send(err);
      return;
    }

    passport.authenticate("local")(req, res, function () {
      res.send(true);
    });
  });
});

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.send(false);
  });
});

app.get("/authstatus", async (req, res) => {
  res.send(req.isAuthenticated());
});

app.get("/", async (req, res) => {
  try {
    let generalStructure, allTransactions;
    generalStructure = await Global.findOne({ user: req.user });

    if (!generalStructure) {
      const [savings, expenses, incomes] = populateModels();
      const global = new Global({
        user: req.user,
        total: 0,
        types: [incomes, expenses, savings],
      });
      await global.save();
      generalStructure = await Global.findOne({ user: req.user });
    }

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
  const { name, sum, subtypeName, typeName } = req.body;

  const userFinancialInfo = await Global.findOne({ user: req.user });
  const globalId = userFinancialInfo._id;

  if (subtypeName === "Wishes Fund") {
    const wishesFundTransaction = await Transaction.findOne({
      globalId: globalId,
      subtypeName: "Wishes Fund",
    });

    wishesFundTransaction &&
      res
        .status(400)
        .json("This is a fund for wishes. Only one can exist at each time.");
    return;
  }

  const now = new Date();
  const date = `${now.getDate().toString()}/${
    now.getMonth() + 1
  }/${now.getFullYear()}`;

  const test = new Transaction({
    name: name,
    sum: Number(sum),
    date: date,
    dateForDB: now,
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
    const { transaction } = req.body;

    const userFinancialInfo = await Global.findOne({ user: req.user });
    const globalId = userFinancialInfo._id;

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
  const { transaction } = req.body;

  try {
    const userFinancialInfo = await Global.findOne({ user: req.user });
    const globalId = userFinancialInfo._id;

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

app.get("/transaction", async (req, res) => {
  try {
    const userFinancialInfo = await Global.findOne({ user: req.user });
    const globalId = userFinancialInfo._id;

    const transaction = await Transaction.findOne({
      globalId: globalId,
      subtypeName: "Wishes Fund",
    });
    return res.json(transaction);
  } catch (error) {
    console.error(error);
    return res.status(400).json("Could not get info about transaction.");
  }
});

app.post("/addSubtype", async (req, res) => {
  const {
    newSubtype: { name, color },
    typeName,
  } = req.body;

  if (!name || !color)
    return res
      .status(400)
      .json("Please, enter all the required fields to create a category.");

  const userFinancialInfo = await Global.findOne({ user: req.user });
  const globalId = userFinancialInfo._id;

  const hasThisSubtypeAlready = userFinancialInfo.types
    .find((type) => type.name === typeName)
    .subtypes.some((subtype) => subtype.name === name);

  if (hasThisSubtypeAlready)
    return res.status(400).json("This category of expenses already exists.");

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
        "Could not create the category. Try again later or contact the support."
      );
  }
});

app.post("/removeSubtype", async (req, res) => {
  if (!req.body.subtype)
    return res
      .status(400)
      .json("Please, enter all the required fields to remove the category.");

  const {
    subtype: { name, _id },
    typeName,
  } = req.body;

  if (defaultSubtypes.includes(name))
    return res
      .status(400)
      .json(
        "Could not delete this category. It is predefined and cannot be removed."
      );

  try {
    const userFinancialInfo = await Global.findOne({ user: req.user });
    const globalId = userFinancialInfo._id;

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
        "Could not remove the category. Try again later or contact the support."
      );
  }
});

app.get("/wishes", async (req, res) => {
  try {
    const globalId = await Global.findOne({ user: req.user });
    const result = await Wish.find({ globalId: globalId });
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(400).json("Could not display the wishes.");
  }
});

app.post("/wishes", async (req, res) => {
  const { wish } = req.body;

  try {
    const userFinancialInfo = await Global.findOne({ user: req.user });
    const globalId = userFinancialInfo._id;

    const newWish = new Wish({
      globalId: globalId,
      name: wish.wishName,
      description: wish.wishDescription,
      imageURL: wish.imageURL,
      linkURL: wish.linkURL,
      created: new Date().toISOString(),
      dueDate: new Date(wish.dueDate),
      neededSum: wish.neededAmount,
      currentSum: 0,
    });
    await newWish.save();
    return res.json("Wish added");
  } catch (error) {
    console.error(error);
    return res.status(400).json("Could not add the wish.");
  }
});

app.patch("/wishes", async (req, res) => {
  try {
    const wishInQuestion = await Wish.findOne({ _id: req.body.wishId });

    if (wishInQuestion) {
      wishInQuestion.currentSum =
        wishInQuestion.currentSum + Number(req.body.currentSum);
      await wishInQuestion.save();
    }

    return res.json("Sum updated");
  } catch (error) {
    console.error(error);
    return res.status(400).json("Could not update the sum.");
  }
});

app.patch("/wishes/upd", async (req, res) => {
  try {
    const wishInQuestion = await Wish.findOne({ _id: req.body.wishId });

    if (wishInQuestion) {
      wishInQuestion.name = req.body.wish.wishName;
      wishInQuestion.description = req.body.wish.wishDescription;
      wishInQuestion.imageURL = req.body.wish.imageURL;
      wishInQuestion.linkURL = req.body.wish.linkURL;
      wishInQuestion.dueDate = new Date(req.body.wish.dueDate);
      wishInQuestion.neededSum = Number(req.body.wish.neededAmount);
      await wishInQuestion.save();
    }

    return res.json("Wish updated");
  } catch (error) {
    console.error(error);
    return res.status(400).json("Could not update the wish.");
  }
});

app.post("/wishes/delete", async (req, res) => {
  try {
    await Wish.findByIdAndDelete(req.body.wishId);
    return res.json("Wish deleted.");
  } catch (error) {
    console.error(error);
    return res.status(400).json("Could not delete the wish.");
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

function populateModels() {
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

  const savingsWishes = new Subtype({
    name: "Wishes Fund",
    color: "#483434",
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
    color: "#186F65",
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

  const wishes = new Subtype({
    name: "My Wishes",
    color: "#3F4E4F",
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
      wishes,
    ],
    typeTotal: 0,
  });

  const savings = new Type({
    name: "Savings",
    subtypes: [savingsSubcat, savingsWishes],
    typeTotal: 0,
  });

  return [savings, expenses, incomes];
}
