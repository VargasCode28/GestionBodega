import app from './app.js'
import {connectDB} from './config/db.js'
import dotenv from 'dotenv'






dotenv.config()

const PORT = 3000


connectDB()




app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`)
})