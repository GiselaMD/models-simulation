import {
  atendenteCx1,
  atendenteCx2,
  filaDeClientesNaMesa2,
  filaDeClientesNaMesa4,
  filaDeClientesNoBalcao,
  filaDeClientesNoCaixa1,
  filaDeClientesNoCaixa2,
  filaDePedidosEntrandoCozinha,
  scheduler,
} from 'src'
import { Entity } from 'src/entity'
import { Process } from 'src/process'
import { KitchenHandler } from '../KitchenManager/kitchenHandler'
import { Order } from '../KitchenManager/order'
import { QueueTableHandler } from '../TableManager/queueTableHandler'

export class CachierHandler extends Process {
  numCaixa: number
  clienteSendoAtendidoNoCaixa: Entity | undefined

  constructor(name: string, duration: () => number, numCaixa: number) {
    super(name, duration)
    this.numCaixa = numCaixa
  }

  public executeOnStart() {
    if (!filaDeClientesNoCaixa1.isEmpty() && atendenteCx1.allocate(1)) {
      // se conseguir alocar um atendente, inicia o atendimento.
      console.log('inicio atendimento')
      if (this.numCaixa == 1) {
        this.clienteSendoAtendidoNoCaixa =
          filaDeClientesNoCaixa1.remove() as Entity
      } else {
        this.clienteSendoAtendidoNoCaixa =
          filaDeClientesNoCaixa2.remove() as Entity
      }
    } else {
      return false
    }
    return true
  }

  public executeOnEnd() {
    // Cria pedido e inicia serviço da cozinha
    const cliente = this.clienteSendoAtendidoNoCaixa as Entity
    filaDePedidosEntrandoCozinha.insert(
      new Order('pedido', cliente.getId() as string)
    )
    scheduler.startProcessNow(
      new KitchenHandler('KitchenHandler', () => scheduler.uniform(1, 4))
    )

    // Roteamento dos clientes para a mesa corresponte
    const nomeCliente = cliente.getName()
    if (nomeCliente == 'cliente1') {
      console.log(nomeCliente + ' indo para mesa')
      filaDeClientesNoBalcao.insert(this.clienteSendoAtendidoNoCaixa as Entity)
      scheduler.startProcessNow(
        new QueueTableHandler('QueueTableHandler-balcao', () =>
          scheduler.uniform(1, 1)
        )
      )
    } else if (nomeCliente == 'cliente2') {
      console.log(nomeCliente + ' indo para mesa')
      filaDeClientesNaMesa2.insert(this.clienteSendoAtendidoNoCaixa as Entity)
      scheduler.startProcessNow(
        new QueueTableHandler('QueueTableHandler-M2', () =>
          scheduler.uniform(1, 1)
        )
      )
    } else {
      console.log(nomeCliente + ' indo para mesa')
      filaDeClientesNaMesa4.insert(this.clienteSendoAtendidoNoCaixa as Entity)
      scheduler.startProcessNow(
        new QueueTableHandler('QueueTableHandler-M4', () =>
          scheduler.uniform(1, 1)
        )
      )
    }

    // Libera atendente
    if (this.numCaixa == 1) {
      atendenteCx1.release(1)
    } else {
      atendenteCx2.release(1)
    }
  }
}
