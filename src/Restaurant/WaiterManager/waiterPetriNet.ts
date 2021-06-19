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
} from '../..'
import { Entity } from '../../entity'
import { Process } from '../../process'
import { WaiterOrderHandler } from '../KitchenManager/waiterOrderHandler'
import { EatingTableHandler } from '../TableManager/eatingTableHandler'
import color from 'colors'

export class WaiterPetriNet extends Process {
  local: string = ''
  mesa: string = ''
  constructor(name: string, duration: () => number, local: string) {
    super(name, duration)
    this.local = local
  }

  public executeOnStart() {
    console.log(color.rainbow('Tabela PetriNet'))
    waiterPetriNet.petriNet?.atualizaStatusTransicoes()
    waiterPetriNet.petriNet?.exibeMenu()
    waiterPetriNet.petriNet?.executaCiclo()
    console.log(
      color.blue(
        `Quantidade de garçons livres --> ${color.yellow(
          '' +
            waiterPetriNet.petriNet?.getLugarByLabel('garcomLivre')?.getTokens()
        )}`
      )
    )
  }

  public executeOnEnd() {
    if (this.local == 'garcomNoCaixa') {
      waiterPetriNet.petriNet
        ?.getLugarByLabel('atendenteVoltou')
        ?.insereToken(1)
    } else if (this.local == 'levandoPedido') {
      waiterPetriNet.petriNet?.getLugarByLabel('pedidoEntregue')?.insereToken(1)
      if (this.name == 'WaiterPetriNet-DeliverOrder-balcao') {
        filaDeClientesComendoNoBalcao.insert(
          filaDeClientesEsperandoPedidoNoBalcao.remove() as Entity
        )
        this.mesa = 'balcao'
      } else if (this.name == 'WaiterPetriNet-DeliverOrder-M2') {
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
        scheduler.createProcess(
          new EatingTableHandler('EatingTableHandler-' + this.name, () =>
            scheduler.uniform(1, 4)
          )
        )
      )
    } else if (this.local == 'higienizandoMesa') {
      waiterPetriNet.petriNet
        ?.getLugarByLabel('mesaHigienizada')
        ?.insereToken(1)
      if (this.name == 'WaiterPetriNet-CleanTable-balcao') {
        filaDeClientesEsperandoPedidoNoBalcao.insert(
          filaGarcomLimpaBalcao.remove() as Entity
        )
        this.mesa = 'balcao'
      } else if (this.name == 'WaiterPetriNet-CleanTable-M2') {
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
        scheduler.createProcess(
          new WaiterOrderHandler('WaiterOrderHandler-' + this.name, () => 1)
        )
      )
    }
    waiterPetriNet.petriNet?.atualizaStatusTransicoes()
    waiterPetriNet.petriNet?.executaCiclo()
  }
}
