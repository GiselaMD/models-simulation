import { EntitySet, Mode } from './entitySet'
import { Resource } from './resource'
import { Scheduler } from './scheduler'
import { ClientHandler } from './Restaurant/CachierManager/clientHandler'
import { RestroomRequestHandler } from './Restaurant/RestroomManager/restroomRequestHandler'
import { PetriNetHandler } from './Restaurant/PetriNetManager/petriNetHandler'

// Cria o Scheduler
export const scheduler = new Scheduler()

export const waiterPetriNet = new PetriNetHandler()
waiterPetriNet.createPetriNet()
// Quantidade de garçons
waiterPetriNet.petriNet?.getLugarByLabel('garcomLivre')?.insereToken(5)

//TODO: Resolver o problema do warning.
//TODO: Testar e validar o trabalho.
//TODO: Revisar o tempo do duration de todos os processos.

// ------------------------------ Recursos do sistema ------------------------------

export const atendenteCx1 = scheduler.createResource(
  new Resource('atendenteCx1', 1, () => scheduler.getTime())
)
export const atendenteCx2 = scheduler.createResource(
  new Resource('atendenteCx2', 1, () => scheduler.getTime())
)
export const cozinheiros = scheduler.createResource(
  new Resource('cozinheiros', 5, () => scheduler.getTime())
)
export const garcons = scheduler.createResource(
  new Resource('garcom', 5, () => scheduler.getTime())
)
export const bancosLivres = scheduler.createResource(
  new Resource('bancosBalcao', 10, () => scheduler.getTime())
)
export const mesas2Livres = scheduler.createResource(
  new Resource('mesas2', 10, () => scheduler.getTime())
)
export const mesas4Livres = scheduler.createResource(
  new Resource('mesas4', 10, () => scheduler.getTime())
)

// ------------------------------ Conjuntos de entidades do sistema ------------------------------

// Caixa
export const filaDeClientesNoCaixa1 = scheduler.createEntitySet(
  new EntitySet('cx1', 'FIFO' as Mode, 0)
)
export const filaDeClienteSendoAtendidosNoCaixa1 = scheduler.createEntitySet(
  new EntitySet('filaDeClienteSendoAtendidosNoCaixa1', 'FIFO' as Mode, 0)
)
export const filaDeClientesNoCaixa2 = scheduler.createEntitySet(
  new EntitySet('cx2', 'FIFO' as Mode, 0)
)
export const filaDeClienteSendoAtendidosNoCaixa2 = scheduler.createEntitySet(
  new EntitySet('filaDeClienteSendoAtendidosNoCaixa2', 'FIFO' as Mode, 0)
)
export const filaRoteia = scheduler.createEntitySet(
  new EntitySet('filaRoteia', 'FIFO' as Mode, 0)
)

// Cozinha
export const filaDePedidosEntrandoCozinha = scheduler.createEntitySet(
  new EntitySet('cozinha', 'FIFO' as Mode, 100)
)
export const filaDePedidosSendoPreparados = scheduler.createEntitySet(
  new EntitySet('pedidoEsperandoEntrega', 'FIFO' as Mode, 100)
)
export const filaDePedidosEsperandoEntrega = scheduler.createEntitySet(
  new EntitySet('pedidoEsperandoEntrega', 'FIFO' as Mode, 100)
)

// Bancos balcao
export const filaDeClientesNoBalcao = scheduler.createEntitySet(
  new EntitySet('filaBalcao', 'FIFO' as Mode, 100)
)
export const filaGarcomLimpaBalcao = scheduler.createEntitySet(
  new EntitySet('filaLimpaBalcao', 'FIFO' as Mode, 100)
)
export const filaDeClientesEsperandoPedidoNoBalcao = scheduler.createEntitySet(
  new EntitySet('esperandoNoBalcao', 'FIFO' as Mode, 100)
)
export const filaDeClientesComendoNoBalcao = scheduler.createEntitySet(
  new EntitySet('comendoBalcao', 'FIFO' as Mode, 100)
)

// Mesas de 2 lugares
export const filaDeClientesNaMesa2 = scheduler.createEntitySet(
  new EntitySet('filaM2', 'FIFO' as Mode, 100)
)
export const filaGarcomLimpaMesa2 = scheduler.createEntitySet(
  new EntitySet('filaLimpaM2', 'FIFO' as Mode, 100)
)
export const filaDeClientesEsperandoPedidoNaMesa2 = scheduler.createEntitySet(
  new EntitySet('esperandoM2', 'FIFO' as Mode, 100)
)
export const filaDeClientesComendoNaMesa2 = scheduler.createEntitySet(
  new EntitySet('comendoM2', 'FIFO' as Mode, 100)
)

// Mesas de 4 lugares
export const filaDeClientesNaMesa4 = scheduler.createEntitySet(
  new EntitySet('filaM4', 'FIFO' as Mode, 100)
)
export const filaGarcomLimpaMesa4 = scheduler.createEntitySet(
  new EntitySet('filaLimpaM4', 'FIFO' as Mode, 100)
)
export const filaDeClientesEsperandoPedidoNaMesa4 = scheduler.createEntitySet(
  new EntitySet('esperandoM4', 'FIFO' as Mode, 100)
)
export const filaDeClientesComendoNaMesa4 = scheduler.createEntitySet(
  new EntitySet('comendoM4', 'FIFO' as Mode, 100)
)

// ------------------------------ Gerenciando os processos do sistema ------------------------------

// Cria o processo de um cliente (clientes entrando no restaurante e sendo levado a um caixa especifico)

scheduler.startProcessNow(
  scheduler.createProcess(
    new ClientHandler('ClientHandler', () => scheduler.uniform(1, 4))
  )
)
scheduler.startProcessNow(
  scheduler.createProcess(
    new RestroomRequestHandler('RestroomRequestHandler', () =>
      scheduler.uniform(1, 4)
    )
  )
)

// ---------- Simulando o sistema ----------

// Simula o sistema até esgotar
//scheduler.simulateOneStep()
scheduler.simulate()
// scheduler.simulateOneStep()
// scheduler.simulateOneStep()
// scheduler.simulateOneStep()
// scheduler.simulateOneStep()
// scheduler.simulateOneStep()
// scheduler.simulateOneStep()
// scheduler.simulateOneStep()
// scheduler.simulateOneStep()
