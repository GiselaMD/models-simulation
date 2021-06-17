import { randomInt } from 'crypto'
import {
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
    console.log('Cliente --> ' + cliente)

    if (filaDeClientesNoCaixa1.getSize() <= filaDeClientesNoCaixa2.getSize()) {
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
        new ClientHandler('ProcessoCliente', () => scheduler.uniform(1, 4))
      )
    )

    // Inicia processo do caixa
    scheduler.startProcessNow(
      scheduler.createProcess(
        new CachierHandler(
          'ProcessoEsperaAtendimentoCaixa' + this.numCaixaDestino,
          () => scheduler.uniform(1, 4),
          this.numCaixaDestino
        )
      )
    )
  }
}
