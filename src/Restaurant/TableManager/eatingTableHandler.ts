import {
  bancosLivres,
  filaDeClientesComendoNaMesa2,
  filaDeClientesComendoNaMesa4,
  filaDeClientesComendoNoBalcao,
  mesas2Livres,
  mesas4Livres,
} from '../..'
import { Process } from '../../process'
import colors from 'colors'

export class EatingTableHandler extends Process {
  constructor(name: string, duration: () => number) {
    super(name, duration)
  }

  public executeOnEnd() {
    if (this.name == 'EatingTableHandler-balcao') {
      filaDeClientesComendoNoBalcao.remove()
      bancosLivres.release(1)
    } else if (this.name == 'EatingTableHandler-M2') {
      filaDeClientesComendoNaMesa2.remove()
      mesas2Livres.release(1)
    } else {
      filaDeClientesComendoNaMesa4.remove()
      mesas4Livres.release(1)
    }

    // Log fundamental para o funcionamento da rede, não mexer!!!
    console.log(colors.rainbow('\nMais clientes satisfeitos!!!\n'))
  }
}
