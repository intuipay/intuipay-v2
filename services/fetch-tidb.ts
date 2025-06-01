import {TiDBDataServiceResponse} from "@/types";

export async function fetchTidb<T>(url: string, method: string = 'GET', body?: unknown): Promise<T[]> {
  const credentials = btoa(process.env.TIDB_CLOUD_API_KEY || '');
  const response = await fetch( url, {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      method,
    }
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = (await response.json()) as TiDBDataServiceResponse<T>;
  return result.data.rows;
}
