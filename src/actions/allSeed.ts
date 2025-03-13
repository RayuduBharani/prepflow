/* eslint-disable @typescript-eslint/no-unused-vars */
import { seedData, seedCompaniesImages,seedDSASheets } from "./seedAction";

export async function allSeed(prevState : {message? : string},formData : FormData) {
  try {
    const {message, processed, total} = await seedData()
    console.log(message, processed, total)
    await seedCompaniesImages()
    await seedDSASheets()
    return {message : 'Success'}
  } catch (e) {
    return {message : 'Error Occurred'}
  }
}