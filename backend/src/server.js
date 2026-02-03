import app from './app.js'
import {connectDB} from './config/db.js'
import 'dotenv/config'


const PORT = 3000


connectDB()


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})