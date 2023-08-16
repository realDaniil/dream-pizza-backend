import jwt from 'jsonwebtoken';
import User from '../models/User.js'

export default async (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

  if (token) {
    try {
      const decoded = jwt.verify(token, 'superQwerty')
      req.userId = decoded._id
      const user = await User.findById(decoded._id)
      if (user && user.role === 'ADMIN') {
        next()
      } else {
        return res.status(400).json({
          message: 'Нема доступу'
        })
      }
    } catch (error) {
      return res.status(400).json({
        message: 'Нема доступу'
      })
    }
  } else {
    return res.status(400).json({
      message: 'Нема доступу'
    })
  }
}