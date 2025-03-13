'use server'
import { prisma } from "../prisma";
import { writeFileSync } from "fs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function extractData(formData : FormData) {
  try {
    const sheets = await prisma.sheets.findMany({
      select: {
        name : true,
        slug : true,
        categories: {
          select: {
            name : true,
            slug : true,
            problems: {
              select: {
                title: true,
                slug: true,
              },
            },
          },
        },

      },
    });

    writeFileSync("./sheets.json", JSON.stringify(sheets, null, 2));
    console.log("Success");
  } catch (error) {
    console.error("Error extracting data:", error);
    process.exit(1);
  }
}