import {TiDBDataServiceResponse} from "@/types";

export async function fetchTidb<T>(
  url: string | URL,
  method: string = 'GET',
  body?: unknown,
): Promise<T[]> {
  const credentials = btoa(process.env.TIDB_CLOUD_API_KEY || '');
  url = `${process.env.TIDB_CLOUD_ENDPOINT}${url}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${credentials}`,
      'content-type': 'application/json',
    },
    method,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    console.log('URL', url);
    throw new Error(`HTTP error. status: ${response.status}`);
  }

  const result = (await response.json()) as TiDBDataServiceResponse<T>;
  return result.data.rows;
}
