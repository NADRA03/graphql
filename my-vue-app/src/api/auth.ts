export const login = async (username: string, password: string) => {
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;
    const API_URL = "https://learn.reboot01.com/api/auth/signin";
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error("Invalid credentials");
    }
  
    const token = await response.json();
    return token;
  };