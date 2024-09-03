import {Role} from "../enum/Role";
import {Office} from "./office.model";

export class User {
  id !: number;
  username !: string;
  password !: string;
  role !: Role;
  phone !: number;
  address !: string;
  active !: boolean;
  createdAt !: Date;
  updatedAt !: Date
  hypervisorId !: number
  bureauId !: number
  bureau !: Office
}
