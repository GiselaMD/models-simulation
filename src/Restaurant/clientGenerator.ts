import { Entity } from 'src/entity'
import { EntitySet } from 'src/entitySet'
import { Process } from 'src/process'

export class ClientGenerator extends Process {
  //timeLimit: number
  filaClientes: EntitySet

  constructor(name: string, duration: number, fila: EntitySet) {
    super(name, duration)
    this.filaClientes = fila
    //this.timeLimit = duration
  }

  public executeNow() {
    if (
      this.filaClientes.getMaxPossibleSize() <=
      this.filaClientes.getSize() + 1
    )
      this.filaClientes.insert(new Entity({ name: 'cliente' }))

    // Retorna tempo para proxima execucao (executar daqui 100 segundos)
    return 100
  }
}
