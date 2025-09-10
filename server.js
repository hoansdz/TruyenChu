import express from 'express'

const app = express();
const post = process.env.PORT || 3000;

app.use(express.json())
app.use(express.static('public'))

app.post('/api/login', (req, res) => {
  console.log(`User Login`);
  console.log(`Email: ${req.body.email}`);
  console.log(`Password: ${req.body.password}`);

  const data = {
    success: false
  }
  res.json(data);
});

app.listen(post, () => {
  console.log('Server started');
});