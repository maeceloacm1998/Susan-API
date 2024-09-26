import { addLocationToHospitalSchema } from './addLocationToHospitalSchema';

async function runMigrations() {
  await addLocationToHospitalSchema();
}

runMigrations();
