require('dotenv').config();
const express = require("express");
const app = express();
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const cors = require('cors');
const path = require('path');

require('./db');

app.use(express.json());
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-frontend-name.vercel.app' 
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});