import mongoose from 'mongoose';

import policyScheme from '../models/schema/PolicyScheme';
import { env } from '../helpers/env';

export async function addLocationToHospitalSchema() {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      dbName: env.DB_NAME,
      user: env.DB_USER,
      pass: env.DB_PASS,
    });

    const documents = await policyScheme.find({});

    const bulkOps = documents.map((document) => {
      const geometry = document.geometry as unknown as {
          lat: any;
          lng: any; location: { lng: number, lat: number } 
};

      return {
        updateOne: {
          filter: { _id: document._id },
          update: {
            $set: {
              location: {
                type: 'Point',
                coordinates: [geometry.lng, geometry.lat],
              },
            },
          },
        },
      };
    });

    await policyScheme.bulkWrite(bulkOps);
    
    // Create 2dsphere index on location field
    await policyScheme.collection.createIndex({ location: '2dsphere' });
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await mongoose.disconnect();
  }
}