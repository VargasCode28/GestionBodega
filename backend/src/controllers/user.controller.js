import User from '../models/User.model.js'
import bcrypt from 'bcryptjs'

export const createWorker = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' })
    }

    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(400).json({ message: 'El correo ya está registrado' })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hash,
      role: 'WORKER'
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      active: user.active
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al crear trabajador' })
  }
}

export const getWorkers = async (req, res) => {
  try {
    const users = await User
      .find({ role: 'WORKER' })
      .select('-password')

    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener trabajadores' })
  }
}

export const toggleWorker = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    user.active = !user.active
    await user.save()

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar estado' })
  }
}
