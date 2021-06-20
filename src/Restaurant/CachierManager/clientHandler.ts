import { randomInt } from 'crypto'
import {
  atendenteCx1,
  atendenteCx2,
  filaDeClientesNoCaixa1,
  filaDeClientesNoCaixa2,
  scheduler,
} from '../..'
import { Entity } from '../../entity'
import { Process } from '../../process'
import { CachierHandler } from './cachierHandler'

export class ClientHandler extends Process {
  numCaixaDestino: number = 0
  constructor(name: string, duration: () => number) {
    super(name, duration)
  }

  public executeOnEnd() {
    const cliente = 'cliente' + randomInt(1, 5)

    if (
      filaDeClientesNoCaixa1.getSize() <= filaDeClientesNoCaixa2.getSize() &&
      atendenteCx1.getQuantity() - atendenteCx1.used <=
        atendenteCx2.getQuantity() - atendenteCx2.used
    ) {
      filaDeClientesNoCaixa1.insert(
        scheduler.createEntity(new Entity({ name: cliente }))
      )
      this.numCaixaDestino = 1
    } else {
      filaDeClientesNoCaixa2.insert(
        scheduler.createEntity(new Entity({ name: cliente }))
      )
      this.numCaixaDestino = 2
    }

    // Se auto agenda
    scheduler.startProcessNow(
      scheduler.createProcess(
        new ClientHandler('ClientHandler', () => scheduler.exponential(3.0))
      )
    )

    // Inicia processo do caixa
    scheduler.startProcessNow(
      scheduler.createProcess(
        new CachierHandler(
          'CachierHandler' + this.numCaixaDestino,
          () => scheduler.normal(2, 8),
          this.numCaixaDestino
        )
      )
    )
  }
}
