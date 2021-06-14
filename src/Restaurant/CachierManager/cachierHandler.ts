import { Entity } from 'src/entity'
import { EntitySet } from 'src/entitySet'
import { Process } from 'src/process'
import { Resource } from 'src/resource'
import { Order } from './order'

export class CachierHandler extends Process {
  filaDeClientesNoCaixa: EntitySet
  filaPedidoCozinha: EntitySet
  filaRoteiaClientes: EntitySet
  atendenteCaixa: Resource

  constructor(
    name: string,
    duration: number,
    filaCx: EntitySet,
    filaCozinha: EntitySet,
    filaRoteia: EntitySet,
    atendentes: Resource
  ) {
    super(name, duration)
    this.filaDeClientesNoCaixa = filaCx
    this.filaPedidoCozinha = filaCozinha
    this.filaRoteiaClientes = filaRoteia
    this.atendenteCaixa = atendentes
  }

  public executeOnStart() {
    if (!this.filaDeClientesNoCaixa.isEmpty()) {
      if (this.atendenteCaixa.allocate(1)) {
        // se conseguir alocar um atendente, inicia o atendimento.
        console.log('inicio atendimento')
        const cliente = this.filaDeClientesNoCaixa.remove() as Entity
        // TODO: Auto-agendar e depois inserir na fila do roteia
        //this.filaRoteiaClientes.insert(client)
        this.filaPedidoCozinha.insert(
          new Order('pedido', cliente.getId() as string)
        )
        //this.atendenteCaixa.release(1)
      }
    }
  }
}
