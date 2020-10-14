import express, { query } from 'express';

const app = express();

app.use(express.json());

app.get('/users', (request, response) => {
  return response.send({ message:'Hello World'})
})

app.listen(3333, () =>{
  console.log("Server running on port 3333.")
})