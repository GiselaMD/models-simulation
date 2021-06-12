import { EntitySet } from './entitySet'

export class Entity {
  id: string | null
  name: string
  creationTime: number
  priority: number // -1 sem prioridade, 0 + alta até 255 + baixa
  petriNet: any // incluir a rede de petri
  sets: EntitySet[] // ids de sets

  constructor({ name, petriNet }: { name: string; petriNet?: any }) {
    this.id = null
    this.name = name
    this.creationTime = 0
    this.priority = -1 // set no priority as default
    this.petriNet = petriNet
    this.sets = []
  }

  /**
   * getId()
   * @returns Entity id
   */
  public getId() {
    return this.id
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
   * setPetriNet(petriNet)
   * @param petriNet - Rede de petri associada a entidade
   * @returns Lista de filas nas quais a entidade está inserida
   */
  public setPetriNet(petriNet: any) {
    this.petriNet = petriNet
  }
}
