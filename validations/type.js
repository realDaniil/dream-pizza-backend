import { body } from 'express-validator';

export const typeCreateValidation = [
  body('name', 'Введіть тип (мінімум 3 символи)').isLength({ min: 3 }).isString(),
]