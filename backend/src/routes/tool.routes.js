import { Router } from 'express'
import {
    getTools, 
    createTool,
    updateTool,
    deleteTool


} from '../controllers/tool.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import {isAdmin} from '../middlewares/isAdmin.middleware.js'
import multer from 'multer'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'



const router = Router()

const uploadDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../uploads/tools')
fs.mkdirSync(uploadDirectory, { recursive: true })

const upload = multer({
    storage: multer.diskStorage({
        destination: uploadDirectory,
        filename: (_req, file, callback) => {
            const extension = path.extname(file.originalname).toLowerCase()
            callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`)
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, callback) => {
        callback(null, file.mimetype.startsWith('image/'))
    }
})


router.get('/', auth, getTools)
// router.post('/', auth,createTool)



router.post('/', auth, isAdmin, upload.single('image'), createTool)
router.put('/:id', auth, isAdmin, upload.single('image'), updateTool)
router.delete('/:id', auth, isAdmin, deleteTool)


// router.get('/', auth , getTools)



export default router
