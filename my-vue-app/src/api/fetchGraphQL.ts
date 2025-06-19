export const gqlFetch = async (
    query: string,
    variables: Record<string, any> = {},
    token: string
  ): Promise<any> => {
    const res = await fetch(
      "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query, variables }),
      }
    );
  
    if (!res.ok) {
      throw new Error(`Fetch failed: ${res.statusText}`);
    }
  
    const { data, errors } = await res.json();
    if (errors) {
      throw new Error(
        `GraphQL: ${errors.map((e: any) => e.message).join(", ")}`
      );
    }
    return data;
  };
