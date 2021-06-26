import { Entity } from '../../entity'

export class Order extends Entity {
  idCliente: string

  constructor(name: string, idCliente: string) {
    super({ name: name })
    this.idCliente = idCliente
  }

  /**
   * getIdCliente()
   * @returns id cliente
   */
  public getIdCliente() {
    return this.idCliente
  }
}
