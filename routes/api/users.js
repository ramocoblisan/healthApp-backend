import express from 'express';
import User from '../../validate/userValidation.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {validateUser} from '../../validate/userJoi.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import Product from '../../validate/ProductValidation.js';

dotenv.config();
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const { error } = validateUser({ name, email, password });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await User.findOne({ email });

  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email already in use",
      data: "Conflict",
    });
  }
  try {
    const newUser = new User({ name, email, password });
    await newUser.setPassword(password);
    await newUser.save();

    const payload = {
      id: newUser.id,
      username: newUser.username,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1w" });

    res.status(201).json({
      status: "success",
      code: 201,
      token,
      user: {
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login with email:", email);

    const user = await User.findOne({ email });
    console.log("User found:", user);  

    if (!user || !(await user.isValidPassword(password))) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Email or password is wrong",
        data: {
          message: "Email or password is wrong",
        },
      });
    }


    const payload = {
      id: user.id,
      name: user.name, 
    };

    console.log("name:", user.name);
    console.log("payload:", payload);

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1w" });
    user.token = token;
    await user.save();

    res.json({
      token,
      user: {
        email: user.email,
        name: user.name, 
      }
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/logout', authMiddleware, async(req, res) => {
  try {
      const user = req.user;
      user.token = null;
      await user.save();
      res.status(204).json({
        status: 'success',
        code: 204,
        message: 'Successfully logged out',
        data: {
          message: 'Successfully logged out',
        }
      });
  } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/current', authMiddleware, async (req, res) => {
  const { name, email } = req.user;
  res.json({ name, email });
});

export default router;