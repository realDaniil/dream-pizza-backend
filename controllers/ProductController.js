import ProductModel from '../models/Product.js';

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
    res.status(500).json({ message: 'Не вдалося створити продукт', error: error.errors, error })
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
    const deletedProduct = await ProductModel.findByIdAndDelete({ _id: productId })

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Продукт не знайдено' })
    }

    res.json({ deleted: true })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Не вдалося видалити продукт' })
  }
}