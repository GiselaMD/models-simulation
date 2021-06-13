import { Process } from 'src/process'

export class ClientGenerator extends Process {
  //timeLimit: number
  //filaClientes: EntitySet

  constructor(name: string, duration: number) {
    super(name, duration)
    //this.filaClientes = fila
    //this.timeLimit = duration
  }

  public executeNow() {
    // if (
    //   this.filaClientes.getMaxPossibleSize() <=
    //   this.filaClientes.getSize() + 1
    // )
    //   this.filaClientes.insert(new Entity({ name: 'cliente' }))
  }

  public generateTimeNextExecution() {
    return scheduler.uniform(1, 10)
  }
}
