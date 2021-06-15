import { Entity } from 'src/entity'
import { EntitySet } from 'src/entitySet'
import { Process } from 'src/process'
import { Resource } from 'src/resource'
import { Scheduler } from 'src/scheduler'

export class WaiterOrderHandler extends Process {
  filaPedidoEntrega: EntitySet
  garconsEntregando: Resource

  constructor(
    name: string,
    duration: () => number,
    filaDeEntrega: EntitySet,
    garcons: Resource
  ) {
    super(name, duration)
    this.filaPedidoEntrega = filaDeEntrega
    this.garconsEntregando = garcons
  }

  public executeOnStart() {
    if (!this.filaPedidoEntrega.isEmpty()) {
      if (this.garconsEntregando.allocate(1)) {
        // se conseguir alocar um atendente, inicia o atendimento.
        console.log('inicio da entrega dos pedidos')
        const entrega = this.filaPedidoEntrega.remove() as Entity
        // TODO: Auto-agendar e depois inserir na fila do pedido esperando entrega
        // TODO: Limpar mesa
        // TODO: Entregar na mesa específica
        //this.garconsEntregando.release(1)
      }
    }
  }
  public executeOnEnd() {}
}
