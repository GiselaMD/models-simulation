import { Entity } from 'src/entity'
import { EntitySet } from 'src/entitySet'
import { Process } from 'src/process'
import { Resource } from 'src/resource'

export class KitchenHandler extends Process {
  filaPedidoEntrandoCozinha: EntitySet
  filaPedidoEsperandoEntrega: EntitySet
  cozinheirosCozinha: Resource

  constructor(
    name: string,
    duration: number,
    filaCozinha: EntitySet,
    filaDeEntrega: EntitySet,
    cozinheiros: Resource
  ) {
    super(name, duration)
    this.filaPedidoEntrandoCozinha = filaCozinha
    this.filaPedidoEsperandoEntrega = filaDeEntrega
    this.cozinheirosCozinha = cozinheiros
  }

  public executeOnStart() {
    if (!this.filaPedidoEntrandoCozinha.isEmpty()) {
      if (this.cozinheirosCozinha.allocate(1)) {
        // se conseguir alocar um atendente, inicia o atendimento.
        console.log('inicio do ato de cozinhar')
        const pedido = this.filaPedidoEntrandoCozinha.remove() as Entity
        // TODO: Auto-agendar e depois inserir na fila do pedido esperando entrega
        //this.filaPedidoEsperandoEntrega.insert(pedido)
        //this.cozinheirosCozinha.release(1)
      }
    }
  }
}
