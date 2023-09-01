import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs'
import path from 'path'
import checkAdmin from './utils/checkAdmin.js';
import { router } from './routes/index.js';

const app = express()
const PORT = 4444
const DB_URL = 'mongodb+srv://user:user@cluster-dream.jdxjjqj.mongodb.net/?retryWrites=true&w=majority'

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))
app.use('/', router)

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads')
    }
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
    const ext = path.extname(file.originalname)
    const newFilename = `${path.basename(file.originalname, ext)}-${uniqueSuffix}${ext}`
    cb(null, newFilename)
  },
})

const upload = multer({ storage })

app.post('/upload', checkAdmin, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.filename}`
  })
})

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