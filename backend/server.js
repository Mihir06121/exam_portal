const express = require("express")
const mongoose = require("mongoose")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require('dotenv').config();

const app = express()

const authRouter = require("./routes/authRoutes")
const centerRouter = require("./routes/centerRoutes")
const questionRouter = require("./routes/questionRoutes")
const studentsRouter = require('./routes/studentRoutes')
const cloudinaryRoutes = require('./routes/cloudinary')

mongoose
    .connect(process.env.DATABASE_LOCAL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('DB connected'))
    .catch(err => {
        console.log(err);
    });

app.use(morgan("dev"))

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json());
app.use(cookieParser())
if (process.env.NODE_ENV === 'development') {
    app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}
app.use(cors());

app.use('/api', authRouter)
app.use('/api', centerRouter)
app.use('/api', questionRouter)
app.use('/api', studentsRouter)
app.use('/api', cloudinaryRoutes)

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});