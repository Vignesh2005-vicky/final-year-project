const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// DB CONNECT
mongoose.connect("mongodb://127.0.0.1:27017/Login-DB")
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

// SIGNUP COLLECTION
const Signup = mongoose.model("Signup", {
  email: String,
  password: String,
  phone: String
});

// LOGIN HISTORY COLLECTION
const Login = mongoose.model("Login", {
  email: String,
  password: String,
  time: { type: Date, default: Date.now }
});

/* ================= SIGNUP ================= */
app.post("/register", async (req, res) => {
  const { email, password, phone } = req.body;

  try {
    const exists = await Signup.findOne({ email });

    if (exists) {
      return res.json({
        success: false,
        message: "Email already registered ❌"
      });
    }

    await Signup.create({ email, password, phone });

    res.json({
      success: true,
      message: "Signup successful 🎉 Please login"
    });

  } catch (err) {
    res.json({
      success: false,
      message: "Signup failed ❌"
    });
  }
});

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Signup.findOne({ email });

    // ❌ User not found → ask to signup
    if (!user) {
      return res.json({
        success: false,
        message: "Account not found ❌ Please signup first"
      });
    }

    // ❌ Password mismatch
    if (user.password !== password) {
      return res.json({
        success: false,
        message: "Wrong password ❌"
      });
    }

    // ✅ Login success → store login history
    await Login.create({ email, password });

    res.json({
      success: true,
      message: "Login successful ✅"
    });

  } catch (err) {
    res.json({
      success: false,
      message: "Login failed ❌"
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
