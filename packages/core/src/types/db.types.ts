export type UUID = string;

export interface HasId {
  id: UUID;
}

export interface HasCreatedAt {
  createdAt: Date;
}

export interface HasUpdatedAt {
  updatedAt: Date;
}
