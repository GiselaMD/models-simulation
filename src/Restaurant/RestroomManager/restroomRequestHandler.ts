import { scheduler, waiterPetriNet } from '../..'
import { Process } from '../../process'
import { WaiterPetriNet } from '../WaiterManager/waiterPetriNet'

export class RestroomRequestHandler extends Process {
  constructor(name: string, duration: () => number) {
    super(name, duration)
  }

  public executeOnStart() {
    waiterPetriNet.petriNet?.getLugarByLabel('substituirCaixa')?.insereToken(1)
    scheduler.startProcessNow(
      scheduler.createProcess(
        new WaiterPetriNet(
          'WaiterPetriNet',
          () => scheduler.uniform(1, 4),
          'levandoPedido'
        )
      )
    )
    return true
  }

  public executeOnEnd() {
    scheduler.startProcessNow(
      scheduler.createProcess(
        new RestroomRequestHandler('RestroomRequestHandler', () =>
          scheduler.uniform(1, 4)
        )
      )
    )
  }
}
