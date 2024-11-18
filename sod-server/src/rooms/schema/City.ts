import { Structure } from './Structure'

export class City extends Structure {
  static Type = 'city'

  static create(id: string, owner: string) {
    return new City().assign({
      id,
      type: City.Type,
      owner
    })
  }
}
