import { Router } from 'express'
import { borrowTool, returnTool } from '../controllers/loan.controller.js'
import { auth } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/:toolId/borrow', auth, borrowTool)
router.put('/:loanId/return', auth, returnTool)

export default router
