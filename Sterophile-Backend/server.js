import express from 'express'
import cors from 'cors'
import 'dotenv/config' //set the support of environment variable
import songRouter from './src/routes/songRoute.js'
import connectDB from './src/config/mongodb.js'
import connectCloudinary from './src/config/cloudinary.js'

//app config
const app = express() //to store instances of our express app
const port = process.env.PORT || 4000 //variable to define port no
connectDB(); 
connectCloudinary();

//middlewares
app.use(express.json()) //using this middleware whenever we'll get any request, it will be passed using this json method
app.use(cors()) //connect frontend and backend

//initializing routes
app.use("/api/song",songRouter);

app.get('/',(req,res) => {
    res.send("API working")
}) //Handle get request to root URL(/)

app.listen(port, () => {
    console.log(`Server started on ${port}`)
}) //start express file i.e. the server 