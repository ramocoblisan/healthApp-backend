import express from 'express';
import ConsumedProduct from '../../validate/ConsumedProductValidation.js';
import Product from '../../validate/ProductValidation.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add-consumed', authMiddleware, async (req, res) => {
  try {
    const { productId, consumedDate, quantity } = req.body;

    if (!productId || !consumedDate || !quantity) {
      return res.status(400).json({ message: "Toate câmpurile sunt necesare." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Produsul nu a fost găsit." });
    }

    const consumedProduct = new ConsumedProduct({
      userId: req.user._id,  
      productId,
      consumedDate: new Date(consumedDate),
      quantity
    });

    await consumedProduct.save();

    return res.status(201).json({
      message: "Produsul a fost adăugat cu succes!",
      consumedProduct
    });

  } catch (err) {
    console.error('Error adding consumed product:', err);
    res.status(500).json({ message: "Eroare la adăugarea produsului consumat." });
  }
});

router.delete('/delete-consumed', authMiddleware, async (req, res) => {
  try {
    console.log('Received DELETE request with data:', req.body);
    const { productId, consumedDate } = req.body;

    if (!productId || !consumedDate) {
      return res.status(400).json({ message: "ID-ul produsului și data sunt necesare." });
    }


    const consumedProduct = await ConsumedProduct.findOne({
      userId: req.user._id,  
      productId,
      consumedDate: new Date(consumedDate)
    });

    if (!consumedProduct) {
      return res.status(404).json({ message: "Produsul consumat nu a fost găsit." });
    }


    await ConsumedProduct.deleteOne({ _id: consumedProduct._id });

    return res.status(200).json({ message: "Produsul consumat a fost șters cu succes!" });
  } catch (err) {
    console.error('Error deleting consumed product:', err);
    res.status(500).json({ message: "Eroare la ștergerea produsului consumat." });
  }
});

router.get('/consumed/:date', authMiddleware, async (req, res) => {
  try {
    const { date } = req.params;

    if (!date) {
      return res.status(400).json({ message: "Data este necesară." });
    }


    const consumedProducts = await ConsumedProduct.find({
      userId: req.user._id,   
      consumedDate: new Date(date) 
    })
    .populate('productId', 'title calories') 
    .select('productId quantity');
    
    console.log('Consumed Products from DB:', consumedProducts);
    if (!consumedProducts || consumedProducts.length === 0) {
      return res.status(404).json({ message: "Nu au fost găsite produse consumate pentru această zi." });
    }


    const result = consumedProducts.map(cp => ({
      title: cp.productId.title,
      calories: cp.productId.calories,
      quantity: cp.quantity,
      productId: cp.productId,
    }));

    console.log('Consumed Products with Quantity:', result);

    return res.status(200).json(result);
  } catch (err) {
    console.error('Error retrieving consumed products:', err);
    res.status(500).json({ message: "Eroare la obținerea produselor consumate." });
  }
});

export default router;
