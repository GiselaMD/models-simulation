import { Entity } from 'src/entity'
import { EntitySet } from 'src/entitySet'
import { Process } from 'src/process'
import { Resource } from 'src/resource'

export class WaitKitchenHandler extends Process {
  filaDePedidoSendoPreparado: EntitySet
  filaPedidoEsperandoEntrega: EntitySet
  cozinheiros: Resource

  constructor(
    name: string,
    duration: () => number,
    filaDePedidosSendoPreparadosNaCozinha: EntitySet,
    filaPedidoEsperandoEntrega: EntitySet,
    cozinheiros: Resource
  ) {
    super(name, duration)
    this.filaDePedidoSendoPreparado = filaDePedidosSendoPreparadosNaCozinha
    this.filaPedidoEsperandoEntrega = filaPedidoEsperandoEntrega
    this.cozinheiros = cozinheiros
  }

  public executeOnStart() {
    if (!this.filaDePedidoSendoPreparado.isEmpty()) {
      this.filaPedidoEsperandoEntrega.insert(
        this.filaDePedidoSendoPreparado.remove() as Entity
      )
      this.cozinheiros.release(1)
    }
  }
}
