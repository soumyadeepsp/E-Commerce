import mongoose from 'mongoose';

const uri = 'mongodb+srv://soumyadeepsp:CodingNinjas1@e-commerce.zipnl.mongodb.net/?retryWrites=true&w=majority&appName=E-Commerce';

mongoose.connect(uri, {
})
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });