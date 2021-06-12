export class Resource {
  id: string | null
  name: string
  quantity: number
  used: number

  constructor(name: string, quantity: number) {
    this.id = null
    this.name = name
    this.quantity = quantity
    this.used = 0
  }

  /**
   * getId()
   * @returns Resource id
   */
  public getId() {
    return this.id
  }

  /**
   * setId()
   * @param id - Id do resource
   */
  public setId(id: string): void {
    this.id = id
  }

  /**
   * allocate()
   * @param quantity de recursos na fila
   * @returns se conseguiu alocar ou não
   */
  public allocate(quantity: number) {
    if (quantity <= this.quantity - this.used) {
      this.used += quantity
      return true
    }
    return false
  }

  /**
   * release()
   * @param quantity de recursos na fila
   * @returns se conseguiu liberar ou não
   */
  public release(quantity: number) {
    if (quantity > this.quantity - this.used) {
      this.used -= quantity
      return true
    }
    return false
  }

  /**
   * allocationRate()
   * @returns retorna o percentual do tempo (em relação ao tempo total simulado) alocado para o recurso
   */
  // TODO: validar se o sor quer sobre o tempo total ou o tempo atual, e o que fazer no cenário do simulate()
  public allocationRate(time: number) {
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
