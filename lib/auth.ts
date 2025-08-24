// lib/api.ts
import api from "./api";

// Define the User type (replace this with your actual backend response structure)
interface User {
  id: string;
  name: string;
  email: string;
  // Add other user fields as needed
}

// Define the return type for the function
export async function getMe(): Promise<User | null> {
  try {
    const res = await api.get("/auth/me");

    if (res.status === 200) {
      return res.data; // Assuming your backend returns user data as a User object
    }

    // Handle unexpected response status (e.g., 204 No Content, 400 Bad Request)
    console.error(`Unexpected response status: ${res.status}`);
    return null;
  } catch (err: any) {
    console.error("Failed to fetch user data:", err); // Log the error for debugging
    return null; // Return null if the request fails
  }
}
