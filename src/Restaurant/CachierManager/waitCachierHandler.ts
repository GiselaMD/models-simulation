import { Entity } from 'src/entity'
import { EntitySet } from 'src/entitySet'
import { Process } from 'src/process'
import { Resource } from 'src/resource'
import { Order } from '../KitchenManager/order'

export class WaitCachierHandler extends Process {
  filaDeClienteSendoAtendidosNoCaixa: EntitySet
  filaPedidoCozinha: EntitySet
  atendenteCaixa: Resource

  constructor(
    name: string,
    duration: () => number,
    filaDeClienteSendoAtendidosNoCaixa: EntitySet,
    filaPedidoCozinha: EntitySet,
    atendenteCaixa: Resource
  ) {
    super(name, duration)
    this.filaDeClienteSendoAtendidosNoCaixa = filaDeClienteSendoAtendidosNoCaixa
    this.filaPedidoCozinha = filaPedidoCozinha
    this.atendenteCaixa = atendenteCaixa
  }

  public executeOnStart() {
    if (!this.filaDeClienteSendoAtendidosNoCaixa.isEmpty()) {
      const cliente = this.filaDeClienteSendoAtendidosNoCaixa.remove() as Entity
      this.filaPedidoCozinha.insert(
        new Order('pedido', cliente.getId() as string)
      )
      this.atendenteCaixa.release(1)
    }
  }
}
