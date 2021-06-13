import { EntitySet } from 'src/entitySet'
import { Process } from 'src/process'
import { Resource } from 'src/resource'
import { Order } from './order'

export class QueueWaitTable extends Process {
  clientesEsperandoMesa: EntitySet
  filaPedidoEsperandoEntrega: EntitySet
  garcons: Resource
  mesas: Resource

  constructor(
    name: string,
    duration: number,
    filaEsperaMesa: EntitySet,
    filaPedidoEsperandoEntrega: EntitySet,
    garcons: Resource,
    mesas: Resource
  ) {
    super(name, duration)
    this.clientesEsperandoMesa = filaEsperaMesa
    this.filaPedidoEsperandoEntrega = filaPedidoEsperandoEntrega
    this.garcons = garcons
    this.mesas = mesas
  }

  public executeOnStart() {
    if (
      !this.clientesEsperandoMesa.isEmpty() &&
      !this.filaPedidoEsperandoEntrega.isEmpty()
    ) {
      this.clientesEsperandoMesa.getEntitySet().forEach(cliente => {
        this.filaPedidoEsperandoEntrega.getEntitySet().forEach(pedido => {
          let order = pedido as Order
          if ((cliente.getId() as string) == order.getIdCliente()) {
            if (this.garcons.allocate(1)) {
              // TODO: Usar o schedule para o tempo do garcom levar o prato na mesa
              //this.garcons.release(1)
              console.log('Garcom levou pedido na mesa')
              // TODO: Usar o schedule para o tempo que o cliente ficar comendo
              //this.mesa.release(1)
              //this.clientesEsperandoMesa.removeById(cliente.getId() as string)
            }
          }
        })
      })
    }
  }
}
