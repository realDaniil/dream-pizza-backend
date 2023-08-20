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

export const updateUserValidation = [
  body('email', 'Введите почту').optional().isEmail(),
  body('password', 'Пароль должен состоять минимум из 5 символов').optional().isLength({ min: 5 }),
  body('fullName', 'Укажите имя').optional().isLength({ min: 3 }),
  body('avatarUrl', 'Неверная ссылка аватарки').optional().isURL(),
  body('currentPassword').custom((value, { req }) => {
    if (req.body.password) {
      if (!value) {
        throw new Error('Требуется указать текущий пароль')
      }
    }
    return true;
  }),
]