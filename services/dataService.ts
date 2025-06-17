
import { API_BASE_URL } from '../constants';
import { ClientRecord, ClientMetadata } from '../types';

interface BinDataResponse {
  record: ClientRecord;
  // JSONBin might include other metadata fields not strictly typed here
}

interface BinMetaResponse {
  record: { // This structure depends on JSONBin, assuming 'name' based on original script
    name?: string;
  };
  // other metadata fields
  totalTokens?: number; // Assuming this might be at the root of meta or inside record for used tokens
}


export async function fetchClientDataAndMetadata<T, U>(
  binId: string,
  masterKey: string
): Promise<{ recordData: T, metadata: U | null }> {
  if (!binId) {
    throw new Error('Bin ID is required.');
  }

  // Fetch main record
  const recordResponse = await fetch(`${API_BASE_URL}/${binId}`, {
    method: 'GET',
    headers: {
      'X-Master-Key': masterKey,
      'Content-Type': 'application/json',
    },
  });

  if (!recordResponse.ok) {
    throw new Error(`Error fetching record (${recordResponse.status}): ${recordResponse.statusText}`);
  }
  const recordData = (await recordResponse.json()) as { record: T };


  // Fetch metadata (best effort)
  let metadata: U | null = null;
  try {
    const metaResponse = await fetch(`${API_BASE_URL}/${binId}/meta`, {
      method: 'GET',
      headers: {
        'X-Master-Key': masterKey,
      },
    });
    if (metaResponse.ok) {
      // The original script implies metadata.record.name and also directly uses metadata.totalTokens.
      // JSONBin's actual /meta structure might vary. This attempts to align with original script logic.
      const rawMetaData = await metaResponse.json();
      metadata = {
        name: rawMetaData.record?.name, // name is likely nested in record
        totalTokens: rawMetaData.totalTokens // totalTokens could be top-level or nested
      } as U; // Cast needed due to dynamic structure. Adjust based on actual API.
    } else {
      console.warn(`Could not fetch metadata (${metaResponse.status}): ${metaResponse.statusText}`);
    }
  } catch (error) {
    console.warn('Error fetching metadata:', error);
  }
  
  return { recordData: recordData.record, metadata };
}
