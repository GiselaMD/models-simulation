import { Entity } from 'src/entity'
import { EntitySet } from 'src/entitySet'
import { Process } from 'src/process'

export class ClientHandler extends Process {
  filaDeClientesNoCaixa1: EntitySet
  filaDeClientesNoCaixa2: EntitySet

  constructor(
    name: string,
    duration: number,
    filaCx1: EntitySet,
    filaCx2: EntitySet
  ) {
    super(name, duration)
    this.filaDeClientesNoCaixa1 = filaCx1
    this.filaDeClientesNoCaixa2 = filaCx2
  }

  public executeOnStart() {
    if (
      this.filaDeClientesNoCaixa1.getSize() <
      this.filaDeClientesNoCaixa2.getSize()
    ) {
      this.filaDeClientesNoCaixa1.insert(new Entity({ name: 'clienteCx1' }))
    } else {
      this.filaDeClientesNoCaixa2.insert(new Entity({ name: 'clienteCx2' }))
    }
  }
}
