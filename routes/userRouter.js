import { Router } from 'express'
import { checkAuth, handleValidationErrors } from '../utils/index.js'
import { UserController } from '../controllers/index.js'
import { loginValidation, registrationValidation, updateUserValidation } from '../validations/index.js'
import checkAdmin from '../utils/checkAdmin.js'
const userRouter = new Router()

userRouter.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
userRouter.post('/auth/registration', registrationValidation, handleValidationErrors, UserController.registration)
userRouter.patch('/auth/update', checkAuth, updateUserValidation, handleValidationErrors, UserController.updateUser)
userRouter.get('/auth/me', checkAuth, UserController.getMe)

// userRouter.post('/users/save', checkAdmin, UserController.saveUsersInSavedUsers)
userRouter.post('/users/copy', checkAdmin, UserController.copyFromSavedUsers)

export default userRouter