//TODO: Create the Waiter to handle the Petri Net.
// extend entity
// Parâmetro de rede de Petri

import { Entity } from 'src/entity'
import { EntitySet } from 'src/entitySet'

export class Waiter extends Entity {
  petriNet: any // incluir a rede de petri
  sets: EntitySet[] // ids de sets

  constructor({
    name,
    petriNet,
  }: {
    name: string
    priority?: number
    petriNet?: any
  }) {
    super({ name, petriNet })
    this.sets = []
  }

  /**
   * getName()
   * @returns Entity name
   */
  public getName() {
    return this.name
  }

  /**
   * getPriority()
   * @returns Entity priority
   */
  public getPriority() {
    return this.priority
  }

  /**
   * getTimeSinceCreation(now)
   * @param now - Tempo atual do modelo
   * @returns Tempo desde a criação
   */
  public getTimeSinceCreation(now: number): number {
    return now - this.creationTime
  }

  /**
   * getSets()
   * @returns Lista de filas nas quais a entidade está inserida
   */
  public getSets(): EntitySet[] {
    return this.sets
  }

  /**
   * setSet()
   * @param EntitySet - Adiciona uma nova fila na lista de filas desta entidade
   */
  public setSet(entitySet: EntitySet) {
    this.sets.push(entitySet)
  }

  /**
   * setId()
   * @param id - Id da Entidade
   */
  public setId(id: string) {
    this.id = id
  }

  /**
   * setPriority()
   * @param priority - prioridade da Entidade
   */
  public setPriority(priority: number) {
    this.priority = priority
  }

  /**
   * setCreationTime()
   * @param time - Tempo de criação
   */
  public setCreationTime(time: number) {
    this.creationTime = time
  }

  /**
   * setDestroyedTime()
   * @param time - Tempo de criação
   */
  public setDestroyedTime(time: number) {
    this.destroyedTime = time
  }

  /**
   * setPetriNet(petriNet)
   * @param petriNet - Rede de petri associada a entidade
   * @returns Lista de filas nas quais a entidade está inserida
   */
  public setPetriNet(petriNet: any) {
    this.petriNet = petriNet
  }
}
