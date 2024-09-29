import mongoose, { Schema, Document } from 'mongoose';
import { HospitalDTO } from '../types/dto/hospital.dto';

export interface IHospitalSchema extends HospitalDTO, Document {}

const HospitalSchema: Schema = new Schema({
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

export default mongoose.model<IHospitalSchema>('policy', HospitalSchema);
