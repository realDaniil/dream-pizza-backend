import TypeSchema from '../models/Type.js';

export const create = async (req, res) => {
  try {
    const doc = new TypeSchema({
      name: req.body.name
    })
    const type = await doc.save()
    res.json(type)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Не вдалося створити тип продукту' })
  }
}

export const getAll = async (req, res) => {
  try {
    const types = await TypeSchema.find()
    res.json(types)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Не вдалося отримати типи продуктів' })
  }
}

export const remove = async (req, res) => {
  try {
    const typeId = req.params.id
    const deletedType = await TypeSchema.findByIdAndDelete({ _id: typeId })

    if (!deletedType) {
      return res.status(404).json({ message: 'Тип продукту не знайдено' })
    }

    res.json({ deleted: true })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Не вдалося видалити тип продукту' })
  }
}