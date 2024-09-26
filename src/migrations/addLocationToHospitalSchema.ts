import mongoose from 'mongoose';

import hospitalSchema from '../models/schema/HospitalSchema';
import { env } from '../helpers/env';

export async function addLocationToHospitalSchema() {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      dbName: env.DB_NAME,
      user: env.DB_USER,
      pass: env.DB_PASS,
    });

    const documents = await hospitalSchema.find({});

    const bulkOps = documents.map((document) => ({
      updateOne: {
        filter: { _id: document._id },
        update: {
          $set: {
            location: {
              type: 'Point',
              coordinates: [
                document.geometry.location.lng,
                document.geometry.location.lat,
              ],
            },
          },
        },
      },
    }));

    await hospitalSchema.bulkWrite(bulkOps);

    // Create 2dsphere index on location field
    await hospitalSchema.collection.createIndex({ location: '2dsphere' });

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    mongoose.disconnect();
  }
}
