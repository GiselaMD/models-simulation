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
import color from 'colors'

export class QueueTableHandler extends Process {
  mesa: String = ''

  constructor(name: string, duration: () => number) {
    super(name, duration)
  }

  public canExecute() {
    if (this.name == 'QueueTableHandler-balcao') {
      if (!filaDeClientesNoBalcao.isEmpty() && bancosLivres.canAllocate(1)) {
        return true
      }
    } else if (this.name == 'QueueTableHandler-M2') {
      if (!filaDeClientesNaMesa2.isEmpty() && mesas2Livres.canAllocate(1)) {
        return true
      }
    } else {
      if (!filaDeClientesNaMesa4.isEmpty() && mesas4Livres.canAllocate(1)) {
        return true
      }
    }
    return false
  }

  public executeOnStart() {
    console.log('Está no', this.name)
    if (this.name == 'QueueTableHandler-balcao') {
      this.mesa = 'balcao'
      bancosLivres.allocate(1)
      console.log(
        color.blue(
          `Quantidade de bancos existentes --> ${color.yellow(
            '' + bancosLivres.quantity
          )} e em uso ${color.yellow('' + bancosLivres.used)} bancos`
        )
      )
      filaGarcomLimpaBalcao.insert(filaDeClientesNoBalcao.remove() as Entity)
    } else if (this.name == 'QueueTableHandler-M2') {
      this.mesa = 'M2'
      mesas2Livres.allocate(1)
      console.log(
        color.blue(
          `Quantidade de mesas2 existentes --> ${color.yellow(
            '' + mesas2Livres.quantity
          )} e em uso ${color.yellow('' + mesas2Livres.used)} mesas2`
        )
      )
      filaGarcomLimpaMesa2.insert(filaDeClientesNaMesa2.remove() as Entity)
    } else {
      this.mesa = 'M4'
      mesas4Livres.allocate(1)
      console.log(
        color.blue(
          `Quantidade de mesas4 existentes --> ${color.yellow(
            '' + mesas4Livres.quantity
          )} e em uso ${color.yellow('' + mesas4Livres.used)} mesas`
        )
      )
      filaGarcomLimpaMesa4.insert(filaDeClientesNaMesa4.remove() as Entity)
    }
    waiterPetriNet.petriNet?.getLugarByLabel('clienteVaiSentar')?.insereToken(1)
    scheduler.startProcessNow(
      scheduler.createProcess(
        new WaiterPetriNet(
          'WaiterPetriNet-CleanTable-' + this.mesa,
          () => scheduler.uniform(1, 4),
          'higienizandoMesa'
        )
      )
    )
  }
}
