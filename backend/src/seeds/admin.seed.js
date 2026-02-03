
import bcrypt from 'bcryptjs'
import User from '../models/User.model.js'
import { connectDB } from '../config/db.js'
import 'dotenv/config' 

const seedAdmin = async () => {
try {
    await connectDB()

    const adminExists = await User.findOne({ role: 'ADMIN' })

    if (adminExists) {
    console.log('Admin ya existe')
    process.exit(0)
    }

    const hashedPassword = await bcrypt.hash('123456', 10)

    const admin = new User({
    name: 'Administrador',
    email: 'admin@bodega.cl',
    password: hashedPassword,
    role: 'ADMIN',
    active: true
    })

    await admin.save()

    console.log('Admin creado correctamente')
    process.exit(0)

} catch (error) {
    console.error('Error al crear admin', error)
    process.exit(1)
}
}

seedAdmin()
