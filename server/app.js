import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import collection from "./mongoose.js";
import mongoose from "mongoose";
dotenv.config();

const app = express();
const env = process.env;
app.use(express.json());
app.use(cors());

// Python
app.get("/analyze", (req, res) => {});

app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ email: { $eq: req.body.email } });

    if (check != null) {
      const { _id, name, transactions, budgets, pots } = check;

      if (check.password === req.body.password) {
        res.json({
          _id,
          name,
          transactions,
          budgets,
          pots,
        });
      } else {
        res.status(401).json("Password is incorrect!");
      }
    } else {
      res.status(404).json("User does not exist!");
    }
  } catch (e) {
    console.log(e);
  }
});

app.post("/signup", async (req, res) => {
  try {
    const check = await collection.findOne({ email: { $eq: req.body.email } });

    if (check == null) {
      const response = await collection.create(req.body);

      res.json({ _id: response._id, name: response.name });
    } else {
      res.status(403).send("User already exists!");
    }
  } catch (e) {
    console.log(e);
  }
});

app.put("/edit", async (req, res) => {
  const { _id, field, data } = req.body;
  const params = {};
  params[field] = data;

  try {
    await collection.updateOne(
      { _id: new mongoose.Types.ObjectId(_id) },
      { $set: params }
    );
  } catch (e) {
    console.log(e);
  }
});

app.listen(env.PORT, (error) => {
  if (!error) console.log("Server listening to port " + env.PORT);
  else console.log("Error occurred, server can't start", error);
});
