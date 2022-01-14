import mongoose, { ConnectOptions } from 'mongoose';

const connection = {};

async function dbConnect() {
  if (mongoose.connection.readyState === 0) {
    await mongoose
      .connect(process.env.NEXT_PUBLIC_MONGODB_URI!, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        // poolSize: parseInt(process.env.POOL_SIZE!),
      } as ConnectOptions)
      .then((res) => {
        console.log(
          'Connected to Distribution API Database - Initial Connection'
        );
      })
      .catch((err) => {
        console.log(
          `Initial Distribution API Database connection error occured -`,
          err
        );
      });
  }
}

export default dbConnect;