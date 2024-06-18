import { Router } from 'express'
import authRouter from './auth/auth-router'
import songsRouter from './songs/songs-router'
// other routers can be imported here

const globalRouter = Router()

globalRouter.use('/auth', authRouter)
globalRouter.use('/songs', songsRouter)

export default globalRouter
