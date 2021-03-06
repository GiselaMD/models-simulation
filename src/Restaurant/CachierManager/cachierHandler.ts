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
} from '../..'
import { Entity } from '../../entity'
import { Process } from '../../process'
import { KitchenHandler } from '../KitchenManager/kitchenHandler'
import { Order } from '../KitchenManager/order'
import { QueueTableHandler } from '../TableManager/queueTableHandler'
import colors from 'colors'

export class CachierHandler extends Process {
  numCaixa: number
  clienteSendoAtendidoNoCaixa: Entity | undefined

  constructor(name: string, duration: () => number, numCaixa: number) {
    super(name, duration)
    this.numCaixa = numCaixa
  }

  public canExecute() {
    if (this.numCaixa == 1) {
      if (!filaDeClientesNoCaixa1.isEmpty() && atendenteCx1.canAllocate(1)) {
        return true
      }
    } else {
      if (!filaDeClientesNoCaixa2.isEmpty() && atendenteCx2.canAllocate(1)) {
        return true
      }
    }
    return false
  }

  public executeOnStart() {
    // se conseguir alocar um atendente, inicia o atendimento.
    if (this.numCaixa == 1) {
      scheduler.isDebbuger &&
        console.log(
          this.name + ': Iniciando atendimento no caixa ' + this.numCaixa
        )
      atendenteCx1.allocate(1)
      scheduler.isDebbuger &&
        console.log(
          colors.blue(
            `Quantidade de atendentes existentes no CachierHandler1  --> ${colors.yellow(
              '' + atendenteCx1.quantity
            )} e em uso ${colors.yellow('' + atendenteCx1.used)} atendentes`
          )
        )
      this.clienteSendoAtendidoNoCaixa =
        filaDeClientesNoCaixa1.remove() as Entity
    } else {
      atendenteCx2.allocate(1)
      scheduler.isDebbuger &&
        console.log(
          colors.blue(
            `Quantidade de atendentes existentes no CachierHandler2  --> ${colors.yellow(
              '' + atendenteCx2.quantity
            )} e em uso ${colors.yellow('' + atendenteCx2.used)} atendentes`
          )
        )
      this.clienteSendoAtendidoNoCaixa =
        filaDeClientesNoCaixa2.remove() as Entity
    }
  }

  public executeOnEnd() {
    // Cria pedido e inicia servi??o da cozinha
    const cliente = this.clienteSendoAtendidoNoCaixa as Entity
    filaDePedidosEntrandoCozinha.insert(
      scheduler.createEntity(
        new Order('Order', cliente.getId() as string) as Entity
      )
    )

    scheduler.startProcessNow(
      scheduler.createProcess(
        new KitchenHandler('KitchenHandler', () =>
          // scheduler.normal(0.1, 35, 14, 5)
          scheduler.normal(14, 5)
        )
      )
    )

    // Roteamento dos clientes para a mesa corresponte
    const nomeCliente = cliente.getName()
    if (nomeCliente == 'cliente1') {
      filaDeClientesNoBalcao.insert(this.clienteSendoAtendidoNoCaixa as Entity)
      scheduler.startProcessNow(
        scheduler.createProcess(
          new QueueTableHandler('QueueTableHandler-balcao', () => 1)
        )
      )
    } else if (nomeCliente == 'cliente2') {
      filaDeClientesNaMesa2.insert(this.clienteSendoAtendidoNoCaixa as Entity)
      scheduler.startProcessNow(
        scheduler.createProcess(
          new QueueTableHandler('QueueTableHandler-M2', () => 1)
        )
      )
    } else {
      filaDeClientesNaMesa4.insert(this.clienteSendoAtendidoNoCaixa as Entity)
      scheduler.startProcessNow(
        scheduler.createProcess(
          new QueueTableHandler('QueueTableHandler-M4', () => 1)
        )
      )
    }
    scheduler.isDebbuger && console.log(nomeCliente + ' indo para mesa')

    // Libera atendente
    if (this.numCaixa == 1) {
      atendenteCx1.release(1)
    } else {
      atendenteCx2.release(1)
    }
  }
}
