const User = require("../models/User");
const jwt = require("jsonwebtoken");
const generateAuthToken = (id) => {
  const token = jwt.sign({ user: id }, process.env.SECRET_KEY, {
    expiresIn: "4h",
  });
  return token;
};

// Controller for user registration
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exist" });
    } else {
      const user = new User({ email, password });
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

// Controller for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate and return JWT token for authentication
    const token = generateAuthToken(user._id);
    res.status(200).json({
      token: token,
      email: user.email,
      sharedNotes: user.sharedNotes.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// Controller to get user's shared notes
const getUserSharedNotes = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("sharedNotes");
    res.json(user.sharedNotes);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserSharedNotes,
};
