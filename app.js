import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import passport from 'passport';
import passportConfig from "./config/passport.js";

passportConfig(passport);

import usersRouter from './routes/api/users.js';
import productsRouter from './routes/api/products.js';
import dailyIntakeRouter from './routes/api/dailyIntake.js';
import consumedProductsRouter from './routes/api/consumedProducts.js';

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/daily-intake', dailyIntakeRouter);
app.use('/api/consumed-products', consumedProductsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

export default app;
