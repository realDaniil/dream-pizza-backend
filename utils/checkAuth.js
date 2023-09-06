import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

  if (token) {
    try {
      const decoded = jwt.verify(token, 'superQwerty')
      req.userId = decoded._id
      next()
    } catch (error) {
      return res.status(400).json({
        message: 'Нет доступа'
      })
    }
  } else {
    return res.status(400).json({
      message: 'Нет доступа'
    })
  }
}