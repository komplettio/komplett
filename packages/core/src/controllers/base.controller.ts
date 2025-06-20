import type { Collection, Observable, Table, UpdateSpec } from 'dexie';
import Dexie, { liveQuery } from 'dexie';

import type { BaseCreateModel, BaseModel, BaseUpdateModel } from '#models/base.models';
import type { Filter, ListQueryOptions } from '#types/event.types';

const DEFAULT_LIMIT = 1000;
const DEFAULT_OFFSET = 0;
const DEFAULT_SORT = 'createdAt';
const DEFAULT_ORDER = 'asc';

export abstract class BaseController<
  TBase extends BaseModel = BaseModel,
  TSer extends TBase = TBase,
  TCreate extends BaseCreateModel<TBase> = BaseCreateModel<TBase>,
  TUpdate extends BaseUpdateModel<TBase> = BaseUpdateModel<TBase>,
  TID extends TBase['id'] = TBase['id'],
> {
  protected collection: Table<TBase, TID, TCreate>;
  private static _instances = new Map<new () => BaseController, BaseController>();

  constructor(collection: Table<TBase, TID, TCreate>) {
    this.collection = collection;
  }

  static getInstance<TClass extends BaseController>(this: new () => TClass): TClass {
    if (!BaseController._instances.has(this)) {
      BaseController._instances.set(this, new this());
    }

    return BaseController._instances.get(this) as TClass;
  }

  protected abstract _serialize(item: TBase): Promise<TSer>;

  public async create(item: TCreate): Promise<{ id: TBase['id']; data: TBase }> {
    return this.collection.add(item).then(async id => {
      const data = await this.getBaseById(id);
      if (!data) {
        throw new Error(`Item with ID ${id} not found after creation.`);
      }
      return {
        id,
        data,
      };
    });
  }

  public async update(id: TID, item: TUpdate): Promise<void> {
    // The casting is needed for some reason.
    await this.collection.update(id, item as UpdateSpec<TCreate>);
  }

  public getBaseById(id: TID): Promise<TBase | undefined> {
    return this.collection
      .where('id')
      .equals(id)
      .first()
      .then(item => {
        if (!item) {
          return undefined;
        }
        return item;
      });
  }

  public getById(id: TID): Promise<TSer | undefined> {
    return this.collection
      .where('id')
      .equals(id)
      .first()
      .then(item => {
        if (!item) {
          return undefined;
        }
        return this.serialize(item);
      });
  }

  public getMany(filters?: ListQueryOptions<TBase> | null): Promise<TSer[]> {
    return this.filter(filters).then(items => this.serializeMany(items));
  }

  public async delete(id: TID): Promise<void> {
    await this.collection.where('id').equals(id).delete();
  }

  public async deleteMany(ids: TID[]): Promise<void> {
    if (ids.length === 0) {
      return;
    }
    await this.collection.where('id').anyOf(ids).delete();
  }

  // Misc methods

  protected async serialize(item: TBase): Promise<TSer> {
    return this._serialize(item);
  }

  protected async serializeMany(items: TBase[]): Promise<TSer[]> {
    const serializedItems = await Promise.all(items.map(m => this.serialize(m)));
    return serializedItems;
  }

  protected async filter(filters?: ListQueryOptions<TBase> | null) {
    let result: Collection<TBase, TID, TCreate> | undefined;

    if (filters?.where) {
      const filteredProp = Object.keys(filters.where)[0] as keyof TBase;
      const filter = filters.where[filteredProp];

      if (filter) {
        const filterType = Object.keys(filter)[0] as keyof Filter;
        const filterValue = filter[filterType];

        if (filterValue) {
          const castValue = typeof filterValue === 'boolean' ? String(filterValue) : filterValue;
          const key = String(filteredProp);
          const query = this.collection.where(key);

          switch (filterType) {
            case 'eq':
              result = query.equals(castValue);
              break;
            case 'ne':
              result = query.notEqual(castValue);
              break;
            case 'gt':
              result = query.above(filterValue);
              break;
            case 'gte':
              result = query.aboveOrEqual(filterValue);
              break;
            case 'lt':
              result = query.below(filterValue);
              break;
            case 'lte':
              result = query.belowOrEqual(filterValue);
              break;
          }
        }
      }
    }

    result = this.collection.toCollection();

    result = result.limit(filters?.limit ?? DEFAULT_LIMIT).offset(filters?.offset ?? DEFAULT_OFFSET);

    if (filters?.orderBy) {
      const firstOrderKey = Object.keys(filters.orderBy)[0];

      const orderKey = (firstOrderKey ?? DEFAULT_SORT) as keyof TBase;
      const order = filters.orderBy[orderKey] ?? DEFAULT_ORDER;

      const res = await result.sortBy(String(orderKey));

      if (order === 'desc') {
        return res.reverse();
      }

      return res;
    }

    return result.toArray();
  }

  public liveQueryAll(): Observable<TSer[]> {
    return liveQuery(async () => {
      return Dexie.waitFor(this.getMany());
    });
  }
}
