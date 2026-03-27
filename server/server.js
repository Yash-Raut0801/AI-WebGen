import express from 'express'
import cors from 'cors'
import generateRoutes from './routes/generateRoutes.js'
import dotenv from 'dotenv'
dotenv.config()
const PORT = process.env.PORT || 8000
const app = express()


app.use(cors())

app.use(express.json())

app.use('/api', generateRoutes)

app.get('/', (req, res) => {
    res.send('AI-WebGen is live...')
})

app.listen(PORT, ()=> {
    console.log(`server connected on port ${PORT}`);
})