import { Entity } from 'src/entity'
import { EntitySet } from 'src/entitySet'
import { Process } from 'src/process'
import { Resource } from 'src/resource'

export class QueueTableHandler extends Process {
  clientesEsperandoMesa: EntitySet
  filaEsperandoGarcomLimpar: EntitySet
  mesasLivres: Resource

  constructor(
    name: string,
    duration: number,
    filaEsperaMesa: EntitySet,
    mesasEsperandoGarcomLimpar: EntitySet,
    mesasLivres: Resource // sujas e limpas
  ) {
    super(name, duration)
    this.clientesEsperandoMesa = filaEsperaMesa
    this.filaEsperandoGarcomLimpar = mesasEsperandoGarcomLimpar
    this.mesasLivres = mesasLivres
  }

  public executeOnStart() {
    if (!this.clientesEsperandoMesa.isEmpty()) {
      if (this.mesasLivres.allocate(1)) {
        // TODO: Usar o schedule para o tempo de ir até a mesa limpa
        console.log('Solicitou mesa para ser limpa')
        this.filaEsperandoGarcomLimpar.insert(
          this.clientesEsperandoMesa.remove() as Entity
        )
      }
    }
  }
}
