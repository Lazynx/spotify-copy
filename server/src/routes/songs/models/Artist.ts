import mongoose, { Document, Schema } from 'mongoose'

export interface IArtist extends Document {
  name: string
  description?: string
  photo?: string
  songs: mongoose.Types.ObjectId[]
}

const ArtistSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  photo: { type: String, required: false },
  songs: [{ type: Schema.Types.ObjectId, ref: 'Song', required: true }]
})

export default mongoose.model<IArtist>('Artist', ArtistSchema)
