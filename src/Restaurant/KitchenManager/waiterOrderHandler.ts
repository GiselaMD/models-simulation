import {
  filaDeClientesEsperandoPedidoNaMesa2,
  filaDeClientesEsperandoPedidoNaMesa4,
  filaDeClientesEsperandoPedidoNoBalcao,
  filaDePedidosEsperandoEntrega,
  scheduler,
  waiterPetriNet,
} from '../..'
import { EntitySet } from '../../entitySet'
import { Process } from '../../process'
import { WaiterPetriNet } from '../WaiterManager/waiterPetriNet'
import { Order } from './order'

export class WaiterOrderHandler extends Process {
  mesa: string = ''
  constructor(name: string, duration: () => number) {
    super(name, duration)
  }

  public searchOrder(clientesEsperandoMesa: EntitySet) {
    for (let cliente of clientesEsperandoMesa.getEntitySet()) {
      //clientesEsperandoMesa.getEntitySet().forEach(cliente => {
      // TODO: Revisar esse aviso.
      for (let pedido of filaDePedidosEsperandoEntrega.getEntitySet()) {
        //filaDePedidosEsperandoEntrega.getEntitySet().forEach(pedido => {
        let order = pedido as Order
        if ((cliente.getId() as string) == order.getIdCliente()) {
          filaDePedidosEsperandoEntrega.removeById(order.getId() as string)
          return true
        }
      }
    }
    return false
  }

  public executeOnStart() {
    if (!filaDePedidosEsperandoEntrega.isEmpty()) {
      if (this.name == 'WaiterOrderHandler-balcao') {
        if (!this.searchOrder(filaDeClientesEsperandoPedidoNoBalcao)) {
          return false
        }
        this.mesa = 'balcao'
      } else if (this.name == 'WaiterOrderHandler-M2') {
        if (!this.searchOrder(filaDeClientesEsperandoPedidoNaMesa2)) {
          return false
        }
        this.mesa = 'M2'
      } else {
        if (!this.searchOrder(filaDeClientesEsperandoPedidoNaMesa4)) {
          return false
        }
        this.mesa = 'M4'
      }
    } else {
      return false
    }
    waiterPetriNet.petriNet?.getLugarByLabel('pedidoPronto')?.insereToken(1)
    scheduler.startProcessNow(
      scheduler.createProcess(
        new WaiterPetriNet(
          'WaiterPetriNet-' + this.mesa,
          () => scheduler.uniform(1, 4),
          'levandoPedido'
        )
      )
    )
    return true
  }
}