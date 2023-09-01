import { Router } from 'express'
import { ProductController } from '../controllers/index.js'
import checkAdmin from '../utils/checkAdmin.js'
import { productCreateValidation } from '../validations/index.js'
import { handleValidationErrors } from '../utils/index.js'
const productRouter = new Router()

productRouter.get('/products', ProductController.getAll)
productRouter.get('/products/:id', ProductController.getOneById)
productRouter.get('/products-by-type/:type', ProductController.getAllByType)
productRouter.get('/products-top-sales', ProductController.getAllTopSales)
productRouter.post('/products', checkAdmin, productCreateValidation, handleValidationErrors, ProductController.create)
productRouter.patch('/products/:id', checkAdmin, productCreateValidation, handleValidationErrors, ProductController.update)
productRouter.delete('/products/:id', checkAdmin, ProductController.remove)

// productRouter.post('/products/save', checkAdmin, ProductController.saveProductsInSavedProducts)
productRouter.post('/products/copy', checkAdmin, ProductController.copyFromSavedProducts)

export default productRouter