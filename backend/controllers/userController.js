const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ message: 'User created', token, user: userResponse });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ message: 'Login successful', token, user: userResponse });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, profileImage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { firstName, lastName, bio, profileImage },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.becomeSeller = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { isSeller: true },
      { new: true }
    );
    res.json({ message: 'Now a seller', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
