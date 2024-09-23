import app from './app.js'
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3001;
const dbConnection = process.env.DATABASE_CONNECT;

if (!dbConnection) {
  console.error('DATABASE_CONNECT is not defined in the environment variables');
  process.exit(1);
}
mongoose.connect(dbConnection)
  .then(() => {
    console.log('Connected to the database');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

app.use((req, res, next) => {
  res.status(404).json({ message: 'Not found' });
});
