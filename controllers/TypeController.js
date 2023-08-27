import TypeSchema from '../models/Type.js';
import SavedType from '../models/copies/SavedType.js';

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
    const typeName = req.params.name
    const deletedType = await TypeSchema.findOneAndDelete({ name: typeName })

    if (!deletedType) {
      return res.status(404).json({ message: 'Тип продукту не знайдено' })
    }

    res.json({ deleted: true })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Не вдалося видалити тип продукту' })
  }
}

export const saveTypesInSavedTypes = async (req, res) => {
  try {
    const types = await TypeSchema.find({})
    if (types.length > 0) {
      await SavedType.deleteMany({})
      const savedTypes = await SavedType.insertMany(types)
      res.json(savedTypes)
    } else {
      res.json({ message: 'Немає типів для завантаження' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Помилка під час завантаження типів' })
  }
}

export const copyFromSavedTypes = async (req, res) => {
  try {
    const savedTypes = await SavedType.find({})
    if (savedTypes.length > 0) {
      await TypeSchema.deleteMany({})
      const types = await TypeSchema.insertMany(savedTypes)
      res.json(types)
    } else {
      res.json({ message: 'Немає типів для копіювання' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Помилка під час копіювання типів' })
  }
}