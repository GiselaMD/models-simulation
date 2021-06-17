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
    const cliente = 'cliente' + scheduler.uniform(1, 4)

    if (filaDeClientesNoCaixa1.getSize() < filaDeClientesNoCaixa2.getSize()) {
      filaDeClientesNoCaixa1.insert(new Entity({ name: cliente }))
      this.numCaixaDestino = 1
    } else {
      filaDeClientesNoCaixa2.insert(new Entity({ name: cliente }))
      this.numCaixaDestino = 2
    }

    // Se auto agenda
    scheduler.startProcessNow(
      new ClientHandler('ProcessoCliente', () => scheduler.uniform(1, 4))
    )

    // Inicia processo do caixa
    scheduler.startProcessNow(
      new CachierHandler(
        'ProcessoEsperaAtendimentoCaixa' + this.numCaixaDestino,
        () => scheduler.uniform(1, 4),
        this.numCaixaDestino
      )
    )
  }
}
