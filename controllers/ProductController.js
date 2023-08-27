import ProductModel from '../models/Product.js';
import fs from 'fs'
import SavedProduct from '../models/copies/SavedProduct.js';

export const create = async (req, res) => {
  try {
    const doc = new ProductModel({
      name: req.body.name,
      ingredients: req.body.ingredients,
      prices: req.body.prices,
      imageUrl: req.body.imageUrl,
      type: req.body.type
    })
    const product = await doc.save()
    res.json(product)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Не вдалося створити продукт' })
  }
}


export const getAll = async (req, res) => {
  try {
    const products = await ProductModel.find()
    res.json(products)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Не вдалося отримати продукт' })
  }
}

export const getOneById = async (req, res) => {
  try {
    const productId = req.params.id
    const product = await ProductModel.findById({ _id: productId })

    if (!product) {
      return res.status(404).json({ message: 'Продукт не знайдено' })
    }

    res.json(product)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Не вдалося отримати продукт' })
  }
}


export const getAllByType = async (req, res) => {
  try {
    const productType = req.params.type
    const products = await ProductModel.find({ type: productType })
    res.json(products)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Не вдалося отримати продукт' })
  }
}


export const update = async (req, res) => {
  try {
    const reviewId = req.params.id
    const updateData = {
      name: req.body.name,
      ingredients: req.body.ingredients,
      prices: req.body.prices,
      imageUrl: req.body.imageUrl,
      type: req.body.type
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      reviewId,
      updateData,
      { new: true }
    )

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Продукт не знайдено' })
    }

    res.json(updatedProduct)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Не вдалося оновити продукт' })
  }
}

export const remove = async (req, res) => {
  try {
    const productId = req.params.id

    const product = await ProductModel.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Продукт не знайдено' })
    }

    const deletedProduct = await ProductModel.findByIdAndDelete({ _id: productId })
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Продукт не знайдено' })
    }
    // При удаления изображений в папке uploads, проблема в том что если у разных
    //     товаров будет одно изображение, то при удалении, оно у них всех пропадет  
    // const imagePath = product.imageUrl.slice(1)
    // if (fs.existsSync(imagePath)) {
    //   fs.unlinkSync(imagePath)
    // }

    res.json({ deleted: true })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Не вдалося видалити продукт' })
  }
}

export const saveProductsInSavedProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({})
    if (products.length > 0) {
      await SavedProduct.deleteMany({})
      const savedProducts = await SavedProduct.insertMany(products)
      res.json(savedProducts)
    } else {
      res.json({ message: 'Немає продуктів для завантаження' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Помилка під час завантаження продуктів' })
  }
}

export const copyFromSavedProducts = async (req, res) => {
  try {
    const savedProducts = await SavedProduct.find({})
    if (savedProducts.length > 0) {
      await ProductModel.deleteMany({})
      const products = await ProductModel.insertMany(savedProducts)
      res.json(products)
    } else {
      res.json({ message: 'Немає продуктів для копіювання' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Помилка під час копіювання продуктів' })
  }
}