import mongoose, { Document, Schema } from 'mongoose'

export interface ISong extends Document {
  title: string
  artist: string
  album?: string
  genre?: string
  year?: number
  duration?: number
  path: string
  image?: string
}

const SongSchema: Schema = new Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String, required: false },
  genre: { type: String, required: false },
  year: { type: Number, required: false },
  duration: { type: Number, required: false },
  path: { type: String, required: true },
  image: { type: String, required: false }
})

export default mongoose.model<ISong>('Song', SongSchema)
