import { uuid } from 'uuidv4'

export class Process {
  name: string
  processId: string
  duration: number
  active: boolean
  nextExecution: number

  constructor(name: string, duration: number) {
    this.name = name
    this.duration = duration
    this.processId = uuid()
    this.active = true
    this.nextExecution = 0
  }

  // Métodos

  /**
   * getProcessId()
   * @returns ID do processo
   */
  public getProcessId() {
    return this.processId
  }

  /**
   * getDuration()
   * @returns Duração do processo
   */
  public getDuration() {
    return this.duration
  }

  /**
   * getNextExecution()
   * @returns Quando o processo será executado
   */
  public getNextExecution() {
    return this.nextExecution
  }

  /**
   * setNextExecution()
   * @returns Edita quando o processo será executado
   */
  public setNextExecution(time: number) {
    this.nextExecution = time
  }

  /**
   * isActive()
   * @returns Status do processo, ativo ou não
   */
  public isActive() {
    return this.active
  }

  /**
   * activate(bool)
   * @returns seta o status do processo, ativo ou não
   */
  public activate(bool: boolean) {
    this.active = bool
  }

  /**
   * execute()
   * @returns executa quando for chamado
   */
  public execute() {
    this.executeOnStart()
    this.executeNow()
    this.executeAfter()
  }

  /**
   * executeOnStart()
   * @returns faz antes de executar o processo
   */
  public executeOnStart() {
    return
  }

  /**
   * execute()
   * @returns executa
   */
  public executeNow() {
    console.error('Método não implementado')
  }

  /**
   * executeOnStart()
   * @returns faz depois de executar o processo
   */
  //TODO: Descobrir o nome certo dentro do AnyLogic
  public executeAfter() {
    return
  }
}
