var mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL);

console.log("connecting to db")

mongoose.connection.once('open', function (cb) {
  console.log(`Mongoose connected to: ${process.env.DATABASE_URL}`);
});

module.export = mongoose;
