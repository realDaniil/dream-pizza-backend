import ReviewModel from '../models/Review.js';

export const create = async (req, res) => {
  try {
    const doc = new ReviewModel({
      title: req.body.title,
      text: req.body.text,
      stars: req.body.stars,
      user: req.userId
    })

    const review = await doc.save()
    res.json(review)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Не удалось создать отзыв' })
  }
}

export const getAll = async (req, res) => {
  try {
    const reviews = await ReviewModel.find().populate('user').exec()

    res.json(reviews)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Не удалось получить отзывы' })
  }
}

export const getOneById = async (req, res) => {
  try {
    const reviewId = req.params.id
    const review = await ReviewModel.findById({ _id: reviewId })

    if (!review) {
      return res.status(404).json({ message: 'Відгук не знайдено' })
    }

    res.json(review)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Не вдалося отримати відгук' })
  }
}

export const update = async (req, res) => {
  try {
    const reviewId = req.params.id

    const updateData = {
      title: req.body.title,
      text: req.body.text,
      user: req.userId,
      stars: req.body.stars,
      isChanged: true,
    }

    const updatedReview = await ReviewModel.findByIdAndUpdate(
      reviewId,
      updateData,
      { new: true }
    )

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' })
    }

    res.json(updatedReview)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Failed to update review' })
  }
}

export const remove = async (req, res) => {
  try {
    const reviewId = req.params.id
    const deletedReview = await ReviewModel.findByIdAndDelete({ _id: reviewId })

    if (!deletedReview) {
      return res.status(404).json({ message: 'Отзыв не найден' })
    }

    res.json({ deleted: true })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Не удалось удалить отзыв' })
  }
}