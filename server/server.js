import express from 'express'
import cors from 'cors'
import generateRoutes from './routes/generateRoutes.js'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
dotenv.config()
const PORT = process.env.PORT || 8000
const app = express()

connectDB()

app.use(cors())

app.use(express.json())


app.use('/api', generateRoutes)

app.get('/', (req, res) => {
    res.send('AI-WebGen is live...')
})

app.listen(PORT, ()=> {
    console.log(`server connected on port ${PORT}`);
})