import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth-middleware'
import SongsService from './songs-service'
import SongsController from './songs-controller'
import multer from 'multer'

const songsRouter = Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })

const songsService = new SongsService()
const songsController = new SongsController(songsService)

songsRouter.post(
  '/',
  upload.fields([
    { name: 'song', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]),
  songsController.createSong
)
songsRouter.get('/all', songsController.getAllSongs)
songsRouter.get('/artists', songsController.getAllArtists)
songsRouter.get('/artists/:id', songsController.getArtistById)
songsRouter.get('/artists/:id/songs', songsController.getSongsByArtist)
songsRouter.get('/:id', songsController.getSong)

export default songsRouter
