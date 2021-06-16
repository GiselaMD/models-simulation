import {
  filaDeClientesEsperandoPedidoNaMesa2,
  filaDeClientesEsperandoPedidoNaMesa4,
  filaGarcomLimpaMesa2,
  filaGarcomLimpaMesa4,
  filaDeClientesEsperandoPedidoNoBalcao,
  filaGarcomLimpaBalcao,
  scheduler,
  waiterPetriNet,
  filaDeClientesComendoNaMesa2,
  filaDeClientesComendoNaMesa4,
  filaDeClientesComendoNoBalcao,
} from 'src'
import { Entity } from 'src/entity'
import { Process } from 'src/process'
import { WaiterOrderHandler } from '../KitchenManager/waiterOrderHandler'
import { EatingTableHandler } from '../TableManager/eatingTableHandler'

export class WaiterPetriNet extends Process {
  local: string = ''
  mesa: string = ''
  constructor(name: string, duration: () => number, local: string) {
    super(name, duration)
    this.local = local
  }

  public executeOnStart() {
    waiterPetriNet.executaCiclo()
    return true
  }

  public executeOnEnd() {
    if (this.local == 'garcomNoCaixa') {
      waiterPetriNet.getLugarByLabel('atendenteVoltou')?.insereToken(1)
    } else if (this.local == 'levandoPedido') {
      waiterPetriNet.getLugarByLabel('pedidoEntregue')?.insereToken(1)
      if (this.name == 'WaiterPetriNet-balcao') {
        filaDeClientesComendoNoBalcao.insert(
          filaDeClientesEsperandoPedidoNoBalcao.remove() as Entity
        )
        this.mesa = 'balcao'
      } else if (this.name == 'WaiterPetriNet-M2') {
        filaDeClientesComendoNaMesa2.insert(
          filaDeClientesEsperandoPedidoNaMesa2.remove() as Entity
        )
        this.mesa = 'M2'
      } else {
        filaDeClientesComendoNaMesa4.insert(
          filaDeClientesEsperandoPedidoNaMesa4.remove() as Entity
        )
        this.mesa = 'M4'
      }
      scheduler.startProcessNow(
        new EatingTableHandler('EatingTableHandler-' + this.name, () =>
          scheduler.uniform(1, 4)
        )
      )
    } else if (this.local == 'higienizandoMesa') {
      waiterPetriNet.getLugarByLabel('mesaHigienizada')?.insereToken(1)
      if (this.name == 'WaiterPetriNet-balcao') {
        filaDeClientesEsperandoPedidoNoBalcao.insert(
          filaGarcomLimpaBalcao.remove() as Entity
        )
        this.mesa = 'balcao'
      } else if (this.name == 'WaiterPetriNet-M2') {
        filaDeClientesEsperandoPedidoNaMesa2.insert(
          filaGarcomLimpaMesa2.remove() as Entity
        )
        this.mesa = 'M2'
      } else {
        filaDeClientesEsperandoPedidoNaMesa4.insert(
          filaGarcomLimpaMesa4.remove() as Entity
        )
        this.mesa = 'M4'
      }
      scheduler.startProcessNow(
        new WaiterOrderHandler('WaiterOrderHandler-' + this.name, () =>
          scheduler.uniform(1, 1)
        )
      )
    }
    waiterPetriNet.executaCiclo()
  }
}
