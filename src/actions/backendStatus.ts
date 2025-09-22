'use server'
export async function checkCompilerStatus() {
  try {
    const url = process.env.COMPILER_URL;

    if (!url) {
      return {
        success: false,
        error: "COMPILER_URL environment variable is not set",
      };
    }
    const res = await fetch(url, {cache : 'no-cache'});
    if (!res.ok) {
      return {
        success: false,
        error: "Compiler service error",
      };
    }
    await res.json();
    return {
      success: true,
      error: "",
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: "Internal Server Error",
    };
  }
}
