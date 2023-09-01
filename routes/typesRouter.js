import { Router } from 'express'
import checkAdmin from '../utils/checkAdmin.js'
import { TypeController } from '../controllers/index.js'
import { handleValidationErrors } from '../utils/index.js'
import { typeCreateValidation } from '../validations/index.js'
const typeRouter = new Router()

typeRouter.get('/type', TypeController.getAll)
typeRouter.post('/type', checkAdmin, typeCreateValidation, handleValidationErrors, TypeController.create)
typeRouter.delete('/type/:name', checkAdmin, TypeController.remove)

// typeRouter.post('/type/save', checkAdmin, TypeController.saveTypesInSavedTypes)
typeRouter.post('/type/copy', checkAdmin, TypeController.copyFromSavedTypes)

export default typeRouter