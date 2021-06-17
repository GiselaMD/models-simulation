import { scheduler, waiterPetriNet } from '../../../src'
import { Process } from '../../../src/process'
import { WaiterPetriNet } from '../WaiterManager/waiterPetriNet'

export class RestroomRequestHandler extends Process {
  constructor(name: string, duration: () => number) {
    super(name, duration)
  }

  public executeOnStart() {
    waiterPetriNet.getLugarByLabel('substituirCaixa')?.insereToken(1)
    scheduler.startProcessNow(
      new WaiterPetriNet(
        'WaiterPetriNet',
        () => scheduler.uniform(1, 4),
        'levandoPedido'
      )
    )
    return true
  }

  public executeOnEnd() {
    scheduler.startProcessNow(
      new RestroomRequestHandler('RestroomRequestHandler', () =>
        scheduler.uniform(1, 4)
      )
    )
  }
}
