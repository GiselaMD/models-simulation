import { EntitySet } from 'src/entitySet'
import { Process } from 'src/process'
import { Scheduler } from 'src/scheduler'
import { Agent } from './agent'

export class ClientGenerator extends Process {
  //timeLimit: number
  filaClientes: EntitySet

  constructor(name: string, duration: number, fila: EntitySet) {
    super(name, duration)
    this.filaClientes = fila
    //this.timeLimit = duration
  }

  public newClient(time: number) {
    if (time < super.getDuration())
      this.filaClientes.insert(new Agent({name: 'cliente'}))
      // Retorna tempo para proxima execucao (executar daqui 100 segundos)
      return 100
}
