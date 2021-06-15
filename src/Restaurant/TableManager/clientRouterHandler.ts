import { Entity } from 'src/entity'
import { EntitySet } from 'src/entitySet'
import { Process } from 'src/process'

export class ClientRouterHandler extends Process {
  filaRoteiaCliente: EntitySet
  filaEsperaBalcao: EntitySet
  filaEsperaMesa2: EntitySet
  filaEsperaMesa4: EntitySet

  constructor(
    name: string,
    duration: () => number,
    filaRoteia: EntitySet,
    filaBalcao: EntitySet,
    filaMesa2: EntitySet,
    filaMesa4: EntitySet
  ) {
    super(name, duration)
    this.filaRoteiaCliente = filaRoteia
    this.filaEsperaBalcao = filaBalcao
    this.filaEsperaMesa2 = filaMesa2
    this.filaEsperaMesa4 = filaMesa4
  }

  public executeOnStart() {
    if (!this.filaRoteiaCliente.isEmpty()) {
      if (this.filaRoteiaCliente.getEntitySet()[0].getName() == 'cliente1') {
        // roteia para a mesa 1
        // TODO: Usar o schedule para o tempo de ir até a mesa
        this.filaEsperaBalcao.insert(this.filaRoteiaCliente.remove() as Entity)
      } else if (
        this.filaRoteiaCliente.getEntitySet()[0].getName() == 'cliente2'
      ) {
        // roteia para a mesa 2
        // TODO: Usar o schedule para o tempo de ir até a mesa
        this.filaEsperaMesa2.insert(this.filaRoteiaCliente.remove() as Entity)
      } else {
        // roteia para a mesa 4
        // TODO: Usar o schedule para o tempo de ir até a mesa
        this.filaEsperaMesa4.insert(this.filaRoteiaCliente.remove() as Entity)
      }
    }
  }
}
