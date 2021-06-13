import { EntitySet, Mode } from './entitySet'
import { Process } from './process'
import { Resource } from './resource'
import { ClientGenerator } from './Restaurant/clientGenerator'
import { Scheduler } from './scheduler'

const scheduler = new Scheduler()

// Cria o proceso de um cliente (clientes entrando no restaurante e esperando para ser atendido)
const cliente = scheduler.createProcess(new ClientGenerator('cliente', 0))
// Agenda processo para executar daqui tempo uniform
scheduler.startProcessIn(cliente, scheduler.uniform(1, 10))

scheduler.createResource(new Resource('atendenteCx1', 1))
scheduler.createResource(new Resource('atendenteCx2', 1))

scheduler.createResource(new Resource('cozinheiros', 5))

scheduler.createResource(new Resource('garcom', 5))

scheduler.createEntitySet(
  new EntitySet('pedidoEsperandoEntrega', 'FIFO' as Mode, 100)
)

// ##### Bancos balcao #####
scheduler.createResource(new Resource('bancosBalcao', 10))
// TODO: Vincular com resource(bancosBalcao), cliente passou, descontou bancosBalcao
scheduler.createEntitySet(new EntitySet('filaBalcao', 'FIFO' as Mode, 100))

//TODO: filaLImpaBalcao

scheduler.createEntitySet(
  new EntitySet('esperandoNoBalcao', 'FIFO' as Mode, 100)
)
const comendoBalcao = scheduler.createProcess(new Process('comendoBalcao', 0))
scheduler.startProcessIn(comendoBalcao, scheduler.uniform(1, 10))

//? Processo para liberar banco ou na saida de comendoBalcao já libera o banco

// ##### Mesas2 #####
scheduler.createResource(new Resource('mesas2', 10))
// TODO: Vincular com resource(mesas2), cliente passou, descontou mesas2
scheduler.createEntitySet(new EntitySet('filaM2', 'FIFO' as Mode, 100))

//TODO: filaLimpaM2

scheduler.createEntitySet(new EntitySet('esperandoM2', 'FIFO' as Mode, 100))
const comendoM2 = scheduler.createProcess(new Process('comendoM2', 0))
scheduler.startProcessIn(comendoM2, scheduler.uniform(1, 10))

//? Processo para liberar mesa ou na saida de comendoM2 já libera a mesa

// ##### Mesas4 #####
scheduler.createResource(new Resource('mesas4', 10))
// TODO: Vincular com resource(mesas4), cliente passou, descontou mesas4
scheduler.createEntitySet(new EntitySet('filaM4', 'FIFO' as Mode, 100))

//TODO: filaLimpaM4

scheduler.createEntitySet(new EntitySet('esperandoM4', 'FIFO' as Mode, 100))
const comendoM4 = scheduler.createProcess(new Process('comendoM4', 0))
scheduler.startProcessIn(comendoM4, scheduler.uniform(1, 10))

//? Processo para liberar mesa ou na saida de comendoM4 já libera a mesa

scheduler.simulateOneStep()

// Entity

// Pool atendenteCx1 = scheduler.createResource("atendenteCx1", 2)

// Pool filaCliente = scheduler.createResource(new Pool('cliente', 500),)
// ClientGenerator clientGenerator = scheduler.createProcess(new ClientGenerator('name', 100, filaCliente))

// Frentista frentista = de.createResource(new Frentista(2));  // parametro e´ a qtde de recursos
// Fila filaAbastece = de.createEntitySet(new Fila("filaBomba", 100));

// Chegada chegada = de.createEvent(new Chegada(5.0, 100.0, filaAbastece));
// Abastecimento abastece = de.createProcess(new Abastecimento(de.normal(8.0,2.0), frentista, filaAbastece));

// de.scheduleNow(chegada);
// de.startProcessNow(abastece);

// de.simulate();

//Frentista frentista = scheduler.createResource(new Frentista(2));  // parametro e´ a qtde de recursos
//Fila filaAbastece = scheduler.createEntitySet(new Fila("filaBomba", 100));

//Chegada chegada = scheduler.createEvent(new Chegada(5.0, 100.0, filaAbastece));
//Abastecimento abastece = scheduler.createProcess(new Abastecimento(scheduler.normal(8.0,2.0), frentista, filaAbastece));

//scheduler.scheduleNow(chegada);
//scheduler.startProcessNow(abastece);

// scheduler.simulate();
