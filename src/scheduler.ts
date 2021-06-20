import { RandVarGen } from 'random-variate-generators'
import { Entity } from './entity'
import { EntitySet } from './entitySet'
import { Process } from './process'
import { Resource } from './resource'
import { uuid } from 'uuidv4'
import promptSync from 'prompt-sync'
import colors from 'colors'
import { randomInt } from 'crypto'

const prompt = promptSync({ sigint: true })

type ProcessItem = {
  engineProcess: Process
  type: string
}
interface ProcessSchedule {
  [key: number]: ProcessItem[]
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
  isDebbuger: boolean = false

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
    this.isDebbuger && console.log('startProcessNow, com id:', process.getId())
    this.startProcessAt(process, this.time)
  }

  /**
   * startProcessIn(process: string, timeToStart: number)
   * @param process
   * @param timeToStart
   * @returns o agendamento do começo do processo daqui a 10 minutos.
   */
  public startProcessIn(process: Process, timeToStart: number) {
    this.isDebbuger &&
      console.log(
        `startProcessIn, com id ${process.getId()} e timeToStart: ${timeToStart}`
      )
    this.startProcessAt(process, this.time + timeToStart)
  }

  /**
   * startProcessAt(process: string, absoluteTime: number)
   * @param process
   * @param absoluteTime
   * @returns o agendamento do começo processo em um momento específico
   */
  public startProcessAt(engineProcess: Process, absoluteTime: number) {
    this.isDebbuger &&
      console.log(
        `startProcessAt, com id ${engineProcess.getId()} e absoluteTime: ${absoluteTime}`
      )

    if (this.processSchedule[absoluteTime]) {
      this.processSchedule = {
        ...this.processSchedule,
        [absoluteTime]: [
          ...this.processSchedule[absoluteTime],
          { engineProcess, type: 'start' },
        ],
      }
    } else {
      this.processSchedule = {
        ...this.processSchedule,
        [absoluteTime]: [{ engineProcess, type: 'start' }],
      }
    }
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

  private async executeSimulation() {
    // Atualiza o tempo do modelo pro tempo atual do processo
    this.time = this.getNextTime()
    console.log(colors.bgBlue('TEMPO ATUAL: ' + this.time))
    // const processes = this.processSchedule[time]

    // Varre os processos do tempo "time"
    while (this.processSchedule[this.time].length > 0) {
      if (this.isDebbuger) {
        const continueResult = prompt(
          colors.yellow(
            '\nDeseja continuar (Qualquer tecla para continuar, "N" para encerrar)? \n'
          )
        )

        if (continueResult.toUpperCase() === 'N') {
          console.log('Encerrando a rede...')
          process.exit(0)
        }
      }

      // Remove o primeiro processo do array
      const { engineProcess, type } = this.processSchedule[
        this.time
      ].shift() as ProcessItem
      // const [{ engineProcess, type }] = processes.splice(0, 1)

      // Valida se é o ínicio ou fim da execução do processo
      if (type === 'start') {
        if (!engineProcess.canExecute()) {
          this.isDebbuger &&
            console.log(
              colors.red(
                `\tSem recursos para executar processo: --> Process ${
                  engineProcess.name
                } com id ${engineProcess.getId()} e time: ${this.time}`
              )
            )

          // Reagenda o início do processo baseado no tempo de duração dele
          if (this.processSchedule[this.time + 1]) {
            this.processSchedule[this.time + 1] = [
              ...this.processSchedule[this.time + 1],
              { engineProcess, type: 'start' },
            ]
          } else {
            this.processSchedule[this.time + 1] = [
              { engineProcess, type: 'start' },
            ]
          }
          continue
        }

        engineProcess.executeOnStart()
        const duration = engineProcess?.duration() || this.time

        this.isDebbuger &&
          console.log(
            `\t${colors.green('ExecuteOnStart():')} --> Process ${colors.yellow(
              `${engineProcess.name}`
            )} com id ${colors.yellow(
              `${engineProcess.getId()}`
            )} e time:  ${colors.yellow(`${this.time}`)}`
          )

        const endTime = this.time + duration
        // Reagenda o fim do processo baseado no tempo de duração dele
        if (this.processSchedule[endTime]) {
          this.processSchedule[endTime] = [
            ...this.processSchedule[endTime],
            { engineProcess, type: 'end' },
          ]
        } else {
          this.processSchedule[endTime] = [{ engineProcess, type: 'end' }]
        }
      } else {
        engineProcess.executeOnEnd()

        this.isDebbuger &&
          console.log(
            `\t${colors.green('ExecuteOnEnd():')}  --> Process ${colors.yellow(
              `${engineProcess.name}`
            )} com id ${colors.yellow(
              `${engineProcess.getId()}`
            )} e time:  ${colors.yellow(`${this.time}`)}`
          )
      }

      // Tabela com todas informações dos processos (nome, ID e type)
      // const printSchedule = Object.keys(this.processSchedule).map(key => {
      //   const elements: ProcessItem[] = this.processSchedule[key]

      //   let line = `${key} -> [`

      //   for (const element of elements) {
      //     line += `{ ${element.engineProcess.name} | ${element.engineProcess.id} | Type: ${element.type} } | `
      //   }

      //   return line + ' ]'
      // })
      //console.log(colors.green('processSchedule --> '), printSchedule)

      console.log(this.processSchedule)
    }

    // após processar todos dentro do tempo "time" remove a chave da estrutura
    // para na próxima iteração pegar os processos do próximo tempo
    if (Object.values(this.processSchedule[this.time]).length === 0) {
      delete this.processSchedule[this.time]
    }
  }

  /**
   * simulate()
   * executa até esgotar o modelo, isto é, até a engine não ter mais nada para processar
   * @returns
   */
  public simulate() {
    while (!this.isProcessScheduleEmpty()) {
      this.executeSimulation()
    }
    console.log('Finalizou simulate()')
  }

  /**
   * simulateOneStep()
   *
   * @returns
   */
  public simulateOneStep() {
    this.isDebbuger = true
    this.simulate()
  }

  /**
   * simulateBy(duration: number)
   * @param duration do processo
   * @returns
   */
  public simulateBy(duration: number) {
    // TODO: Implementar o simulateBy.
    while (this.time < duration) {
      this.executeSimulation()
    }
  }

  /**
   * simulateUntil()
   * @param absoluteTime tempo total da simulação
   * @returns a simulação com o tempo absoluto
   */
  public simulateUntil(absoluteTime: number) {
    while (true) {
      if (this.getNextTime() > absoluteTime) break
      this.executeSimulation()
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
    this.isDebbuger &&
      console.log(
        `createEntity, com id ${entity.getId()} e creationTime ${this.time}`
      )
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
    this.isDebbuger && console.log(`destroyEntity, com id ${id}`)
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
      console.error(colors.red(`getEntity: entity com ID ${id} nao existe`))
    }

    this.isDebbuger && console.log(`getEntity, com id ${id}`)

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
    this.isDebbuger && console.log(`createResource, com id ${resource.getId()}`)
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
      console.error(colors.red(`getResource: resource com ID ${id} nao existe`))
    }

    this.isDebbuger && console.log(`getResource, com id ${id}`)
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
    this.isDebbuger && console.log(`createProcess, com id ${process.getId()}`)
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
      console.error(
        colors.red(`getProcess: Processo com ID ${processId} nao existe`)
      )
    }

    this.isDebbuger && console.log(`getProcess, com id ${processId}`)

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
    this.isDebbuger &&
      console.log(`createEntitySet, com id ${entitySet.getId()}`)
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
      console.error(
        colors.red(`getEntitySet: entitySet com ID ${id} nao existe`)
      )
    }

    this.isDebbuger && console.log(`getEntitySet, com id ${id}`)

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
    // BUG: Não funciona.
    //const result = rvg.uniform(minValue, maxValue)
    //const result = randomInt(minValue, maxValue)
    const result = randomInt(2, 4)
    this.isDebbuger &&
      console.log(
        `Calculou uniform com minValue = ${minValue}, maxValue = ${maxValue}, e resultado = ${result}`
      )
    return result
  }

  /**
   * exponential(meanValue: number)
   * @param meanValue recebe o valor médio
   * @returns o resultado da operação
   */
  public exponential(meanValue: number) {
    const rvg = new RandVarGen()
    // BUG: Não funciona.
    //const result = rvg.exponential(meanValue)
    //const result = randomInt(meanValue, meanValue + 1)
    const result = randomInt(2, 4)
    this.isDebbuger &&
      console.log(
        `Calculou exponencial com meanValue = ${meanValue} e resultado = ${result}`
      )
    return result
  }

  /**
   * normal(meanValue: number, stdDeviationValue: number)
   * @param meanValue recebe o valor médio
   * @param stdDeviationValue utiliza o valor de desvio do valor
   * @returns o resultado da operação
   */
  // TODO: Precisa ter opção de colocar 2 ou 4 parâmetros
  public normal(
    meanValue: number,
    stdDeviationValue: number,
    a: number = 0,
    b: number = 0
  ) {
    const rvg = new RandVarGen()
    // BUG: Não funciona.
    //const result = rvg.normal(meanValue, stdDeviationValue)
    //const result = randomInt(meanValue, stdDeviationValue)
    const result = randomInt(2, 4)
    this.isDebbuger &&
      console.log(
        `Calculou normal com meanValue = ${meanValue}, stdDeviationValue = ${stdDeviationValue} e resultado = ${result}`
      )
    return result
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

  /**
   * getNextTime()
   * @returns número máximo de entidades presentes no modelo até o momento
   */
  public getNextTime() {
    return Object.keys(this.processSchedule)
      .map(parseFloat)
      .sort((a, b) => a - b)[0]
  }
}
