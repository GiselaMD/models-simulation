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

  public executeOnStart() {
    if (!filaDePedidosEntrandoCozinha.isEmpty() && cozinheiros.allocate(1)) {
      // se conseguir alocar um atendente, inicio do cozinhamento.
      console.log('inicio do cozinhamento')
      this.pedidoSendoPreparado =
        filaDePedidosEntrandoCozinha.remove() as Entity
    } else {
      return false
    }
    return true
  }

  public executeOnEnd() {
    filaDePedidosEsperandoEntrega.insert(this.pedidoSendoPreparado as Entity)
    cozinheiros.release(1)
  }
}
