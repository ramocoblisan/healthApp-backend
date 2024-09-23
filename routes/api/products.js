import express from 'express';
import Product from '../../validate/ProductValidation.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await Product.find(); 
    console.log('Products fetched:', products);
    res.status(200).json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/calories', async (req, res) => {
  try {
    const {bloodType} = req.body;

    if (!bloodType) {
      return res.status(400).json({message: "Blood type is required"});
    }
    
    const bloodTypeIndexMap = {
      'A': 1,
      'B': 2, 
      'AB': 3,
      '0': 4
    };

    const bloodTypeIndex = bloodTypeIndexMap[bloodType];
    if (bloodTypeIndex === undefined) {
      return res.status(400).json({ message: "Invalid blood type." });
    }

    const products = await Product.find({
      [`groupBloodNotAllowed.${bloodTypeIndex}`]: true})
      .limit(5)
      .select('title');

    return res.status(200).json({
      calorieIntake: 2800,
      products: products.map(product => product.title)
      });

  } catch (err) {
    console.error('Error fetching products based on blood type:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query; 

    if (!q) {
      return res.status(400).json({ message: "Te rog introdu un termen de căutare." });
    }

    const products = await Product.find({
      title: { $regex: q, $options: 'i' }
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "Niciun produs găsit." });
    }

    res.status(200).json(products);
  } catch (err) {
    console.error('Error searching for products:', err);
    res.status(500).json({ message: "Eroare la căutarea produselor." });
  }
});

export default router;
