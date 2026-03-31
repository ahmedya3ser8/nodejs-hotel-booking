import 'dotenv/config';
import express from 'express';
import connectDB from './config/db';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API RUNNING');
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  connectDB();
})
