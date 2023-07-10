export interface DataCenter {
  _id: string;
  name: string;
  country?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  numberOfCores?: number;
  voltage?: number;
  tdp?: number;
  dieSize?: number;
  transistorDensity?: number;
  technologyNode?: number;
  frequency?: {
    base: number;
    unit: string;
  };
  memoryCapacity?: number;
  memoryTechnology?: string;
  l1CacheSize?: number;
  diskCapacity?: number;
  diskType?: string;
  projectDataCenters?: string[];
}
