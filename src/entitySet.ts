import { uuid } from 'uuidv4'
import { Entity } from './entity'

export const enum Mode {
  FIFO = 'FIFO',
  LIFO = 'LIFO',
  P_BASED = 'P_BASED', // priority based
  NONE = 'NONE', // if none, método remove() sorteia qual entidade será removida. Utilizar removeById(id)
}

export class EntitySet {
  id: string
  name: string
  mode: Mode
  set: Array<Entity>
  maxPossibleSize: number

  constructor(name: string, mode: Mode, maxPossibleSize: number) {
    this.id = uuid()
    this.name = name
    this.mode = mode
    this.maxPossibleSize = maxPossibleSize
    this.set = []
  }

  /**
   * getMode()
   * @returns Modo da fila EntitySet
   */
  public getMode() {
    return this.mode
  }

  /**
   * setMode()
   * @returns define o modo da fila EntitySet
   */
  public setMode(mode: Mode) {
    this.mode = mode
  }

  /**
   * insert(Entity)
   * @returns Insere entidade na EntitySet
   */
  public insert(Entity: Entity) {
    this.set.push(Entity)
  }

  /**
   * remove()
   * @returns Remove da lista
   */
  public remove() {
    this.set.pop()
  }

  /**
   * removeById(id)
   * @returns Remove uma entidade específica da lista
   */
  public removeById(id: string) {
    this.set = this.set.filter(entity => entity.id !== id)
  }

  /**
   * isEmpty()
   * @returns Verifica se a fila está vazia
   */
  public isEmpty() {
    return this.set.length === 0
  }

  /**
   * isFull()
   * @returns Verifica se a fila está cheia
   */
  public isFull() {
    return this.set.length === this.maxPossibleSize
  }

  /**
   * findEntity(id)
   * @returns Retorna referência para uma Entity, se esta estiver presente nesta EntitySet coleta de estatísticas
   */
  public findEntity(id: string) {
    return this.set.filter(entity => entity.id !== id)?.[0]
  }

  /**
   * averageSize()
   * @returns Retorna quantidade média de entidades no conjunto
   */
  public averageSize() {
    // TODO
  }

  /**
   * getSize()
   * @returns Retorna quantidade de entidades presentes no conjunto no momento
   */
  public getSize() {
    return this.set.length
  }

  /**
   * getMaxPossibleSize()
   * @returns Retorna quantidade máxima da fila
   */
  public getMaxPossibleSize() {
    return this.maxPossibleSize
  }

  /**
   * setMaxPossibleSize()
   * @returns Define quantidade máxima da fila
   */
  public setMaxPossibleSize(size: number) {
    return (this.maxPossibleSize = size)
  }

  /**
   * averageTimeInSet()
   * @returns Retorna tempo médio que as entidades permaneceram neste conjunto
   */
  public averageTimeInSet() {
    // TODO
  }

  /**
   * maxTimeInSet()
   * @returns Retorna tempo mais longo que uma entidade permaneceu neste conjunto
   */
  public maxTimeInSet() {
    // TODO
  }

  /**
   * startLog(timeGap)
   * @returns Dispara a coleta (log) do tamanho do conjunto;
   * Esta coleta é realizada a cada timeGap unidades de tempo
   */
  public startLog(timeGap: any) {
    // TODO
  }

  /**
   * stopLog()
   * @returns Para a coleta (log)
   */
  public stopLog() {
    // TODO
  }

  /**
   * getLog()
   * @returns retorna uma lista contendo o log deste Resource até o momento;
   * Cada elemento desta lista é um par <tempoAbsoluto, tamanhoConjunto>
   */
  public getLog() {
    // TODO
  }
}
