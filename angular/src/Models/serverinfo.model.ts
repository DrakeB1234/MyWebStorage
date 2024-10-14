export interface ServerInfo {
  serverCurrentStorage?: number,
  serverMaxStorage?: number,
  serverCurrentStorageFormat?: string,
  serverMaxStorageFormat?: string,
  storedFiles?: number,
  serverTemperture?: number,
  serverUptime?: Date
}