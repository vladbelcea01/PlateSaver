import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { dbConnect } from '../src/database.config'
import multer from 'multer'; 
import path from 'path';
import { time } from 'console';
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
  owner: String,
  paymentMethod: String
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
  restaurant: String,
  dietaryInfo: String,
  allergens: String,
  pickupStartTime: String,
  pickupEndTime: String
});

const Dish = mongoose.model('Dish', dishSchema);

const orderSchema = new mongoose.Schema({
  name: String,
  phone_number: String,
  email: String,
  products: Array,
  totalPayment: Number,
  payed: String,
  reserved: String,
  orderDate: String,
  paymentId: String
});

const Order = mongoose.model('Order', orderSchema);

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

app.get('/api/getDishes', async (req, res) => {
  try {
    const restaurantName = req.query.name;
    const dishes = await Dish.find({ restaurant: restaurantName });

    res.status(200).json(dishes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/deleterestaurant/:id', async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const deleteProducts = req.query.deleteProducts === 'true';
    const restaurantName = req.query.name;

    if (deleteProducts && restaurantName) {
      await Dish.deleteMany({ restaurant: restaurantName });
    }

    const deletedRestaurant = await Restaurant.findByIdAndDelete(restaurantId);

    if (!deletedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/deleteproduct/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Dish.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/updaterestaurant/:id', upload.single('photo'), async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const restaurantData = req.body;
    const oldRestaurant = await Restaurant.findById(restaurantId);
    if (!oldRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    if (oldRestaurant.name !== restaurantData.name) {
      await Dish.updateMany({ restaurant: oldRestaurant.name }, { $set: { restaurant: restaurantData.name } });
    }
    if (!req.file && !restaurantData.photo) {
      delete restaurantData.photo;
    } else if (req.file) {
      restaurantData.photo = `/assets/uploads/${req.file.originalname}`;
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(restaurantId, restaurantData, { new: true });
    if (!updatedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json({ message: 'Restaurant updated successfully', restaurant: updatedRestaurant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/updateproduct/:id', upload.single('photo'), async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = req.body;

    if (!req.file && !productData.photo) {
      delete productData.photo;
    } else if (req.file) {
      productData.photo = `/assets/uploads/${req.file.originalname}`;
    }

    const updatedProduct = await Dish.findByIdAndUpdate(productId, productData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    res.status(200).json({ message: 'Dish updated successfully', product: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/DishesList', async (req, res) => {
  try {
    const products = await Dish.find();
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/getDishbyName', async (req, res) => {
  try {
    const name = req.query.name;
    const dish = await Dish.findOne({ dishName: name });
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    res.status(200).json(dish);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    console.log(req.body)
    const order = new Order(req.body);
    await order.save();
    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/getOrderbyProducts', async (req, res) => {
  try {
    const productsQueryParam = req.query.products;
    if (!productsQueryParam || typeof productsQueryParam !== 'string') {
      return res.status(400).json({ error: 'Invalid products parameter' });
    }

    const products = JSON.parse(productsQueryParam);
    const order = await Order.findOne({ products: { $all: products } });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/pay/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { paymentId, reservation } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!reservation) {
      order.paymentId = paymentId;
      order.payed = 'Paid';
      order.reserved = 'Reserved';
    } else {
      order.reserved = 'Reserved';
    }

    const products = order.products;
    for (const product of products) {
      const dish = await Dish.findById(product.food._id);
      if (!dish) {
        console.error(`Dish with ID ${product.food._id} not found`);
        continue;
      }
      if (dish.quantity !== undefined && typeof dish.quantity === 'number') {
        dish.quantity = Math.max(0, dish.quantity - product.quantity);
        await dish.save();
      } else {
        console.error(`Quantity property not found or not a number for dish with ID ${product.food._id}`);
      }
    }

    await order.save();

    res.status(200).json({ message: 'Order payment updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/getOrderbyId', async (req, res) => {
  try {
    const id = req.query.id;
    const order = await Order.findOne({ _id: id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
