import { Scheduler } from './scheduler'

export class Resource {
  id: string | null
  name: string
  quantity: number
  used: number
  timeScheduler: () => number

  timeAllocated: number
  timeAllocationStart: number

  qtdsAllocated: number[]

  constructor(name: string, quantity: number, timeScheduler: () => number) {
    this.id = null
    this.name = name
    this.quantity = quantity
    this.used = 0
    this.timeScheduler = timeScheduler
    this.timeAllocationStart = 0
    this.timeAllocated = 0
    this.qtdsAllocated = []
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
      this.timeAllocationStart = this.timeScheduler()
      this.qtdsAllocated.push(quantity)
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
      this.timeAllocated += this.timeScheduler() - this.timeAllocationStart
      return true
    }
    return false
  }

  /**
   * allocationRate()
   * @param schedulerTime tempo do scheduler, atual ou total
   * @returns retorna o percentual do tempo (em relação ao tempo total simulado) alocado para o recurso
   */
  public allocationRate(schedulerTime: number) {
    return this.timeAllocated / schedulerTime
  }

  /**
   * averageAllocation()
   * @returns retorna a quantidade média destes recursos que foram alocados (em relação ao tempo total simulado)
   */
  public averageAllocation() {
    return (
      this.qtdsAllocated.reduce((a, b) => a + b, 0) / this.qtdsAllocated.length
    )
  }
}
