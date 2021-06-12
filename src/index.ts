import { Agent } from './Restaurant/agent'
import { ClientGenerator } from './Restaurant/clientGenerator'
import { Pool } from './Restaurant/pool'
import { Scheduler } from './scheduler'

const scheduler = new Scheduler()

scheduler.createProcess('cliente', 1000)

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
