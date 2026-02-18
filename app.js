const express = require ("express");
const morgan = require ("morgan");
const cors = require("cors");


const personRouter = require("./routes/personRouter.js");

// const Visit=require ("./model/visits");

// const visitsRouter = require ("./routes/visitsRouter.js");
// const emailRouter=require('./routes/emailRouter.js');
// const checkRouter=require('./routes/checkRouter.js');
// const serviceRouter=require('./routes/serviceRouter.js');
// const feedbackRouter = require('./routes/feedbackRouter.js');
// const scheduleRouter = require('./routes/scheduleRouter.js');



const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const {DB_HOST} = process.env;
mongoose.set('strictQuery', true);

const app = express();

app.use(cors());
app.use(morgan("tiny"));

app.use(express.json());

// Статичні файли
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/persons', personRouter);



// app.use("/api/visits", visitsRouter);
// app.use("/api/email", emailRouter);
// app.use("/api/check-password", checkRouter);
// app.use("/api/service", serviceRouter);
// app.use("/api/feedback", feedbackRouter);
// app.use("/api/schedule", scheduleRouter);


app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});


mongoose.connect(DB_HOST)
.then(()=>{
  console.log('Database connection successful');
  app.listen(3002, () => {
  console.log("Server is running. Use our API on port: 3002");
})})
.catch(error=>{
  console.log(error.message)
  process.exit(1)
})