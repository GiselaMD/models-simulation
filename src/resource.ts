import { uuid } from 'uuidv4'

export class Resource {
  name: string
  resourceId: string
  resourceQuantity: number

  constructor(name: string, quantity: number) {
    this.name = name
    this.resourceQuantity = quantity
    this.resourceId = uuid()
  }

  // Métodos

  /**
   * allocate()
   * @returns a condição se o recurso foi alocado ou não
   */
  public allocate(quantity: number) {
    // TODO: Validar a alocação de recurso. Olhar para o processo?
    return false
  }

  /**
   * release()
   * @returns retira os recursos da fila
   */
  public release(quantity: number) {
    // TODO: Tirar o recurso da fila de recursos.
    return false
  }

  /**
   * allocationRate()
   * @returns retorna o percentual do tempo (em relação ao tempo total simulado) alocado para o recurso
   */
  public allocationRate() {
    const allocationRate: number = 0.0
    // TODO: Aloca um tempo em double para o percentual. 0.10 == 10% ?
    return allocationRate
  }

  /**
   * averageAllocation()
   * @returns retorna a quantidade média destes recursos que foram alocados (em relação ao tempo total simulado)
   */
  public averageAllocation() {
    const qtdResources: number = 0.0
    // TODO: Aloca uma quantidade média de recursos
    return qtdResources
  }
}
