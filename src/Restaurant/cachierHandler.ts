import { Entity } from 'src/entity'
import { EntitySet } from 'src/entitySet'
import { Process } from 'src/process'
import { Resource } from 'src/resource'

export class CachierHandler extends Process {
  //timeLimit: number
  cliente: Entity // Validar se vai precisar
  filaDeClientesNoCaixa: EntitySet
  atendente: Resource

  constructor(name: string, duration: number, fila: EntitySet) {
    super(name, duration)
    this.filaDeClientesNoCaixa = fila
    //this.timeLimit = duration
  }

  public executeNow() {
    if (!this.filaDeClientesNoCaixa.isEmpty()) {
      if (ate)
    }
    
    //   if (this.filaDeClientesNoCaixa.insert(new Entity({ nam
    // public generateTimeNextExecution() {
    //   return scheduler.uniform(1, 10)
  }
}
