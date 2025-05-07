import { NextResponse } from "next/server";
import { getCompanyTopicWiseProblems } from "@/actions/company-actions";

// Define a type for the platform (adjust based on your app's Platform type)
type Platform = "LEETCODE" | "GFG"; // Replace with your actual Platform enum/type

export async function GET(request: Request) {
  try {
    // Extract query parameters from the URL
    const { searchParams } = new URL(request.url);
    const company = searchParams.get("company");
    const topic = searchParams.get("topic");
    const platform = searchParams.get("platform");
    const userId = searchParams.get("userId");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const difficulty = searchParams.get("difficulty");
    const solved = searchParams.get("solved");

    // Validate required parameters
    if (!company || !topic || !platform) {
      return NextResponse.json(
        { error: "Missing required parameters: company, topic, or platform" },
        { status: 400 }
      );
    }

    // Call the server action with the extracted parameters
    const result = await getCompanyTopicWiseProblems(
      company,
      topic,
      platform as Platform,
      userId ?? undefined,
      page ? parseInt(page) : 1, // Default to page 1 if not provided
      limit ? parseInt(limit) : 10, // Default to limit 10 if not provided
      difficulty ?? undefined,
      solved ?? undefined
    );

    // Return the result as JSON
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching company topic problems:", error);
    return NextResponse.json(
      { error: "Failed to fetch problems" },
      { status: 500 }
    );
  }
}