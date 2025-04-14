import express from "express";
import User from "../models/User.js"; // MongoDB User Model

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { uid, name, email, photo } = req.body;

    // Check if user exists
    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({ uid, name, email, photo });
      await user.save();
    }

    console.log("DONE", user);

    res.status(200).json({ message: "User authenticated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
