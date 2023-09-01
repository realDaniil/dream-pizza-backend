import { Router } from 'express'
import { checkAuth, handleValidationErrors } from '../utils/index.js'
import { ReviewController } from '../controllers/index.js'
import { reviewCreateValidation } from '../validations/review.js'
import checkAdmin from '../utils/checkAdmin.js'
const reviewRouter = new Router()

reviewRouter.get('/reviews', ReviewController.getAll)
reviewRouter.get('/reviews-from-high-to-low', ReviewController.getAllFromHighToLow)
reviewRouter.get('/reviews-from-low-to-high', ReviewController.getAllFromLowToHigh)
reviewRouter.get('/reviews/:id', ReviewController.update)
reviewRouter.post('/reviews', checkAuth, reviewCreateValidation, handleValidationErrors, ReviewController.create)
reviewRouter.patch('/reviews/:id', checkAuth, reviewCreateValidation, handleValidationErrors, ReviewController.update)
reviewRouter.delete('/reviews/:id', checkAuth, ReviewController.remove)

// reviewRouter.post('/reviews/save', checkAdmin, ReviewController.saveReviewsInSavedReviews)
reviewRouter.post('/reviews/copy', checkAdmin, ReviewController.copyFromSavedReviews)

export default reviewRouter