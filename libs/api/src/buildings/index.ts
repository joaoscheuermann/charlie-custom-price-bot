import {
  GetBuildingsAvailabilityBody,
  GetBuildingsAvailabilityResponse,
} from '../types/index';

interface JsonResponse<T> extends Response {
  json(): Promise<T>;
}

export const getAvailability = async (
  body: GetBuildingsAvailabilityBody
): Promise<JsonResponse<GetBuildingsAvailabilityResponse>> =>
  fetch('https://www.staycharlie.com.br/api/getBuildingAvailability', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
