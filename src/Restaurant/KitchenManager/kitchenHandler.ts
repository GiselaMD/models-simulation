import {
  cozinheiros,
  filaDePedidosEntrandoCozinha,
  filaDePedidosEsperandoEntrega,
} from '../..'
import { Entity } from '../../entity'
import { Process } from '../../process'

export class KitchenHandler extends Process {
  pedidoSendoPreparado: Entity | undefined

  constructor(name: string, duration: () => number) {
    super(name, duration)
  }

  public canExecute() {
    if (!filaDePedidosEntrandoCozinha.isEmpty() && cozinheiros.canAllocate(1)) {
      return true
    }
    return false
  }

  public executeOnStart() {
    console.log('inicio do cozimento')
    cozinheiros.allocate(1)
    this.pedidoSendoPreparado = filaDePedidosEntrandoCozinha.remove() as Entity
  }

  public executeOnEnd() {
    filaDePedidosEsperandoEntrega.insert(this.pedidoSendoPreparado as Entity)
    cozinheiros.release(1)
  }
}
