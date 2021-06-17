import {
  bancosLivres,
  filaDeClientesNaMesa2,
  filaDeClientesNaMesa4,
  filaDeClientesNoBalcao,
  filaGarcomLimpaMesa2,
  filaGarcomLimpaMesa4,
  filaGarcomLimpaBalcao,
  mesas2Livres,
  mesas4Livres,
  scheduler,
  waiterPetriNet,
} from '../..'
import { Entity } from '../../entity'
import { Process } from '../../process'
import { WaiterPetriNet } from '../WaiterManager/waiterPetriNet'

export class QueueTableHandler extends Process {
  mesa: String = ''

  constructor(name: string, duration: () => number) {
    super(name, duration)
  }

  public executeOnStart() {
    if (this.name == 'QueueTableHandler-balcao') {
      if (!filaDeClientesNoBalcao.isEmpty() && bancosLivres.allocate(1)) {
        filaGarcomLimpaBalcao.insert(filaDeClientesNoBalcao.remove() as Entity)
        this.mesa = 'balcao'
      } else {
        return false
      }
    } else if (this.name == 'QueueTableHandler-M2') {
      if (!filaDeClientesNaMesa2.isEmpty() && mesas2Livres.allocate(1)) {
        filaGarcomLimpaMesa2.insert(filaDeClientesNaMesa2.remove() as Entity)
        this.mesa = 'M2'
      } else {
        return false
      }
    } else {
      if (!filaDeClientesNaMesa4.isEmpty() && mesas4Livres.allocate(1)) {
        filaGarcomLimpaMesa4.insert(filaDeClientesNaMesa4.remove() as Entity)
        this.mesa = 'M4'
      } else {
        return false
      }
    }

    waiterPetriNet.getLugarByLabel('higienizandoMesa')?.insereToken(1)
    scheduler.startProcessNow(
      new WaiterPetriNet(
        'WaiterPetriNet-' + this.mesa,
        () => scheduler.uniform(1, 4),
        'higienizandoMesa'
      )
    )
    return true
  }
}
