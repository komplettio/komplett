import type { HasCreatedAt, HasId, HasUpdatedAt } from '#types/db.types';

export interface BaseModel extends HasId, HasCreatedAt, HasUpdatedAt {}

export type BaseCreateModel<T extends BaseModel> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
export type BaseUpdateModel<T extends BaseModel> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;
export type BaseDeleteModel<T extends BaseModel> = Pick<T, 'id'>;
