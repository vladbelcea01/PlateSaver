import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { dbConnect } from '../src/database.config'
dbConnect();

const app = express();
const PORT = process.env.PORT! || 5000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

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
  }
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

// Define route to handle saving restaurant data
app.post('/api/restaurants', async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json({ message: 'Restaurant created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
