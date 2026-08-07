
import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'

export const auth = async (req, res, next) => {

  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      message: 'No autorizado'
    })
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 🔥 buscar usuario real
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({
        message: 'Usuario no existe'
      })
    }

    req.user = user

    next()

  } catch {
    return res.status(401).json({
      message: 'Token inválido'
    })
  }
}

