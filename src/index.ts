import { Entity } from './entity'
import { EntitySet, Mode } from './entitySet'
import { Process } from './process'
import { Resource } from './resource'
import { CachierHandler } from './Restaurant/cachierHandler'
import { ClientHandler } from './Restaurant/clientHandler'
import { KitchenHandler } from './Restaurant/kitchenHandler'
import { WaiterOrderHandler } from './Restaurant/waiterOrderHandler'
import { Scheduler } from './scheduler'

const scheduler = new Scheduler()

// ------------------------------ Recursos do sistema ------------------------------

const atendenteCx1 = scheduler.createResource(new Resource('atendenteCx1', 1))
const atendenteCx2 = scheduler.createResource(new Resource('atendenteCx2', 1))
const cozinheiros = scheduler.createResource(new Resource('cozinheiros', 5))
const garcom = scheduler.createResource(new Resource('garcom', 5))
scheduler.createResource(new Resource('bancosBalcao', 10))
scheduler.createResource(new Resource('mesas2', 10))
scheduler.createResource(new Resource('mesas4', 10))

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
const filaPedidoEsperandoEntraga = scheduler.createEntitySet(
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
scheduler.createEntitySet(new EntitySet('filaBalcao', 'FIFO' as Mode, 100))
scheduler.createEntitySet(new EntitySet('filaLimpaBalcao', 'FIFO' as Mode, 100))
scheduler.createEntitySet(
  new EntitySet('esperandoNoBalcao', 'FIFO' as Mode, 100)
)
scheduler.createEntitySet(new EntitySet('comendoBalcao', 'FIFO' as Mode, 100))

// Mesas de 2 lugares
scheduler.createEntitySet(new EntitySet('filaM2', 'FIFO' as Mode, 100))
scheduler.createEntitySet(new EntitySet('filaLimpaM2', 'FIFO' as Mode, 100))
scheduler.createEntitySet(new EntitySet('esperandoM2', 'FIFO' as Mode, 100))
scheduler.createEntitySet(new EntitySet('comendoM2', 'FIFO' as Mode, 100))

// Mesas de 4 lugares
scheduler.createEntitySet(new EntitySet('filaM4', 'FIFO' as Mode, 100))
scheduler.createEntitySet(new EntitySet('filaLimpaM4', 'FIFO' as Mode, 100))
scheduler.createEntitySet(new EntitySet('esperandoM4', 'FIFO' as Mode, 100))
scheduler.createEntitySet(new EntitySet('comendoM4', 'FIFO' as Mode, 100))

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
    filaPedidoEsperandoEntraga,
    cozinheiros
  )
)

const processoEntregaGarcom = scheduler.createProcess(
  new WaiterOrderHandler('Garcom', 0, filaPedidoEsperandoEntraga, garcom)
)

//cachierHandler cx1
//cachierHandler cx2

// ##### Bancos balcao #####
// TODO: Vincular com resource(bancosBalcao), cliente passou, descontou bancosBalcao
scheduler.createEntitySet(new EntitySet('filaBalcao', 'FIFO' as Mode, 100))

//TODO: filaLImpaBalcao

const comendoBalcao = scheduler.createProcess(new Process('comendoBalcao', 0))
scheduler.startProcessIn(comendoBalcao, scheduler.uniform(1, 10))

//? Processo para liberar banco ou na saida de comendoBalcao já libera o banco

// ##### Mesas2 #####
// TODO: Vincular com resource(mesas2), cliente passou, descontou mesas2

//TODO: filaLimpaM2
const comendoM2 = scheduler.createProcess(new Process('comendoM2', 0))
scheduler.startProcessIn(comendoM2, scheduler.uniform(1, 10))

//? Processo para liberar mesa ou na saida de comendoM2 já libera a mesa

// ##### Mesas4 #####
// TODO: Vincular com resource(mesas4), cliente passou, descontou mesas4

//TODO: filaLimpaM4
const comendoM4 = scheduler.createProcess(new Process('comendoM4', 0))
scheduler.startProcessIn(comendoM4, scheduler.uniform(1, 10))

//? Processo para liberar mesa ou na saida de comendoM4 já libera a mesa

// ---------- Simulando o sistema ----------

// Agendar todos os processos
//scheduler.scheduleNow(processoCliente)

// Inicialiar todos os processos
//scheduler.startProcessNow(abastece)

// Simula o sistema até esgotar
scheduler.simulateOneStep()
// scheduler.simulate()
