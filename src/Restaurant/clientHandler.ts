import { Entity } from 'src/entity'
import { EntitySet } from 'src/entitySet'
import { Process } from 'src/process'
import { Scheduler } from 'src/scheduler'

export class ClientHandler extends Process {
  filaDeClientesNoCaixa1: EntitySet
  filaDeClientesNoCaixa2: EntitySet
  scheduler: Scheduler

  constructor(
    name: string,
    duration: number,
    filaCx1: EntitySet,
    filaCx2: EntitySet
  ) {
    super(name, duration)
    this.filaDeClientesNoCaixa1 = filaCx1
    this.filaDeClientesNoCaixa2 = filaCx2
    this.scheduler = new Scheduler()
  }

  public executeOnStart() {
    const cliente = 'cliente' + this.scheduler.uniform(1, 4)

    if (
      this.filaDeClientesNoCaixa1.getSize() <
      this.filaDeClientesNoCaixa2.getSize()
    ) {
      this.filaDeClientesNoCaixa1.insert(new Entity({ name: cliente }))
    } else {
      this.filaDeClientesNoCaixa2.insert(new Entity({ name: cliente }))
    }
  }
}
