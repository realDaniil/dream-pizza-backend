import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import UserModel from '../models/User.js'

export const registration = async (req, res) => {
  try {
    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    })

    const user = await doc.save()

    const token = jwt.sign(
      {
        _id: user._id
      },
      'superQwerty',
      {
        expiresIn: '30d'
      }
    )
    const { passwordHash, ...userData } = user._doc
    res.json({ ...userData, token })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Не удалось зарегистрироваться' })
  }
}

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email })

    if (!user) {
      return res.status(404).json({ message: 'Неверный логин или пароль' })
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

    if (!isValidPass) {
      return res.status(404).json({ message: 'Неверный логин или пароль' })
    }

    const token = jwt.sign(
      {
        _id: user._id
      },
      'superQwerty',
      {
        expiresIn: '30d'
      }
    )
    const { passwordHash, ...userData } = user._doc
    res.json({ ...userData, token })
  } catch (error) {
    res.status(500).json({ message: 'Не удалось авторизоваться' })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден'
      })
    }

    const { ...userData } = user._doc
    res.json({ userData })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Нет доступа' })
  }
}

export const updateUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    if (req.body.email) {
      user.email = req.body.email
    }
    if (req.body.fullName) {
      user.fullName = req.body.fullName
    }
    if (req.body.avatarUrl) {
      user.avatarUrl = req.body.avatarUrl
    }

    if (req.body.password && req.body.currentPassword) {
      const isPasswordCorrect = await bcrypt.compare(req.body.currentPassword, user.passwordHash)
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Текущий пароль введен неверно' })
      }
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(req.body.password, salt)
      user.passwordHash = hash
    }

    await user.save()

    const { passwordHash, ...userData } = user._doc
    res.json(userData)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Ошибка при обновлении данных пользователя' })
  }
}