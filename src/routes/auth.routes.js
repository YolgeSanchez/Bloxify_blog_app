import { Router } from 'express'
import { login, logout, register, profile } from '../controllers/auth.controllers.js'

const router = Router()

router.post('/login', login)
router.post('/register', register)
router.post('/logout', logout)
router.get('/profile', profile)

export default router
