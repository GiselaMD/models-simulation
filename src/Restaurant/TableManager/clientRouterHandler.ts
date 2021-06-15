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
      const nomeCliente = this.filaRoteiaCliente.getEntitySet()[0].getName()
      if (nomeCliente == 'cliente1') {
        console.log(nomeCliente + ' indo para mesa')
        this.filaEsperaBalcao.insert(this.filaRoteiaCliente.remove() as Entity)
      } else if (nomeCliente == 'cliente2') {
        console.log(nomeCliente + ' indo para mesa')
        this.filaEsperaMesa2.insert(this.filaRoteiaCliente.remove() as Entity)
      } else {
        console.log(nomeCliente + ' indo para mesa')
        this.filaEsperaMesa4.insert(this.filaRoteiaCliente.remove() as Entity)
      }
    }
  }
}
