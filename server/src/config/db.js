import mongoose from 'mongoose';

const connectDB = async () => {
  const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const conn = await mongoose.connect(connUri);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      retries++;
      console.error(`Database connection failed (Attempt ${retries}/${maxRetries}): ${error.message}`);
      if (retries >= maxRetries) {
        console.error('Max connection retries exceeded. Exiting...');
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

export default connectDB;
