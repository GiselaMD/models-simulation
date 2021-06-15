import { Entity } from 'src/entity'
import { EntitySet } from 'src/entitySet'
import { Process } from 'src/process'
import { Resource } from 'src/resource'
import { Scheduler } from 'src/scheduler'

export class KitchenHandler extends Process {
  filaPedidoEntrandoCozinha: EntitySet
  filaPedidoSendoPreparado: EntitySet
  cozinheirosCozinha: Resource

  constructor(
    name: string,
    duration: () => number,
    filaPedidoEntrandoCozinha: EntitySet,
    filaPedidoSendoPreparado: EntitySet,
    cozinheiros: Resource
  ) {
    super(name, duration)
    this.filaPedidoEntrandoCozinha = filaPedidoEntrandoCozinha
    this.filaPedidoSendoPreparado = filaPedidoSendoPreparado
    this.cozinheirosCozinha = cozinheiros
  }

  public executeOnStart() {
    if (!this.filaPedidoEntrandoCozinha.isEmpty()) {
      if (this.cozinheirosCozinha.allocate(1)) {
        // se conseguir alocar um atendente, inicia do cozinhamento.
        console.log('inicio do cozinhamento')
        this.filaPedidoSendoPreparado.insert(
          this.filaPedidoEntrandoCozinha.remove() as Entity
        )
      }
    }
  }
}
