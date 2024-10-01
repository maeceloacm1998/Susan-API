import mongoose, { Schema, Document } from 'mongoose';
import { FireDTO } from '../types/dto/fire.dto';

export interface IFireSchema extends FireDTO, Document {}

const FireSchema: Schema = new Schema({
  name: { type: String, required: false },
  address: { type: String, required: false },
  geometry: { type: Schema.Types.Mixed, required: false },
  phoneNumber: { type: String, required: false },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

export default mongoose.model<IFireSchema>('fire', FireSchema);
