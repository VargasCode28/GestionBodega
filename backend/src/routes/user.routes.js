import { Router } from 'express'
import { auth } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/role.middleware.js'

import { 
    createWorker, 
    getWorkers, 
    toggleWorker ,
    updateWorker,
    deleteWorker


} from '../controllers/user.controller.js'



const router = Router()

router.use(auth, isAdmin)


router.post('/', createWorker)
router.get('/', getWorkers)
router.put('/:id/toggle', toggleWorker)


router.put('/:id', updateWorker)
router.delete('/:id', deleteWorker)

export default router
