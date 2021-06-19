import { atendenteCx1, atendenteCx2, scheduler, waiterPetriNet } from '../..'
import { Process } from '../../process'
import { WaiterPetriNet } from '../WaiterManager/waiterPetriNet'

export class RestroomRequestHandler extends Process {
  constructor(name: string, duration: () => number) {
    super(name, duration)
  }

  public canExecute() {
    // TODO: Algo errado
    // TODO: Liberar banheiro
    // TODO: Melhorar nome QueueTableHandler-M
    // TODO: Print resources do garçom (token), mesa, caixa
    const qtdAtendentesBanheiro =
      (waiterPetriNet.petriNet
        ?.getLugarByLabel('substituirCaixa')
        ?.getTokens() as number) +
      (waiterPetriNet.petriNet
        ?.getLugarByLabel('garcomNoCaixa')
        ?.getTokens() as number)

    if (
      qtdAtendentesBanheiro >=
      atendenteCx1.getQuantity() + atendenteCx2.getQuantity()
    ) {
      return false
    }
    return true
  }

  public executeOnStart() {
    waiterPetriNet.petriNet?.getLugarByLabel('substituirCaixa')?.insereToken(1)
    scheduler.startProcessNow(
      scheduler.createProcess(
        new WaiterPetriNet(
          'WaiterPetriNet-RestroomRequestHandler',
          () => scheduler.uniform(1, 4),
          'garcomNoCaixa'
        )
      )
    )
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
