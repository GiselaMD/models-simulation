import { Entity } from 'src/entity'
import { EntitySet } from 'src/entitySet'
import { Process } from 'src/process'
import { Resource } from 'src/resource'
import { Scheduler } from 'src/scheduler'

export class QueueCleanTableHandler extends Process {
  filaGarcomLimpaMesa: EntitySet
  filaDeClienteEsperandoPedidoNaMesa: EntitySet
  garcons: Resource

  constructor(
    name: string,
    duration: number,
    mesasEsperandoGarcomLimpar: EntitySet,
    filaClientesEsperamMesa: EntitySet,
    garcons: Resource
    // sujas e limpas
  ) {
    super(name, duration)
    this.filaGarcomLimpaMesa = mesasEsperandoGarcomLimpar
    this.filaDeClienteEsperandoPedidoNaMesa = filaClientesEsperamMesa
    this.garcons = garcons
  }

  public executeOnStart() {
    if (!this.filaGarcomLimpaMesa.isEmpty()) {
      if (this.garcons.allocate(1)) {
        console.log('Solicitou garçom para limpar a mesa')
        // TODO: Usar o schedule do tempo que o garçom limpa a mesa
        // this.filaDeClienteEsperandoPedidoNaMesa.insert(
        //   this.filaGarcomLimpaMesa.remove() as Entity
        // )
      }
    }
  }
}
