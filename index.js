import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

// import the config files
import './config/mongodb.js';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// importing the routes
import { router } from './routes/index.js';

// Define a simple route
app.use('/', router);
// everything that starts with / means every possible API route

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
