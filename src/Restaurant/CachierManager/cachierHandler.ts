import { Entity } from 'src/entity'
import { EntitySet } from 'src/entitySet'
import { Process } from 'src/process'
import { Resource } from 'src/resource'
import { Order } from '../KitchenManager/order'

export class CachierHandler extends Process {
  filaDeClientesNoCaixa: EntitySet
  filaPedidoCozinha: EntitySet
  filaDeClienteSendoAtendidosNoCaixa: EntitySet
  atendenteCaixa: Resource

  constructor(
    name: string,
    duration: () => number,
    filaCx: EntitySet,
    filaCozinha: EntitySet,
    filaClienteSendoAtendidosNoCaixa: EntitySet,
    atendentes: Resource
  ) {
    super(name, duration)
    this.filaDeClientesNoCaixa = filaCx
    this.filaPedidoCozinha = filaCozinha
    this.filaDeClienteSendoAtendidosNoCaixa = filaClienteSendoAtendidosNoCaixa
    this.atendenteCaixa = atendentes
  }

  public executeOnStart() {
    if (!this.filaDeClientesNoCaixa.isEmpty()) {
      if (this.atendenteCaixa.allocate(1)) {
        // se conseguir alocar um atendente, inicia o atendimento.
        console.log('inicio atendimento')
        this.filaDeClienteSendoAtendidosNoCaixa.insert(
          this.filaDeClientesNoCaixa.remove() as Entity
        )
      }
    }
  }
}
