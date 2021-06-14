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

const scheduler = new Scheduler()

// ------------------------------ Recursos do sistema ------------------------------

const atendenteCx1 = scheduler.createResource(new Resource('atendenteCx1', 1))
const atendenteCx2 = scheduler.createResource(new Resource('atendenteCx2', 1))
const cozinheiros = scheduler.createResource(new Resource('cozinheiros', 5))
const garcons = scheduler.createResource(new Resource('garcom', 5))
const bancosLivres = scheduler.createResource(new Resource('bancosBalcao', 10))
const mesas2Livres = scheduler.createResource(new Resource('mesas2', 10))
const mesas4Livres = scheduler.createResource(new Resource('mesas4', 10))

// ------------------------------ Conjuntos de entidades do sistema ------------------------------

// Caixa
const filaCaixa1 = scheduler.createEntitySet(
  new EntitySet('cx1', 'FIFO' as Mode, 0)
)
const filaCaixa2 = scheduler.createEntitySet(
  new EntitySet('cx2', 'FIFO' as Mode, 0)
)
const filaRoteia = scheduler.createEntitySet(
  new EntitySet('filaRoteia', 'FIFO' as Mode, 0)
)

// Cozinha
const filaCozinha = scheduler.createEntitySet(
  new EntitySet('cozinha', 'FIFO' as Mode, 0)
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
  new ClientHandler('ProcessoCliente', 0, filaCaixa1, filaCaixa2)
)
// TODO: Agenda processo para executar daqui tempo uniform, continuar agendando
scheduler.startProcessIn(processoCliente, scheduler.uniform(1, 10))
//scheduler.startProcessIn(processoCliente, 'uniforme', [1, 10])

// Implementar atendimento no caixas.
const processoAtendeCaixa1 = scheduler.createProcess(
  new CachierHandler(
    'ProcessoAtendeCaixa1',
    0,
    filaCaixa1,
    filaCozinha,
    filaRoteia,
    atendenteCx1
  )
)
const processoAtendeCaixa2 = scheduler.createProcess(
  new CachierHandler(
    'ProcessoAtendeCaixa2',
    0,
    filaCaixa2,
    filaCozinha,
    filaRoteia,
    atendenteCx2
  )
)

// Fluxo da Cozinha
const processoCozinha = scheduler.createProcess(
  new KitchenHandler(
    'ProcessoCozinha',
    0,
    filaCozinha,
    filaPedidoEsperandoEntrega,
    cozinheiros
  )
)

const processoEntregaGarcom = scheduler.createProcess(
  new WaiterOrderHandler(
    'ProcessoGarcom',
    0,
    filaPedidoEsperandoEntrega,
    garcons
  )
)

const processoRoteia = scheduler.createProcess(
  new ClientRouterHandler(
    'ProcessoRoteia',
    0,
    filaRoteia,
    filaClientesBalcao,
    filaClientesNaMesa2,
    filaClientesNaMesa4
  )
)

const processoFilaBalcao = scheduler.createProcess(
  new QueueTableHandler(
    'ProcessoFilaBalcao',
    0,
    filaClientesBalcao,
    filaGarcomLimpaBalcao,
    bancosLivres
  )
)

const processoFilaMesa2 = scheduler.createProcess(
  new QueueTableHandler(
    'ProcessoFilaMesa2',
    0,
    filaClientesNaMesa2,
    filaGarcomLimpaMesa2,
    mesas2Livres
  )
)

const processoFilaMesa4 = scheduler.createProcess(
  new QueueTableHandler(
    'processoFilaMesa4',
    0,
    filaClientesNaMesa4,
    filaGarcomLimpaMesa4,
    mesas4Livres
  )
)

const processoLimpaBalcao = scheduler.createProcess(
  new QueueTableHandler(
    'processoLimpaBalcao',
    0,
    filaGarcomLimpaBalcao,
    filaEsperandoPedidoNoBalcao,
    garcons
  )
)

const processoLimpaMesa2 = scheduler.createProcess(
  new QueueTableHandler(
    'processoLimpaMesa2',
    0,
    filaGarcomLimpaMesa2,
    filaEsperandoPedidoNaMesa2,
    garcons
  )
)

const processoLimpaMesa4 = scheduler.createProcess(
  new QueueTableHandler(
    'processoLimpaMesa4',
    0,
    filaGarcomLimpaMesa4,
    filaEsperandoPedidoNaMesa4,
    garcons
  )
)

const processoEsperandoPedidoNoBalcao = scheduler.createProcess(
  new QueueWaitTable(
    'processoEsperandoPedidoNoBalcao',
    0,
    filaEsperandoPedidoNoBalcao,
    filaPedidoEsperandoEntrega,
    garcons,
    bancosLivres
  )
)

const processoEsperandoPedidoNaMesa2 = scheduler.createProcess(
  new QueueWaitTable(
    'processoEsperandoPedidoNaMesa2',
    0,
    filaEsperandoPedidoNaMesa2,
    filaPedidoEsperandoEntrega,
    garcons,
    mesas2Livres
  )
)

const processoEsperandoPedidoNaMesa4 = scheduler.createProcess(
  new QueueWaitTable(
    'processoEsperandoPedidoNaMesa4',
    0,
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

// Agendar todos os processos
//scheduler.scheduleNow(processoCliente)

// Inicialiar todos os processos
//scheduler.startProcessNow(abastece)

// Simula o sistema até esgotar
scheduler.simulateOneStep()
// scheduler.simulate()
