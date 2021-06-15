import { EntitySet, Mode } from './entitySet'
import { Resource } from './resource'
import { CachierHandler } from './Restaurant/CachierManager/cachierHandler'
import { ClientRouterHandler } from './Restaurant/TableManager/clientRouterHandler'
import { KitchenHandler } from './Restaurant/KitchenManager/kitchenHandler'
import { WaiterOrderHandler } from './Restaurant/KitchenManager/waiterOrderHandler'
import { Scheduler } from './scheduler'
import { ClientHandler } from './Restaurant/CachierManager/clientHandler'
import { QueueTableHandler } from './Restaurant/TableManager/queueTableHandler'
import { QueueWaitTable } from './Restaurant/TableManager/queueWaitTable'
import { WaitCachierHandler } from './Restaurant/CachierManager/waitCachierHandler'
import { WaitKitchenHandler } from './Restaurant/KitchenManager/waitKitchenHandler'

const scheduler = new Scheduler()

// ------------------------------ Recursos do sistema ------------------------------

const atendenteCx1 = scheduler.createResource(
  new Resource('atendenteCx1', 1, () => scheduler.getTime())
)
const atendenteCx2 = scheduler.createResource(
  new Resource('atendenteCx2', 1, () => scheduler.getTime())
)
const cozinheiros = scheduler.createResource(
  new Resource('cozinheiros', 5, () => scheduler.getTime())
)
const garcons = scheduler.createResource(
  new Resource('garcom', 5, () => scheduler.getTime())
)
//TODO: Garcom como Entity, onde os processos receberiam os callbacks.
const bancosLivres = scheduler.createResource(
  new Resource('bancosBalcao', 10, () => scheduler.getTime())
)
const mesas2Livres = scheduler.createResource(
  new Resource('mesas2', 10, () => scheduler.getTime())
)
const mesas4Livres = scheduler.createResource(
  new Resource('mesas4', 10, () => scheduler.getTime())
)

// ------------------------------ Conjuntos de entidades do sistema ------------------------------

// Caixa
const filaDeClientesNoCaixa1 = scheduler.createEntitySet(
  new EntitySet('cx1', 'FIFO' as Mode, 0)
)
const filaDeClienteSendoAtendidosNoCaixa1 = scheduler.createEntitySet(
  new EntitySet('filaDeClienteSendoAtendidosNoCaixa1', 'FIFO' as Mode, 0)
)
const filaDeClientesNoCaixa2 = scheduler.createEntitySet(
  new EntitySet('cx2', 'FIFO' as Mode, 0)
)
const filaDeClienteSendoAtendidosNoCaixa2 = scheduler.createEntitySet(
  new EntitySet('filaDeClienteSendoAtendidosNoCaixa2', 'FIFO' as Mode, 0)
)
const filaRoteia = scheduler.createEntitySet(
  new EntitySet('filaRoteia', 'FIFO' as Mode, 0)
)

// Cozinha
const filaPedidoEntrandoCozinha = scheduler.createEntitySet(
  new EntitySet('cozinha', 'FIFO' as Mode, 100)
)
const filaPedidoSendoPreparado = scheduler.createEntitySet(
  new EntitySet('pedidoEsperandoEntrega', 'FIFO' as Mode, 100)
)
const filaPedidoEsperandoEntrega = scheduler.createEntitySet(
  new EntitySet('pedidoEsperandoEntrega', 'FIFO' as Mode, 100)
)
scheduler.createEntitySet(
  new EntitySet('filaEntregaGarcom', 'FIFO' as Mode, 100)
)

// Validar a criação de rede de Petri para os garcons --> alterar depois

// Banheiro
scheduler.createEntitySet(new EntitySet('esperandoGarcom', 'FIFO' as Mode, 100))
scheduler.createEntitySet(
  new EntitySet('requisitandoBanheiro', 'FIFO' as Mode, 100)
)
scheduler.createEntitySet(new EntitySet('noBanheiro', 'FIFO' as Mode, 100))

// Bancos balcao
const filaClientesBalcao = scheduler.createEntitySet(
  new EntitySet('filaBalcao', 'FIFO' as Mode, 100)
)
const filaGarcomLimpaBalcao = scheduler.createEntitySet(
  new EntitySet('filaLimpaBalcao', 'FIFO' as Mode, 100)
)
const filaEsperandoPedidoNoBalcao = scheduler.createEntitySet(
  new EntitySet('esperandoNoBalcao', 'FIFO' as Mode, 100)
)
const filaComendoNoBalcao = scheduler.createEntitySet(
  new EntitySet('comendoBalcao', 'FIFO' as Mode, 100)
)

// Mesas de 2 lugares
const filaClientesNaMesa2 = scheduler.createEntitySet(
  new EntitySet('filaM2', 'FIFO' as Mode, 100)
)
const filaGarcomLimpaMesa2 = scheduler.createEntitySet(
  new EntitySet('filaLimpaM2', 'FIFO' as Mode, 100)
)
const filaEsperandoPedidoNaMesa2 = scheduler.createEntitySet(
  new EntitySet('esperandoM2', 'FIFO' as Mode, 100)
)
const filaComendoMesa2 = scheduler.createEntitySet(
  new EntitySet('comendoM2', 'FIFO' as Mode, 100)
)

// Mesas de 4 lugares
const filaClientesNaMesa4 = scheduler.createEntitySet(
  new EntitySet('filaM4', 'FIFO' as Mode, 100)
)
const filaGarcomLimpaMesa4 = scheduler.createEntitySet(
  new EntitySet('filaLimpaM4', 'FIFO' as Mode, 100)
)
const filaEsperandoPedidoNaMesa4 = scheduler.createEntitySet(
  new EntitySet('esperandoM4', 'FIFO' as Mode, 100)
)
const filaComendoMesa4 = scheduler.createEntitySet(
  new EntitySet('comendoM4', 'FIFO' as Mode, 100)
)

// ------------------------------ Gerenciando os processos do sistema ------------------------------

// Cria o processo de um cliente (clientes entrando no restaurante e sendo levado a um caixa especifico)
const processoCliente = scheduler.createProcess(
  new ClientHandler(
    'ProcessoCliente',
    () => scheduler.uniform(1, 4),
    filaDeClientesNoCaixa1,
    filaDeClientesNoCaixa2
  )
)
// TODO: Agenda processo para executar daqui tempo uniform, continuar agendando
// @vitor
scheduler.startProcessNow(processoCliente)
//scheduler.startProcessIn(processoCliente, 'uniforme', [1, 10])

// Passar entidade para dentro do processo. O processo precisa acessar a rede de Petri.

// Implementar atendimento no caixas.
const processoEsperaAtendimentoCaixa1 = scheduler.createProcess(
  new CachierHandler(
    'ProcessoEsperaAtendimentoCaixa1',
    () => scheduler.uniform(1, 1),
    filaDeClientesNoCaixa1,
    filaPedidoEntrandoCozinha,
    filaRoteia,
    atendenteCx1
  )
)

const processoAtendendoCaixa1 = scheduler.createProcess(
  new WaitCachierHandler(
    'ProcessoAtendedendoCaixa1',
    () => scheduler.uniform(1, 4),
    filaDeClienteSendoAtendidosNoCaixa1,
    filaPedidoEntrandoCozinha,
    atendenteCx1
  )
)

const processoEsperaAtendimentoCaixa2 = scheduler.createProcess(
  new CachierHandler(
    'ProcessoEsperaAtendimentoCaixa2',
    () => scheduler.uniform(1, 1),
    filaDeClientesNoCaixa2,
    filaPedidoEntrandoCozinha,
    filaRoteia,
    atendenteCx2
  )
)

const processoAtendendoCaixa2 = scheduler.createProcess(
  new WaitCachierHandler(
    'ProcessoAtendedendoCaixa2',
    () => scheduler.uniform(1, 4),
    filaDeClienteSendoAtendidosNoCaixa2,
    filaPedidoEntrandoCozinha,
    atendenteCx2
  )
)

// Fluxo da Cozinha
const processoEsperaCozinha = scheduler.createProcess(
  new KitchenHandler(
    'ProcessoCozinha',
    () => scheduler.uniform(1, 1),
    filaPedidoEntrandoCozinha,
    filaPedidoSendoPreparado,
    cozinheiros
  )
)

// Fluxo da Cozinha
const processoPedidoSendoPreparado = scheduler.createProcess(
  new WaitKitchenHandler(
    'ProcessoPedidoSendoPreparado',
    () => scheduler.uniform(1, 4),
    filaPedidoSendoPreparado,
    filaPedidoEsperandoEntrega,
    cozinheiros
  )
)

//TODO: Continuar aqui os processos wait.
const processoEntregaGarcom = scheduler.createProcess(
  new WaiterOrderHandler(
    'ProcessoGarcom',
    () => scheduler.uniform(1, 4),
    filaPedidoEsperandoEntrega,
    garcons
  )
)

const processoRoteia = scheduler.createProcess(
  new ClientRouterHandler(
    'ProcessoRoteia',
    () => scheduler.uniform(1, 4),
    filaRoteia,
    filaClientesBalcao,
    filaClientesNaMesa2,
    filaClientesNaMesa4
  )
)

const processoFilaBalcao = scheduler.createProcess(
  new QueueTableHandler(
    'ProcessoFilaBalcao',
    () => scheduler.uniform(1, 4),
    filaClientesBalcao,
    filaGarcomLimpaBalcao,
    bancosLivres
  )
)

const processoFilaMesa2 = scheduler.createProcess(
  new QueueTableHandler(
    'ProcessoFilaMesa2',
    () => scheduler.uniform(1, 4),
    filaClientesNaMesa2,
    filaGarcomLimpaMesa2,
    mesas2Livres
  )
)

const processoFilaMesa4 = scheduler.createProcess(
  new QueueTableHandler(
    'processoFilaMesa4',
    () => scheduler.uniform(1, 4),
    filaClientesNaMesa4,
    filaGarcomLimpaMesa4,
    mesas4Livres
  )
)

const processoLimpaBalcao = scheduler.createProcess(
  new QueueTableHandler(
    'processoLimpaBalcao',
    () => scheduler.uniform(1, 4),
    filaGarcomLimpaBalcao,
    filaEsperandoPedidoNoBalcao,
    garcons
  )
)

const processoLimpaMesa2 = scheduler.createProcess(
  new QueueTableHandler(
    'processoLimpaMesa2',
    () => scheduler.uniform(1, 4),
    filaGarcomLimpaMesa2,
    filaEsperandoPedidoNaMesa2,
    garcons
  )
)

const processoLimpaMesa4 = scheduler.createProcess(
  new QueueTableHandler(
    'processoLimpaMesa4',
    () => scheduler.uniform(1, 4),
    filaGarcomLimpaMesa4,
    filaEsperandoPedidoNaMesa4,
    garcons
  )
)

const processoEsperandoPedidoNoBalcao = scheduler.createProcess(
  new QueueWaitTable(
    'processoEsperandoPedidoNoBalcao',
    () => scheduler.uniform(1, 4),
    filaEsperandoPedidoNoBalcao,
    filaPedidoEsperandoEntrega,
    garcons,
    bancosLivres
  )
)

const processoEsperandoPedidoNaMesa2 = scheduler.createProcess(
  new QueueWaitTable(
    'processoEsperandoPedidoNaMesa2',
    () => scheduler.uniform(1, 4),
    filaEsperandoPedidoNaMesa2,
    filaPedidoEsperandoEntrega,
    garcons,
    mesas2Livres
  )
)
// TODO: Passar o duration para dentro de cada processo.
const processoEsperandoPedidoNaMesa4 = scheduler.createProcess(
  new QueueWaitTable(
    'processoEsperandoPedidoNaMesa4',
    () => scheduler.uniform(1, 4),
    filaEsperandoPedidoNaMesa4,
    filaPedidoEsperandoEntrega,
    garcons,
    mesas4Livres
  )
)

// ---------- Simulando o sistema ----------

//const redePetri = new RedePetri(){
// Recebe o arquivo específico para não criar nada na mão.
//}

// Inicialiar todos os processos
//scheduler.startProcessNow(abastece)

// Simula o sistema até esgotar
scheduler.simulateOneStep()
// scheduler.simulate()
