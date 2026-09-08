import { Router } from 'express'
import { auth } from '../middlewares/auth.middleware.js'
import { borrowTool, returnTool, getAllBorrows, clearReturnedBorrows } from '../controllers/borrow.controller.js'
import { isAdmin } from '../middlewares/isAdmin.middleware.js'

const router = Router()

router.get('/', auth, isAdmin, getAllBorrows)





router.post('/', auth, borrowTool)
router.put('/return/:id', auth, isAdmin, returnTool)
router.delete('/clear-returned', auth, isAdmin, clearReturnedBorrows)


router.get('/', auth, isAdmin, getAllBorrows)



export default router
