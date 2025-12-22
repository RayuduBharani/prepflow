/* eslint-disable @typescript-eslint/no-unused-vars */
import { seedData, seedCompaniesImages,seedDSASheets } from "./seedAction";

export async function allSeed(prevState : {message? : string},formData : FormData) {
  try {
    console.log('Starting parallel seeding process...')

    // Run all three seed functions in parallel for much faster execution
    const [dataResult, companiesResult, sheetsResult] = await Promise.allSettled([
      seedData(),
      seedCompaniesImages(),
      seedDSASheets()
    ])

    // Log results
    if (dataResult.status === 'fulfilled') {
      const {message, processed, total} = dataResult.value
      console.log('seedData:', message, processed, total)
    } else {
      console.error('seedData failed:', dataResult.reason)
    }

    if (companiesResult.status === 'rejected') {
      console.error('seedCompaniesImages failed:', companiesResult.reason)
    } else {
      console.log('seedCompaniesImages: Success')
    }

    if (sheetsResult.status === 'rejected') {
      console.error('seedDSASheets failed:', sheetsResult.reason)
    } else {
      console.log('seedDSASheets: Success')
    }

    // Check if any failed
    const failures = [dataResult, companiesResult, sheetsResult].filter(r => r.status === 'rejected')

    if (failures.length > 0) {
      return {message : `Partially completed. ${failures.length} operation(s) failed. Check console for details.`}
    }

    return {message : 'All seeding completed successfully!'}
  } catch (e) {
    console.error('Seeding error:', e)
    return {message : 'Error Occurred'}
  }
}