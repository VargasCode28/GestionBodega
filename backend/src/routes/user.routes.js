import { Router } from 'express'
import { createWorker, getWorkers, toggleWorker } from '../controllers/user.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/role.middleware.js'

const router = Router()

router.use(auth, isAdmin)

router.post('/', createWorker)
router.get('/', getWorkers)
router.put('/:id/toggle', toggleWorker)

export default router
