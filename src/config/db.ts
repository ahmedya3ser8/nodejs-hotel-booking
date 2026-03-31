import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI dose not exist');
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database Connected Successfully ${connection.connection.host}`);
  } catch (error) {
    console.log('Error connection to MONGODB', error);
    process.exit(1);
  }
}

export default connectDB;
