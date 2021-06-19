import { randomInt } from 'crypto'
import {
  atendenteCx1,
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

  public canExecute() {
    if (atendenteCx1.canAllocate(1)) {
      return true
    } else {
      console.log('Nao tem funcionário para alocar')
      return false
    }
  }

  public executeOnEnd() {
    const cliente = 'cliente' + randomInt(1, 5)
    //console.log(this.name + ': Cliente entrou no restaurante ')
    //console.log('Cliente --> ' + cliente)

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

    const createProcessClient = scheduler.createProcess(
      new ClientHandler('ProcessoCliente', () => scheduler.uniform(1, 4))
    )

    // Se auto agenda
    scheduler.startProcessNow(createProcessClient)

    console.log('PROCESSO CLIENTE', scheduler.getTime())

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
