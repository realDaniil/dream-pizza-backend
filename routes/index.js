import { Router } from 'express'
import reviewRouter from './reviewRouter.js'
import productRouter from './productRouter.js'
import userRouter from './userRouter.js'
import typeRouter from './typesRouter.js'
const router = new Router()

router.use('/', reviewRouter)
router.use('/', productRouter)
router.use('/', userRouter)
router.use('/', typeRouter)

export { router }