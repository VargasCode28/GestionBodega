import { Router } from 'express'
import {
    getTools, 
    createTool,
    updateTool,
    deleteTool


} from '../controllers/tool.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import {isAdmin} from '../middlewares/isAdmin.middleware.js'



const router = Router()


router.get('/', auth, getTools)
// router.post('/', auth,createTool)



router.post('/',auth, isAdmin, createTool)
router.put('/:id', auth, isAdmin, updateTool)
router.delete('/:id', auth, isAdmin, deleteTool)


// router.get('/', auth , getTools)



export default router
