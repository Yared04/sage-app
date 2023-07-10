import { DataCenter } from "./DataCenter";

export interface Project {
  _id: string;
  name: string;
  softwareCharacteristics: string;
  user: string;
  dataCenters: DataCenter[];
  createdAt: Date;
}
