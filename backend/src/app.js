import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'

import toolRoutes from './routes/tool.routes.js'
import loanRoutes from './routes/loan.routes.js'


const app = express()



app.use(cors())
app.use(express.json())


app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

app.use('/api/tools', toolRoutes)
app.use('/api/loans', loanRoutes)





export default app