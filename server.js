import express from 'express'

const app = express();
const post = process.env.PORT || 3000;

app.use(express.json())
app.use(express.static('public'))

app.post('/', (req, res) => {
  console.log(`Message from hello is ${req.body.hello}`);
  res.json({message: 'Hello there'});
});

app.listen(post, () => {
  console.log('Hi');
});