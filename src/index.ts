import { EntitySet, Mode } from './entitySet'
import { Resource } from './resource'
import { Scheduler } from './scheduler'
import { ClientHandler } from './Restaurant/CachierManager/clientHandler'
import { RestroomRequestHandler } from './Restaurant/RestroomManager/restroomRequestHandler'
import { PetriNetHandler } from './Restaurant/PetriNetManager/petriNetHandler'
import prompt from 'prompt-sync'
// Cria o Scheduler
export const scheduler = new Scheduler()

export const waiterPetriNet = new PetriNetHandler()
waiterPetriNet.createPetriNet()
// Quantidade de garçons
waiterPetriNet.petriNet?.getLugarByLabel('garcomLivre')?.insereToken(5)

// TODO: Realizar os logs finais

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

filaDeClientesNoCaixa1.startLog(10)

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

filaDePedidosEntrandoCozinha.startLog(10)

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

filaDeClientesNoBalcao.startLog(10)

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
    new ClientHandler('ClientHandler', () => scheduler.exponential(3.0))
  )
)
scheduler.startProcessNow(
  scheduler.createProcess(
    new RestroomRequestHandler('RestroomRequestHandler', () =>
      scheduler.normal(15, 5)
    )
  )
)

// ---------- Simulando o sistema ----------

while (true) {
  console.log('\n=== Execução ===')
  console.log('1. Simulate')
  console.log('2. SimulateOneStep')
  console.log('3. SimulateBy')
  console.log('4. SimulateUntil')
  console.log('9. Sair\n')

  const option = prompt({ sigint: true })('')

  switch (option) {
    case '1':
      scheduler.simulate()
      break
    case '2':
      scheduler.simulateOneStep()
      break
    case '3':
      const duration = prompt({ sigint: true })('Digite o duration:')
      scheduler.simulateBy(Number(duration))
      break
    case '4':
      const absoluteTime = prompt({ sigint: true })(
        'Digite quanto tempo você deseja executar:'
      )
      scheduler.simulateUntil(Number(absoluteTime))
      break
    case '9':
      console.log('Parando execução!')
      break
    default:
      console.log('Opção inválida.')
      break
  }

  if (option === '9') {
    break
  }
}

// Simula o sistema até esgotar
// scheduler.simulate()
// scheduler.simulateOneStep()
// scheduler.simulateUntil(71)

console.log('filaDeClientesNoCaixa1.getLog()', filaDeClientesNoCaixa1.getLog())
console.log(
  `filaDePedidosEntrandoCozinha.getLog()`,
  filaDePedidosEntrandoCozinha.getLog()
)

console.log(
  `filaDeClientesNoCaixa1.averageTimeInSet();`,
  filaDeClientesNoCaixa1.averageTimeInSet()
)
console.log(
  `filaDePedidosEntrandoCozinha.averageTimeInSet();`,
  filaDePedidosEntrandoCozinha.averageTimeInSet()
)

console.log(
  `filaDeClientesNoBalcao.averageTimeInSet();`,
  filaDeClientesNoBalcao.averageTimeInSet()
)
