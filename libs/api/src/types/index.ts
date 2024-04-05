export interface JsonResponse<T> extends Response {
  json(): Promise<T>;
}

export type FetchJSONPromise<T> = Promise<JsonResponse<T>>;

export interface GetBuildingsAvailabilityBody {
  city: string;
  start_date: string;
  end_date: string;
  guests: number;
}

export interface GetBuildingsAvailabilityResponse {
  data: Building[];
}

export interface GetLegacyRoomsAvailabilityBody {
  [key: number]: LegacyBuilding[];
}

export interface LegacyBuilding {
  property_name: string;
  property_id: string;
  room_types: LegacyRoom[];
}

export interface LegacyRoom {
  room_type_name: string;
  room_type_id: string;
  prices: LegacyPrices;
  units: number;
  available_units: number;
}

export interface LegacyPrices {
  total_rate: string;
  daily_rate: string;
  extra_rates: LegacyExtraRate[];
}

export interface LegacyExtraRate {
  name: string;
  value: number;
  value_float: string;
  percentage: boolean;
}

export interface Building {
  buildingName: string;
  slug: string;
  isVisible: boolean;
  buildingAddress: BuildingAddress;
  mainImage: string;
  images: Image[];
  buildingNote: number;
  totalReviews: number;
  buildingDescription: string;
  cbId: string;
  buildingSurroundings: BuildingSurroundings;
  buildingAmenities: BuildingAmenity[];
  categoryRooms: CategoryRoom[];
  lowestPrice: number;
}

export interface BuildingAddress {
  street: string;
  neighborhood: string;
  number: string;
  city: string;
  state: string;
  uf: string;
}

export interface Image {
  url: string;
  alt: string;
}

export interface BuildingSurroundings {
  description: string;
  image?: string;
  link: string;
}

export interface BuildingAmenity {
  name: string;
  code: string;
}

export interface CategoryRoom {
  id: number;
  name: string;
  metreage: number;
  photos: Photo[];
  items: Item[];
  maxGuests: number;
  assignedMotorCategories: string[];
}

export interface Photo {
  url: string;
  alt?: string;
  visible?: boolean;
  category_visible?: boolean;
  showing_index?: number;
  showing_category_index?: number;
}

export interface Item {
  id: number;
  name: string;
  isVisible: boolean;
  iconCode?: string;
}
