import User from '../models/User.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Datos incompletos' })
    }

    const user = await User.findOne({ email })

    if (!user || !user.active) {
      return res.status(401).json({ message: 'Usuario no autorizado' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas' })
    }

    // const token = jwt.sign(
    //   { id: user._id, role: user.role },
    //   'SECRET_KEY',
    //   { expiresIn: '8h' }
    // )

  const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '8h' }
  )



    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' })
  }
}
