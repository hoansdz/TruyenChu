import express from 'express';
import users from './backend/users';

const app = express();
const post = process.env.PORT || 3000;

app.use(express.json())
app.use(express.static('public'))

app.post('/api/login', async (req, res) => {
  console.log(`User Login`);
  console.log(`Email: ${req.body.email}`);
  console.log(`Password: ${req.body.password}`);

  res.json(await users.login(
    req.body.email,
    req.body.password
  ));
});

app.post('/api/register', async (req, res) => {
  console.log(`User Login`);
  console.log(`Email: ${req.body.email}`);
  console.log(`Password: ${req.body.password}`);

  res.json(await users.register(
    req.body.name,
    req.body.email,
    req.body.password
  ));
});

app.listen(post, async () => {
  console.log('Server started');
  await users();
});