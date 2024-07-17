import express from 'express'
import cors from 'cors'
import 'dotenv/config' //set the support of environment variable

//app config
const app = express() //to store instances of our express app
const port = process.env.PORT || 4000 //variable to define port no

//middlewares
app.use(express.json()) //using this middleware whenever we'll get any request, it will be passed using this json method
app.use(cors()) //connect frontend and backend

//initializing routes
app.get('/',(req,res) => res.send("API working")) //Handle get request to root URL(/)
app.listen(port, () => console.log(`Server started on ${port}`)) //start express file i.e. the server