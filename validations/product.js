import { body, check } from 'express-validator';

export const productCreateValidation = [
  body('name', 'Введіть назву (мінімум 3 символи)').isLength({ min: 3 }).isString(),
  body('ingredients', 'Введіть інгредієнти (мінімум 3 символи)').optional().isArray(),
  body('prices.*.size')
    .isString()
    .custom(value => ['small', 'medium', 'large', 'any'].includes(value))
    .withMessage('Недопустимий розмір'),
  body('prices.*.price', 'Введіть ціну').isFloat({ min: 1 }),
  check('prices').isArray({ min: 1 }).withMessage('Невірний формат та ведіть розмір та ціну'),
  body('imageUrl', 'Невірний формат').isString(),
  body('type', 'Невірний формат').optional().isString()
]