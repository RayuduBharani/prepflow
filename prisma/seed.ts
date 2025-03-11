import { seedData, seedCompaniesImages, seedDSASheets } from "@/actions/seedAction"
import { prisma } from "@/prisma"
async function main() {
  console.log('seeding database....')
  const {message, processed, total} = await seedData()
  console.log('Message:', message)
  console.log('Processed:', processed)
  console.log('Total:', total)
  await seedCompaniesImages()
  await seedDSASheets()
}
main().catch((e) => {
  console.error('Error seeding database.',e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})