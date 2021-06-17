import { readFileSync } from 'fs'
import { parseString, parseStringPromise, processors } from 'xml2js'
import { Lugar } from '../lugar'

import { RedePetri } from '../redeDePetri'
import { Transicao } from '../transicao'

//run(process.argv[2])

// CALLBACKS
const entrouNoLugar = (qtdTokens: number) =>
  console.log(`ENTROU NO LUGAR COM ${qtdTokens} tokens`)

const saiuDoLugar = (qtdTokens: number) =>
  console.log(`SAIU DO LUGAR COM ${qtdTokens} tokens`)

const trasicaoDisparada = () => console.log('DISPAROU TRANSIÇÃO')

export async function run(filename: string) {
  if (!filename) {
    console.error('Parametro file_name eh obrigatorio!')
    return
  }

  const xml = readFileSync(`${__dirname}/files/${filename}`, {
    encoding: 'utf8',
  })

  const obj = await new Promise((resolve, reject) => {
    parseString(xml, function (err, result) {
      if (err) return reject(err)
      resolve(result)
    })
  })

  const {
    document: { subnet },
  } = await parseStringPromise(xml, {
    valueProcessors: [processors.parseNumbers],
  })

  const rede = new RedePetri()
  const componentesRede: any = {}

  let [{ place: places, transition: transitions, arc: arcs }] = subnet

  places = places.sort(compareValues('label'))
  transitions = transitions.sort(compareValues('label'))

  for (const place of places) {
    componentesRede[place.id[0]] = rede.criaLugar(
      place.id[0],
      place.label[0],
      place.tokens[0]
    )

    rede.insereCallbackTokenEntrandoLugar(
      componentesRede[place.id[0]],
      entrouNoLugar,
      2
    )

    rede.insereCallbackTokenSaindoLugar(
      componentesRede[place.id[0]],
      saiuDoLugar,
      2
    )
  }

  for (const transition of transitions) {
    componentesRede[transition.id[0]] = rede.criaTransicao(
      transition.id[0],
      transition.label[0]
    )

    rede.insereCallbackTransicao(
      componentesRede[transition.id[0]],
      trasicaoDisparada
    )
  }

  for (const arc of arcs) {
    let ehEntrada: boolean
    let lugar: Lugar
    let transicao: Transicao

    if (componentesRede[arc.sourceId[0]] instanceof Lugar) {
      ehEntrada = true
      lugar = componentesRede[arc.sourceId[0]]
      transicao = componentesRede[arc.destinationId[0]]
    } else {
      ehEntrada = false
      lugar = componentesRede[arc.destinationId[0]]
      transicao = componentesRede[arc.sourceId[0]]
    }

    rede.criaConexao(
      lugar,
      transicao,
      arc.multiplicity[0],
      ehEntrada,
      arc.type[0] === 'inhibitor',
      arc.type[0] === 'reset'
    )
  }
  rede.init()

  return rede
  //rede.exibeMenu()
}

function compareValues(key: string, order = 'asc') {
  return function innerSort(a: any, b: any) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0
    }

    let varA = a[key]
    if (Array.isArray(varA)) {
      varA = varA[0]
    }
    if (typeof varA === 'string') {
      varA = varA.toUpperCase()

      if (hasNumbers(varA)) {
        varA = varA.replace(/\D/g, '')
        varA = parseInt(varA)
      }
    }

    let varB = b[key]
    if (Array.isArray(varB)) {
      varB = varB[0]
    }
    if (typeof varB === 'string') {
      varB = varB.toUpperCase()

      if (hasNumbers(varB)) {
        varB = varB.replace(/\D/g, '')
        varB = parseInt(varB)
      }
    }

    let comparison = 0
    if (varA > varB) {
      comparison = 1
    } else if (varA < varB) {
      comparison = -1
    }
    return order === 'desc' ? comparison * -1 : comparison
  }
}

function hasNumbers(t: string) {
  const regex = /\d/g
  return regex.test(t)
}
