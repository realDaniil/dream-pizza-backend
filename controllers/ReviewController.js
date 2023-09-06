import ReviewModel from '../models/Review.js';
import SavedReview from '../models/copies/SavedReview.js';

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
    res.status(500).json({ message: 'Не вдалося створити відгук' })
  }
}

export const getAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10
    const skip = parseInt(req.query.skip) || 0

    const reviews = await ReviewModel.find()
      .populate('user')
      .skip(skip)
      .limit(limit)
      .exec()

    res.json(reviews)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Не вдалося отримати відгуки' })
  }
}

export const getAllFromHighToLow = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10
    const skip = parseInt(req.query.skip) || 0

    const reviews = await ReviewModel.find()
      .sort({ stars: -1 })
      .populate('user')
      .skip(skip)
      .limit(limit)
      .exec()

    res.json(reviews)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Не вдалося отримати відгуки' })
  }
}

export const getAllFromLowToHigh = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10
    const skip = parseInt(req.query.skip) || 0

    const reviews = await ReviewModel.find()
      .sort({ stars: 1 })
      .populate('user')
      .skip(skip)
      .limit(limit)
      .exec()

    res.json(reviews)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Не вдалося отримати відгуки' })
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

export const saveReviewsInSavedReviews = async (req, res) => {
  try {
    const reviews = await ReviewModel.find({})
    if (reviews.length > 0) {
      await SavedReview.deleteMany({})
      const savedReviews = await SavedReview.insertMany(reviews)
      res.json(savedReviews)
    } else {
      res.json({ message: 'Немає відгуків для завантаження' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Помилка під час завантаження відгуків' })
  }
}


export const copyFromSavedReviews = async (req, res) => {
  try {
    const savedReviews = await SavedReview.find({})
    if (savedReviews.length > 0) {
      await ReviewModel.deleteMany({})
      const reviews = await ReviewModel.insertMany(savedReviews)
      res.json(reviews)
    } else {
      res.json({ message: 'Немає відгуків для копіювання' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Помилка під час копіювання відгуків' })
  }
}