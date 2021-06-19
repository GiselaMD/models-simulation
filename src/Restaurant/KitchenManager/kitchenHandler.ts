import {
  cozinheiros,
  filaDePedidosEntrandoCozinha,
  filaDePedidosEsperandoEntrega,
} from '../..'
import { Entity } from '../../entity'
import { Process } from '../../process'
import color from 'colors'

export class KitchenHandler extends Process {
  pedidoSendoPreparado: Entity | undefined

  constructor(name: string, duration: () => number) {
    super(name, duration)
  }

  public canExecute() {
    console.log(
      color.green(
        `FILA DE PEDIDOS ENTRANDO COZINHA ${filaDePedidosEntrandoCozinha.getSize()}\n`
      )
    )

    if (!filaDePedidosEntrandoCozinha.isEmpty() && cozinheiros.canAllocate(1)) {
      return true
    }
    return false
  }

  public executeOnStart() {
    cozinheiros.allocate(1)
    console.log(
      color.blue(
        `inicio do cozimento possui ${cozinheiros.quantity} e em uso estão ${cozinheiros.used}`
      )
    )
    this.pedidoSendoPreparado = filaDePedidosEntrandoCozinha.remove() as Entity
  }

  public executeOnEnd() {
    filaDePedidosEsperandoEntrega.insert(this.pedidoSendoPreparado as Entity)
    cozinheiros.release(1)
    console.log(
      color.blue(
        `Fim do cozimento possui ${cozinheiros.quantity} e em uso estão ${cozinheiros.used}`
      )
    )
  }
}
