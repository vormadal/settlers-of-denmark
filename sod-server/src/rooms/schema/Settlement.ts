import { Structure } from './Structure'

export class Settlement extends Structure {
  static Type = 'settlement'

  static create(id: string, owner: string) {
    return new Settlement().assign({
      id,
      type: Settlement.Type,
      owner
    })
  }
}
