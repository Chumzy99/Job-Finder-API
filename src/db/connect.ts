import mongoose from 'mongoose';

const connectDB = (url: string) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
};

export default connectDB;
