import {
  bancosLivres,
  filaDeClientesComendoNaMesa2,
  filaDeClientesComendoNaMesa4,
  filaDeClientesComendoNoBalcao,
  mesas2Livres,
  mesas4Livres,
} from '../..'
import { Process } from '../../process'
import color from 'colors'

export class EatingTableHandler extends Process {
  constructor(name: string, duration: () => number) {
    super(name, duration)
  }

  public executeOnEnd() {
    console.log(color.bgRed('EATING TABLE HANDLER --> ' + this.name))

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
    console.log(color.rainbow('\nMais clientes satisfeitos!!!\n'))
  }
}
