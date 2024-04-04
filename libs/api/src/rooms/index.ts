import {
  GetBuildingsAvailabilityBody,
  GetLegacyRoomsAvailabilityBody,
} from '../../types';

interface JsonResponse<T> extends Response {
  json(): Promise<T>;
}

type FetchJSONPromise<T> = Promise<JsonResponse<T>>;

export const getAvailability = async (
  body: GetBuildingsAvailabilityBody
): FetchJSONPromise<GetLegacyRoomsAvailabilityBody> =>
  fetch('https://www.staycharlie.com.br/api/legado/availability', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
