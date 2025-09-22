"use server";

export async function getVisitorsCount() {
  try {
    // Use server-side environment variable (no NEXT_PUBLIC_ prefix)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const apiUrl = `${baseUrl}/api/visitors`;

    const res = await fetch(apiUrl, {
      next: { revalidate: 10 }, // Revalidate every hour
    });

    if (!res.ok) {
      console.error(`Failed to fetch visitors count: ${res.status} ${res.statusText}`);
      throw new Error(`HTTP ${res.status}: Failed to fetch visitors count`);
    }

    const data = await res.json();
        if (typeof data?.count !== 'number') {
      throw new Error('Invalid response format: count is not a number');
    }

    const { count }: { count: number } = data;

    return count;
  } catch (error) {
    console.error('Error in getVisitorsCount:', error);
    return 0;
  }
}