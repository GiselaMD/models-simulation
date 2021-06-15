import { Entity } from 'src/entity'
import { EntitySet } from 'src/entitySet'
import { Process } from 'src/process'
import { Resource } from 'src/resource'

export class QueueTableHandler extends Process {
  clientesEsperandoMesa: EntitySet
  filaEsperandoGarcomLimpar: EntitySet
  mesasLivres: Resource
  //garcom: Entity

  constructor(
    name: string,
    duration: () => number,
    filaEsperaMesa: EntitySet,
    mesasEsperandoGarcomLimpar: EntitySet,
    mesasLivres: Resource // sujas e limpas
    //garcom: Entity
  ) {
    super(name, duration)
    this.clientesEsperandoMesa = filaEsperaMesa
    this.filaEsperandoGarcomLimpar = mesasEsperandoGarcomLimpar
    this.mesasLivres = mesasLivres
    //this.garcom = garcom
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
