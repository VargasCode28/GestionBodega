import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import toolRoutes from './routes/tool.routes.js'
import loanRoutes from './routes/loan.routes.js'
import borrowRoutes from './routes/borrow.routes.js'
import assistantRoutes from './routes/assistant.routes.js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'





const app = express()

const __dirname = path.dirname(fileURLToPath(import.meta.url))



app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))


app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

app.use('/api/tools', toolRoutes)
app.use('/api/loans', loanRoutes)


app.use('/api/borrow', borrowRoutes)
app.use('/api/assistant', assistantRoutes)





export default app