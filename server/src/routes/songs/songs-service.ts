import SongModel, { ISong } from './models/Song'
import ArtistModel, { IArtist } from './models/Artist'
import { uploadFile } from '../../middlewares/s3-middleware'
import mongoose from 'mongoose'

class SongsService {
  async createSong(
    song: Partial<ISong>,
    songBuffer: Buffer,
    songFileName: string,
    imageBuffer?: Buffer,
    imageFileName?: string
  ): Promise<ISong> {
    try {
      const bucketName = process.env.AWS_BUCKET_NAME!
      const songKey = `songs/${Date.now().toString()}-${songFileName}`
      const imageKey = imageFileName
        ? `images/${Date.now().toString()}-${imageFileName}`
        : undefined

      console.log('Uploading song file to S3:', { bucketName, songKey })
      const songUrl = await uploadFile(bucketName, songBuffer, songKey)
      console.log('Song file uploaded to S3:', songUrl)

      let imageUrl: string | undefined
      if (imageBuffer && imageKey) {
        console.log('Uploading image file to S3:', { bucketName, imageKey })
        imageUrl = await uploadFile(bucketName, imageBuffer, imageKey)
        console.log('Image file uploaded to S3:', imageUrl)
      }

      const newSong = new SongModel({ ...song, path: songUrl, image: imageUrl })
      console.log('Saving song to database:', newSong)
      const savedSong = await newSong.save()

      let artist = await ArtistModel.findOne({ name: song.artist })
      if (artist) {
        artist.songs.push(savedSong._id as mongoose.Types.ObjectId)
        if (!artist.photo && imageUrl) {
          artist.photo = imageUrl
        }
      } else {
        artist = new ArtistModel({
          name: song.artist,
          photo: imageUrl, 
          songs: [savedSong._id]
        })
      }
      await artist.save()

      return savedSong
    } catch (err) {
      console.error('Error creating song:', err)
      throw err
    }
  }

  async getSong(id: string): Promise<ISong | null> {
    try {
      return SongModel.findById(id)
    } catch (err) {
      console.error('Error getting song:', err)
      throw err
    }
  }

  async getAllSongs(): Promise<ISong[]> {
    try {
      return SongModel.find()
    } catch (err) {
      console.error('Error getting song:', err)
      throw err
    }
  }

  async deleteSong(id: string): Promise<ISong | null> {
    try {
      return SongModel.findByIdAndDelete(id)
    } catch (err) {
      console.error('Error deleting song:', err)
      throw err
    }
  }

  async getAllArtists(): Promise<IArtist[]> {
    try {
      console.log("getAllArtists called");
      const artists = await ArtistModel.find().populate('songs');
      console.log("Artists fetched:", artists);
      return artists;
    } catch (err) {
      console.error('Error getting artists:', err);
      throw err;
    }
  }

  async getSongsByArtist(artistId: string): Promise<ISong[]> {
    try {
      const artist = await ArtistModel.findById(artistId).populate('songs')
      if (!artist) throw new Error('Artist not found')
      return artist.songs as unknown as ISong[]
    } catch (err) {
      console.error('Error getting songs by artist:', err)
      throw err
    }
  }

  async getArtistById(artistId: string): Promise<IArtist[]> {
    try {
      const artist = await ArtistModel.findById(artistId)
      if (!artist) throw new Error('Artist not found')
      return artist as unknown as IArtist[]
    } catch (err) {
      console.error('Error getting songs by artist:', err)
      throw err
    }
  }
}

export default SongsService
