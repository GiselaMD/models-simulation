import { Mode } from 'fs'
import { Entity } from './entity'
import { EntitySet } from './entitySet'
import { Process } from './process'
import { Resource } from './resource'

export class Scheduler {
  time: number = 0

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
   * @param duration do processo
   * @returns
   */
  public simulateBy(duration: number) {
    //TODO:
  }

  /**
   * simulateUntil()
   * @param absoluteTime tempo total da simulação
   * @returns a simulação com o tempo absoluto
   */
  public simulateUntil(absoluteTime: number) {
    //TODO:
  }

  // ---------- criação, destruição e acesso para componentes ----------

  /**
   * createEntity(entity: Entity)
   * @param entity recebe o objeto entidade
   */
  public createEntity(entity: Entity) {
    //TODO:
  }

  /**
   * destroyEntity(entity: Entity)
   * @param entity recebe o objeto entidade
   */
  public destroyEntity(entity: Entity) {
    //TODO:
  }

  /**
   * getEntity(id: string)
   * @param id recebe o identificador da entidade
   */
  public getEntity(id: string) {
    //TODO:
  }

  /**
   * createResource(name: string, quantity: number)
   * @param name possui o nome do recurso
   * @param quantity recebe a quantidade alocada ao recurso
   * @returns
   */
  public createResource(name: string, quantity: number) {
    //TODO:
    return 'id'
  }

  /**
   * getResource(id: string)
   * @param id recebe o identificador do Recurso
   * @returns
   */
  public getResource(id: string) {
    //TODO: Pegar do vetor onde tá o resource. Alterar...
    return Resource
  }

  /**
   * createProcess(name: string, duration: number)
   * @param name recebe o nome do processo
   * @param duration aloca um tempo específico de duração
   * @returns o id do Processo criado.
   */
  public createProcess(name: string, duration: number) {
    return 'processId'
  }

  /**
   * getProcess(processId: string)
   * @param processId recebe o identificador do processo
   * @returns o objeto Processo
   */
  public getProcess(processId: string) {
    return Process
  }

  /**
   * createEntitySet(name: string, mode: Mode, maxPossibleSize: number)
   * @param name possui o nome da entidade
   * @param mode seleciona o modo utilizado
   * @param maxPossibleSize passa o tamanho máximo da entity set
   * @returns o id do EntitySet
   */
  public createEntitySet(name: string, mode: Mode, maxPossibleSize: number) {
    return 'id'
  }

  /**
   * getEntitySet(id: string)
   * @param id referente a entidade
   * @returns o EntitySet
   */
  public getEntitySet(id: string) {
    return EntitySet
  }

  // ---------- random variates ----------

  /**
   * uniform(minValue: number, maxValue: number)
   * @param minValue recebe o menor valor
   * @param maxValue recebe o maior valor
   * @returns o resultado da operação
   */
  public uniform(minValue: number, maxValue: number) {
    return 0
  }

  /**
   * exponential(meanValue: number)
   * @param meanValue recebe o valor médio
   * @returns o resultado da operação
   */
  public exponential(meanValue: number) {
    return 0
  }

  /**
   * normal(meanValue: number, stdDeviationValue: number)
   * @param meanValue recebe o valor médio
   * @param stdDeviationValue utiliza o valor de desvio do valor
   * @returns o resultado da operação
   */
  public normal(meanValue: number, stdDeviationValue: number) {
    return 0
  }

  // ---------- coleta de estatísticas ----------

  /**
   * getEntityTotalQuantity()
   * @returns quantidade de entidades criadas até o momento
   */
  public getEntityTotalQuantity() {
    return 0
  }

  /**
   * getEntityTotalQuantityByName(name: string)
   * @param name recebe o nome da entidade
   * @returns quantidade de entidades criadas até o momento com o nome informado
   */
  public getEntityTotalQuantityByName(name: string) {
    return 0
  }

  /**
   * averageTimeInModel()
   * @returns tempo médio que as entidades permanecem no modelo (desde sua criação até sua destruição)
   */
  public averageTimeInModel() {
    return 0
  }

  /**
   * maxEntitiesPresent()
   * @returns número máximo de entidades presentes no modelo até o momento
   */
  public maxEntitiesPresent() {
    return 0
  }
}
