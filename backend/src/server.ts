import express, { query } from 'express';
import path from 'path';
import 'express-async-errors';

import './database/connection';
import routes from './routes';
import errorHander from './errors/handler';
import errorHandler from './errors/handler';

const app = express();

app.use(express.json());
app.use(routes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(errorHandler);
app.listen(3333, () =>{
  console.log("Server running on port 3333.")
});
