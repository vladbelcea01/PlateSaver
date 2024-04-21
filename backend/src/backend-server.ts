import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { dbConnect } from '../src/database.config'
import multer from 'multer'; 
import path from 'path';
dbConnect();

const app = express();
const PORT = process.env.PORT! || 5000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Define Restaurant Schema and Model
const restaurantSchema = new mongoose.Schema({
  name: String,
  description: String,
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  operatingHours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String
  },
  photo: String
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

app.post('/api/restaurants', upload.single('photo'), async (req, res) => {
  try {
    const restaurantData = req.body;
    restaurantData.photo = req.file ? req.file.path : null;

    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json({ message: 'Restaurant created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
