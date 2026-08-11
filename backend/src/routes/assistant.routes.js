import { Router } from 'express'
import { chatWithAssistant } from '../controllers/assistant.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/role.middleware.js'

const router = Router()

router.post('/chat', auth, isAdmin, chatWithAssistant)

export default router
