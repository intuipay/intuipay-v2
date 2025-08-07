import {TiDBDataServiceResponse} from "@/types";

export async function fetchTidb<T>(
  url: string | URL,
  method: string = 'GET',
  body?: unknown,
): Promise<T[]> {
  const credentials = btoa(process.env.TIDB_CLOUD_API_KEY || '');
  url = `${process.env.TIDB_CLOUD_ENDPOINT}${url}`;

  console.log('fetchTidb', url, method, body);
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${credentials}`,
      'content-type': 'application/json',
    },
    method,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('URL', url);
      console.log('Body', body);
    }
    throw new Error(`HTTP error. status: ${response.status}`);
  }

  const result = (await response.json()) as TiDBDataServiceResponse<T>;
  return result.data.rows;
}
