import { Mode } from 'fs'
import { uuid } from 'uuidv4'
import { Entity } from './entity'
import { EntitySet } from './entitySet'
import { Process } from './process'
import { Resource } from './resource'

export class Scheduler {
  time: number = 0

  // Métodos

  /**
   * getTime()
   * @returns o tempo atual do modelo
   */
  public getTime() {
    return this.time
  }

  // ---------- Disparo de eventos e processos ----------

  /**
   * startProcessNow(process: Process)
   * @param process
   * @returns Inicializa o processo.
   */
  public startProcessNow(process: Process) {
    //TODO: Inicializa o processo.
  }

  /**
   * startProcessIn(processId: string, timeToStart: number)
   * @param processId
   * @param timeToStart
   * @returns o agendamento do começo do processo num horário específico (11:15)
   */
  public startProcessIn(processId: string, timeToStart: number) {
    //TODO: Agenda o começo do processo num horário específico (11:15)
  }

  /**
   * startProcessAt(processId: string, absoluteTime: number)
   * @param processId
   * @param absoluteTime
   * @returns o agendamento do começo processo em um momento específico (depois de 10 minutos)
   */
  public startProcessAt(processId: string, absoluteTime: number) {
    //TODO: Agenda o começo do processo em um momento específico (depois de 10 minutos)
  }

  /**
   * waitFor(time: number)
   * @param time
   * @returns se a abordagem para especificação da passagem de tempo nos processos for explícita
   */
  public waitFor(time: number) {
    //TODO: Pendente
  }

  // ---------- Controlando tempo de execução ----------

  /**
   * simulate()
   * @returns
   */
  public simulate() {
    //TODO:
  }

  /**
   * simulateOneStep()
   * @returns
   */
  public simulateOneStep() {
    //TODO:
  }

  /**
   * simulateBy(duration: number)
   * @param duration
   * @returns
   */
  public simulateBy(duration: number) {
    //TODO:
  }

  /**
   * simulateUntil()
   * @returns
   */
  public simulateUntil() {
    //TODO:
  }

  // ---------- criação, destruição e acesso para componentes ----------

  /**
   * createEntity(entity: Entity)
   * @param entity
   */
  public createEntity(entity: Entity) {
    //TODO:
  }

  /**
   * getEntity(id: string)
   * @param id
   */
  public getEntity(id: string) {
    //TODO:
  }

  /**
   * createResource(name: string, quantity: number)
   * @param name
   * @param quantity
   * @returns
   */
  public createResource(name: string, quantity: number) {
    //TODO:
    return 'id'
  }

  /**
   * getResource(id: string)
   * @param id
   * @returns
   */
  public getResource(id: string) {
    //TODO: Pegar do vetor onde tá o resource. Alterar...
    return Resource
  }

  /**
   * createProcess(name: string, duration: number)
   * @param name
   * @param duration
   * @returns
   */
  public createProcess(name: string, duration: number) {
    return 'processId'
  }

  /**
   * getProcess(processId: string)
   * @param processId
   * @returns
   */
  public getProcess(processId: string) {
    return Process
  }

  /**
   * createEntitySet(name: string, mode: Mode, maxPossibleSize: number)
   * @param name
   * @param mode
   * @param maxPossibleSize
   * @returns
   */
  public createEntitySet(name: string, mode: Mode, maxPossibleSize: number) {
    return 'id'
  }

  /**
   * getEntitySet(id: string)
   * @param id
   * @returns
   */
  public getEntitySet(id: string) {
    return EntitySet
  }

  // ---------- random variates ----------

  /**
   * uniform(minValue: number, maxValue: number)
   * @param minValue
   * @param maxValue
   * @returns
   */
  public uniform(minValue: number, maxValue: number) {
    return 0
  }

  /**
   * exponential(meanValue: number)
   * @param meanValue
   * @returns
   */
  public exponential(meanValue: number) {
    return 0
  }

  /**
   * normal(meanValue: number, stdDeviationValue: number)
   * @param meanValue
   * @param stdDeviationValue
   * @returns
   */
  public normal(meanValue: number, stdDeviationValue: number) {
    return 0
  }

  // ---------- coleta de estatísticas ----------

  /**
   *
   * @returns quantidade de entidades criadas até o momento
   */
  public getEntityTotalQuantity() {
    return 0
  }

  /**
   *
   * @param name
   * @returns quantidade de entidades criadas até o momento com o nome informado
   */
  public getEntityTotalQuantityByName(name: string) {
    return 0
  }

  /**
   *
   * @returns tempo médio que as entidades permanecem no modelo (desde sua criação até sua destruição)
   */
  public averageTimeInModel() {
    return 0
  }

  /**
   *
   * @returns número máximo de entidades presentes no modelo até o momento
   */
  public maxEntitiesPresent() {
    return 0
  }
}
