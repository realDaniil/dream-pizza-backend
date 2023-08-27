import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs'
import { checkAuth, handleValidationErrors } from './utils/index.js';
import { ProductController, ReviewController, TypeController, UserController } from './controllers/index.js';
import checkAdmin from './utils/checkAdmin.js';
import { loginValidation, registrationValidation, reviewCreateValidation, productCreateValidation, updateUserValidation, typeCreateValidation } from './validations/index.js';

const app = express()
const PORT = 4444
const DB_URL = 'mongodb+srv://user:user@cluster-dream.jdxjjqj.mongodb.net/?retryWrites=true&w=majority'

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads')
    }
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => {
  res.send('Node JS')
})

app.post('/upload', checkAdmin, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/registration', registrationValidation, handleValidationErrors, UserController.registration)
app.patch('/auth/update', checkAuth, updateUserValidation, handleValidationErrors, UserController.updateUser)
app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/reviews', ReviewController.getAll)
app.get('/reviews-from-high-to-low', ReviewController.getAllFromHighToLow)
app.get('/reviews-from-low-to-high', ReviewController.getAllFromLowToHigh)
app.get('/reviews/:id', ReviewController.update)
app.post('/reviews', checkAuth, reviewCreateValidation, handleValidationErrors, ReviewController.create)
app.patch('/reviews/:id', checkAuth, reviewCreateValidation, handleValidationErrors, ReviewController.update)
app.delete('/reviews/:id', checkAuth, ReviewController.remove)

app.get('/products', ProductController.getAll)
app.get('/products/:id', ProductController.getOneById)
app.get('/products-by-type/:type', ProductController.getAllByType)
app.post('/products', checkAdmin, productCreateValidation, handleValidationErrors, ProductController.create)
app.patch('/products/:id', checkAdmin, productCreateValidation, handleValidationErrors, ProductController.update)
app.delete('/products/:id', checkAdmin, ProductController.remove)


app.get('/type', TypeController.getAll)
app.post('/type', checkAdmin, typeCreateValidation, handleValidationErrors, TypeController.create)
app.delete('/type/:name', checkAdmin, TypeController.remove)


app.post('/reviews/save', checkAdmin, ReviewController.saveReviewsInSavedReviews)
app.post('/reviews/copy', checkAdmin, ReviewController.copyFromSavedReviews)
app.post('/users/save', checkAdmin, UserController.saveUsersInSavedUsers)
app.post('/users/copy', checkAdmin, UserController.copyFromSavedUsers)
app.post('/products/save', checkAdmin, ProductController.saveProductsInSavedProducts)
app.post('/products/copy', checkAdmin, ProductController.copyFromSavedProducts)
app.post('/type/save', checkAdmin, TypeController.saveTypesInSavedTypes)
app.post('/type/copy', checkAdmin, TypeController.copyFromSavedTypes)



const startApp = async () => {
  try {
    await mongoose.connect(DB_URL)
    console.log('DB ok')
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.log('Ошибка при подключении к Mongo DB', error)
  }
}

startApp()