import { body } from 'express-validator';

export const registrationValidation = [
  body('email', 'Введите почту').isEmail(),
  body('password', 'Пароль должен состоять минимум из 5 символов').isLength({ min: 5 }),
  body('fullName', 'Укажите имя').isLength({min: 3}),
  body('avatarUrl', 'Неверная ссылка аватарки').optional().isURL()
]

export const loginValidation = [
  body('email', 'Введите почту').isEmail(),
  body('password', 'Пароль должен состоять минимум из 5 символов').isLength({ min: 5 }),
]