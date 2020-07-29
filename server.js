const express = require('express');
const cors = require('cors');
const connectDb = require('./config/db');
const userRouter = require('./router/api/user');
const authRouter = require('./router/api/auth');
const profileRouter = require('./router/api/profile');
const postRouter = require('./router/api/post');

const app = express();
const port = process.env.PORT || 8000;

// connect to databse
connectDb();

// middlewares
app.use(express.json({ extended: false }));
app.use(cors());
app.use(userRouter);
app.use(authRouter);
app.use(profileRouter);
app.use(postRouter);

app.get('/', (req, res) => {
  res.send('API running...');
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
