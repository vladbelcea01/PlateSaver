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
    cb(null, path.join(__dirname, '../../src/assets/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

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
  photo: String,
  owner: String
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

const dishSchema = new mongoose.Schema({
  dishName: String,
  description: String,
  category: String,
  price: Number,
  newPrice: Number,
  quantity: Number,
  ingredients: String,
  photo: String,
  restaurant: String
});

const Dish = mongoose.model('Dish', dishSchema);

app.post('/api/restaurants', upload.single('photo'), async (req, res) => {
  try {
    const restaurantData = req.body;
    restaurantData.photo = req.file ? `/assets/uploads/${req.file.originalname}` : null;

    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json({ message: 'Restaurant created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/restaurantsList', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/getRestaurantbyName', async (req, res) => {
  try {
    const name = req.query.name;
    const restaurant = await Restaurant.findOne({ name: name });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/dishes', upload.single('photo'), async (req, res) => {
  try {
    const dishData = req.body;
    dishData.photo = req.file ? `/assets/uploads/${req.file.originalname}` : null;

    const dish = new Dish(req.body);
    await dish.save();
    res.status(201).json({ message: 'Dish created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
