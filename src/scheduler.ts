import { RandVarGen } from 'random-variate-generators'
import { Entity } from './entity'
import { EntitySet, Mode } from './entitySet'
import { Process } from './process'
import { Resource } from './resource'
import { uuid } from 'uuidv4'

interface ProcessSchedule {
  [key: number]: Process[]
}
export class Scheduler {
  time: number = 0
  processSchedule: ProcessSchedule = {}
  entityList: Entity[] = []
  resourceList: Resource[] = []
  processList: Process[] = []
  entitySetList: EntitySet[] = []
  destroyedEntities: Entity[] = []
  maxActiveEntities: number = 0

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
    this.startProcessAt(process, this.time)

    // TODO: mover pro simulate
    // process.executeOnStart()
    // this.time += process.duration // clock é o tempo atual mais o tempo decorrido no processo
    // process.executeOnEnd()
  }

  /**
   * startProcessIn(process: string, timeToStart: number)
   * @param process
   * @param timeToStart
   * @returns o agendamento do começo do processo daqui a 10 minutos.
   */
  public startProcessIn(process: Process, timeToStart: number) {
    this.startProcessAt(process, this.time + timeToStart)
  }

  /**
   * startProcessAt(process: string, absoluteTime: number)
   * @param process
   * @param absoluteTime
   * @returns o agendamento do começo processo em um momento específico
   */
  public startProcessAt(process: Process, absoluteTime: number) {
    this.processSchedule = {
      ...this.processSchedule,
      [absoluteTime]: [...this.processSchedule[absoluteTime], process],
    }
    console.log(`processSchedule`, this.processSchedule)
  }

  /**
   * waitFor(time: number)
   * @param time
   * @returns se a abordagem para especificação da passagem de tempo nos processos for explícita
   */
  public async waitFor(time: number) {
    // sleep
    return new Promise(resolve => setTimeout(resolve, time * 1000))
  }

  // ---------- Controlando tempo de execução ----------

  private isProcessScheduleEmpty() {
    for (const processList of Object.values(this.processSchedule)) {
      if (processList.length !== 0) return false
    }
    return true
  }

  /**
   * simulate()
   * executa até esgotar o modelo, isto é, até a engine não ter mais nada para processar
   * @returns
   */
  public simulate() {
    while (!this.isProcessScheduleEmpty()) {
      //TODO: init
      this.time++
    }
  }

  /**
   * simulateOneStep()
   *
   * @returns
   */
  public simulateOneStep() {
    //TODO:
    // for (let process of this.processList) {
    //   if (process.isActive() && process.getNextExecution() == this.getTime()) {
    //     process.execute()
    //   }
    // }
  }

  /**
   * simulateBy(duration: number)
   * @param duration do processo
   * @returns
   */
  public simulateBy(duration: number) {
    for (let i = duration; i > 0; i--) {
      //TODO: init
      this.time++
    }
  }

  /**
   * simulateUntil()
   * @param absoluteTime tempo total da simulação
   * @returns a simulação com o tempo absoluto
   */
  public simulateUntil(absoluteTime: number) {
    for (let i = this.time; i <= absoluteTime; i++) {
      //TODO: init
      this.time++
    }
  }

  // ---------- criação, destruição e acesso para componentes ----------

  /**
   * createEntity(entity: Entity)
   * @param entity recebe o objeto entidade
   * @returns retorna o Entity
   */
  public createEntity(entity: Entity): Entity {
    entity.setId(uuid())
    entity.setCreationTime(this.time)
    this.entityList.push(entity)

    if (this.maxActiveEntities < this.entityList.length) {
      this.maxActiveEntities = this.entityList.length
    }

    return entity
  }

  /**
   * destroyEntity(id: string)
   * @param entity recebe o objeto entidade
   */
  public destroyEntity(id: string) {
    const entityIndex = this.entityList.findIndex(entity => entity.id === id)
    const [detroyedEntity] = this.entityList.splice(entityIndex, 1)
    detroyedEntity?.setDestroyedTime(this.time)
    this.destroyedEntities.push(detroyedEntity)
  }

  /**
   * getEntity(id: string)
   * @param id recebe o identificador da entidade
   */
  public getEntity(id: string) {
    const entity = this.entityList.find(entity => entity.getId() === id)

    if (!entity) {
      console.error(`getEntity: entity com ID ${id} nao existe`)
    }

    return entity
  }

  /**
   * createResource(resource: Resource)
   * @param name possui o nome do recurso
   * @param quantity recebe a quantidade alocada ao recurso
   * @returns
   */
  public createResource(resource: Resource) {
    resource.setId(uuid())
    this.resourceList.push(resource)
    return resource
  }

  /**
   * getResource(id: string)
   * @param id recebe o identificador do Recurso
   * @returns
   */
  public getResource(id: string) {
    const resource = this.resourceList.find(resource => resource.getId() === id)

    if (!resource) {
      console.error(`getResource: resource com ID ${id} nao existe`)
    }

    return resource
  }

  /**
   * createProcess(name: string, duration: number)
   * @param name recebe o nome do processo
   * @param duration aloca um tempo específico de duração
   * @returns o id do Processo criado.
   */
  public createProcess(process: Process): Process {
    process.setId(uuid())
    this.processList.push(process)
    return process
  }

  /**
   * getProcess(processId: string)
   * @param processId recebe o identificador do processo
   * @returns o objeto Processo
   */
  public getProcess(processId: string): Process | undefined {
    const process = this.processList.find(
      process => process.getId() === processId
    )

    if (!process) {
      console.error(`getProcess: Processo com ID ${processId} nao existe`)
    }

    return process
  }

  /**
   * createEntitySet(entitySet: EntitySet)
   * @param name possui o nome da entidade
   * @param mode seleciona o modo utilizado
   * @param maxPossibleSize passa o tamanho máximo da entity set
   * @returns o EntitySet
   */
  public createEntitySet(entitySet: EntitySet): EntitySet {
    entitySet.setId(uuid())
    this.entitySetList.push(entitySet)
    return entitySet
  }

  /**
   * getEntitySet(id: string)
   * @param id referente a entidade
   * @returns o EntitySet
   */
  public getEntitySet(id: string) {
    const entitySet = this.entitySetList.find(
      entitySet => entitySet.getId() === id
    )

    if (!entitySet) {
      console.error(`getEntitySet: entitySet com ID ${id} nao existe`)
    }

    return entitySet
  }

  // ---------- random variates ----------

  /**
   * uniform(minValue: number, maxValue: number)
   * @param minValue recebe o menor valor
   * @param maxValue recebe o maior valor
   * @returns o resultado da operação
   */
  public uniform(minValue: number, maxValue: number) {
    const rvg = new RandVarGen()
    return rvg.uniform(minValue, maxValue)
  }

  /**
   * exponential(meanValue: number)
   * @param meanValue recebe o valor médio
   * @returns o resultado da operação
   */
  public exponential(meanValue: number) {
    const rvg = new RandVarGen()
    return rvg.exponential(meanValue)
  }

  /**
   * normal(meanValue: number, stdDeviationValue: number)
   * @param meanValue recebe o valor médio
   * @param stdDeviationValue utiliza o valor de desvio do valor
   * @returns o resultado da operação
   */
  public normal(meanValue: number, stdDeviationValue: number) {
    const rvg = new RandVarGen()
    return rvg.normal(meanValue, stdDeviationValue)
  }

  // ---------- coleta de estatísticas ----------

  /**
   * getEntityTotalQuantity()
   * @returns quantidade de entidades criadas até o momento
   */
  public getEntityTotalQuantity() {
    return this.entityList.length
  }

  /**
   * getEntityTotalQuantityByName(name: string)
   * @param name recebe o nome da entidade
   * @returns quantidade de entidades criadas até o momento com o nome informado
   */
  public getEntityTotalQuantityByName(name: string) {
    return this.entityList.filter(entity => entity.name === name).length
  }

  /**
   * averageTimeInModel()
   * @returns tempo médio que as entidades permanecem no modelo (desde sua criação até sua destruição)
   */
  public averageTimeInModel() {
    let total = 0
    for (const entity of this.destroyedEntities) {
      total += entity.destroyedTime - entity.creationTime
    }

    return total / this.destroyedEntities.length
  }

  /**
   * maxEntitiesPresent()
   * @returns número máximo de entidades presentes no modelo até o momento
   */
  public maxEntitiesPresent() {
    return this.maxActiveEntities
  }
}
