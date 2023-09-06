import { body } from 'express-validator';

export const reviewCreateValidation = [
  body('title', 'Введите заголовок отзыва (минимум 3 символа)').isLength({ min: 3 }).isString(),
  body('text', 'Введите текст отзыва (минимум 3 символа)').isLength({ min: 3 }).isString(),
  body('stars', 'Неверный формат оценки').optional().isInt({ min: 1, max: 5 }),
]