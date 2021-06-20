import {
  cozinheiros,
  filaDePedidosEntrandoCozinha,
  filaDePedidosEsperandoEntrega,
} from '../..'
import { Entity } from '../../entity'
import { Process } from '../../process'
import color from 'colors'
import { Order } from './order'

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
    // TODO: Remover, apenas para teste
    console.log(filaDePedidosEntrandoCozinha.getSize())
    for (let pedido of filaDePedidosEntrandoCozinha.getEntitySet()) {
      //filaDePedidosEsperandoEntrega.getEntitySet().forEach(pedido => {
      let order = pedido as Order
      console.log(
        color.green(
          'ID do cliente dono do pedido ' +
            order.getIdCliente() +
            'ID pedido ' +
            order.getId()
        )
      )
    }

    if (!filaDePedidosEntrandoCozinha.isEmpty() && cozinheiros.canAllocate(1)) {
      return true
    }
    return false
  }

  public executeOnStart() {
    cozinheiros.allocate(1)
    console.log(
      color.blue(
        `Quantidade de cozinheiros existentes --> ${color.yellow(
          '' + cozinheiros.quantity
        )} e em uso ${color.yellow('' + cozinheiros.used)} cozinheiros`
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
