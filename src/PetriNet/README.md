# Trabalho Rede de Petri

## Contribuidores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/daniellferreira"><img src="https://avatars0.githubusercontent.com/u/30799460?s=400&v=4" width="100px;" alt="Daniel Lopes Ferreira"/>
        <br />
        <sub><b>Daniel Lopes Ferreira</b></sub></a>
        <br />
    </td>
    <td align="center">
      <a href="https://github.com/GiselaMD">
        <img src="https://avatars0.githubusercontent.com/u/34191327?s=400&u=7ee1bf93250c7b802c0ec8df133b3a119a1fc254&v=4" width="100px;" alt="Gisela Miranda Difini"/>
        <br />
        <sub><b>Gisela Miranda Difini</b></sub></a>
        <br />
    </td>
    <td align="center">
      <a href="https://github.com/vmatter"><img src="https://avatars1.githubusercontent.com/u/43481916?s=400&u=2683d479631afcd710a45ec6cae3e82ba1a846bf&v=4" width="100px;" alt="Vítor Kehl Matter"/>
        <br />
          <sub><b>Vítor Kehl Matter</b></sub></a>
        <br />
    </td> <td align="center">
      <a href="https://github.com/maxwellfb"><img src="https://avatars.githubusercontent.com/u/20483869?v=4" width="100px;" alt="Maxwell Frank Barbosa"/>
        <br />
          <sub><b>Maxwell Frank Barbosa</b></sub></a>
        <br />
    </td>
  </tr>
</table>

# Informações gerais:

- lugar = círculo

- conexao = linha

- transicao = retângulo

- token = marca (marcação)

# Métodos da rede

## Criação

```
void criaLugar(id: number)

Lugar getLugar(id: number)

void removeLugar(id: number)

void criaTransicao(id: number)

Transicao getTransicao(id: number)

void removeTransicao(id: number)

void criaConexao(lugar: Lugar, transicao: Transicao, peso: number, ehEntrada: boolean, ehConexaoInibidora: boolean, ehConexaoReset: boolean)

void removeConexao(lugar: Lugar, transicao: Transicao)

Lugar getLugarDeConexao(conexao: Conexao)

Transicao getTransicaoDeConexao(conexao: Conexao)

Conexao[] getConexoesEntrada(idTransicao: number)

Conexao[] getConexoesSaida(idTransicao: number)
```

## Alterando/inspecionando a rede

```
void insereTokenEmLugar(qtdTokens: number, lugar: Lugar)

void removeTokenDeLugar(qtdTokens: number, lugar: Lugar)

void clearLugar(lugar: Lugar) // remove todos tokens do lugar

Token[] getTokens(lugar: Lugar)

number quantosTokens(idLugar: number)

boolean getStatusTransicao (id: number) // retona True se Transição habilitada e False caso contrário

void setTransicaoInativa(id: number)

void setTransicaoAtiva(id: number)

boolean isTransicaoAtiva(id: number)
```

## Simulando/executando/conversando com o ambiente externo

```
void executaCiclo() // varre toda a rede, identificando todas transições habilitadas e executando cada uma destas transições habilitadas; a movimentação de tokens e o disparo de transições podem acarretar a chamada
de métodos de callback para a camada de visualização/interação.

boolean insereCallbackTokenEntrandoLugar(lugar: Lugar, ponteiroPara Método/Função, qtdTokens: number) // método da aplicação é invocado (enviando a quantidade de tokens como argumento) se um token é inserido em um lugar;

boolean insereCallbackTokenSaindoLugar(lugar: Lugar, ponteiroPara Método/Função,  qtdTokens: number) // método da aplicação é invocado (enviando a quantidade de tokens como argumento) se token é removido de um lugar;

boolean insereCallbackTransicao(transicao: Transicao, ponteiroPara Método/Função) // método da aplicação é invocado se transição é disparada.
```

# Executando a Rede

## Lendo arquivo pflow
  
Rodar o comando:

```
npm run test nomeArquivo.pflow
```

*Arquivos de teste devem estar na pasta /test/files*

## Utilizando CLI
  
Rodar o comando:

```
npm run start
```

### Perguntas iniciais:

- Quantos lugares: 3

- Quantas transições: 2

- Quais são os lugares de entrada de T1? 1

- Quais são os lugares de saída de T1? 3

- Quais são os lugares de entrada de T2? 2

- Quais são os lugares de saída de T2? 3

- Quantas marcas em L1 ? 4

- Quantas marcas em L2 ? 2

- Quantas marcas em L3 ? 0

- Qual o peso do arco de L1 para T1 ? 1

- Qual o peso do arco de L3 para T1 ? 2

- Qual o peso do arco de L2 para T2 ? 4

- Qual o peso do arco de L3 para T2 ? 2

### Opções do menu:

1. Executar ciclo
2. Exibir lugares
3. Exibir transições
4. Exibir rede
5. Sair

### Comandos:

Exibir lugares:

```
┌──────────┬───┬───┬───┐
│ Lugar    │ 1 │ 2 │ 3 │
├──────────┼───┼───┼───┤
│ Marcação │ 4 │ 2 │ 0 │
└──────────┴───┴───┴───┘
```

Exibir transições:

```
┌──────────────┬───┬───┐
│ Transição    │ 1 │ 2 │
├──────────────┼───┼───┤
│ Habilitada ? │ S │ N │
└──────────────┴───┴───┘
```

Exibir rede:

```
┌───────────────┬────┬────┬────┬────┬────┐
│ Núm. do ciclo │ L1 │ L2 │ L3 │ T1 │ T2 │
├───────────────┼────┼────┼────┼────┼────┤
│ 0 (inicial)   │ 4  │ 2  │ 0  │ S  │ N  │
└───────────────┴────┴────┴────┴────┴────┘
```

Após execucação do cliclo 1:

```
┌───────────────┬────┬────┬────┬────┬────┐
│ Núm. do ciclo │ L1 │ L2 │ L3 │ T1 │ T2 │
├───────────────┼────┼────┼────┼────┼────┤
│ 0 (inicial)   │ 4  │ 2  │ 0  │ S  │ N  │
├───────────────┼────┼────┼────┼────┼────┤
│ 1             │ 3  │ 2  │ 2  │ S  │ N  │
└───────────────┴────┴────┴────┴────┴────┘
```

Após execucação do cliclo 2:

```
┌───────────────┬────┬────┬────┬────┬────┐
│ Núm. do ciclo │ L1 │ L2 │ L3 │ T1 │ T2 │
├───────────────┼────┼────┼────┼────┼────┤
│ 0 (inicial)   │ 4  │ 2  │ 0  │ S  │ N  │
├───────────────┼────┼────┼────┼────┼────┤
│ 1             │ 3  │ 2  │ 2  │ S  │ N  │
├───────────────┼────┼────┼────┼────┼────┤
│ 2             │ 2  │ 2  │ 4  │ S  │ N  │
└───────────────┴────┴────┴────┴────┴────┘
```

Após execucação do cliclo 3:

```
┌───────────────┬────┬────┬────┬────┬────┐
│ Núm. do ciclo │ L1 │ L2 │ L3 │ T1 │ T2 │
├───────────────┼────┼────┼────┼────┼────┤
│ 0 (inicial)   │ 4  │ 2  │ 0  │ S  │ N  │
├───────────────┼────┼────┼────┼────┼────┤
│ 1             │ 3  │ 2  │ 2  │ S  │ N  │
├───────────────┼────┼────┼────┼────┼────┤
│ 2             │ 2  │ 2  │ 4  │ S  │ N  │
├───────────────┼────┼────┼────┼────┼────┤
│ 3             │ 1  │ 2  │ 6  │ S  │ N  │
└───────────────┴────┴────┴────┴────┴────┘
```

Após execucação do cliclo 4:

```
┌───────────────┬────┬────┬────┬────┬────┐
│ Núm. do ciclo │ L1 │ L2 │ L3 │ T1 │ T2 │
├───────────────┼────┼────┼────┼────┼────┤
│ 0 (inicial)   │ 4  │ 2  │ 0  │ S  │ N  │
├───────────────┼────┼────┼────┼────┼────┤
│ 1             │ 3  │ 2  │ 2  │ S  │ N  │
├───────────────┼────┼────┼────┼────┼────┤
│ 2             │ 2  │ 2  │ 4  │ S  │ N  │
├───────────────┼────┼────┼────┼────┼────┤
│ 3             │ 1  │ 2  │ 6  │ S  │ N  │
├───────────────┼────┼────┼────┼────┼────┤
│ 4             │ 0  │ 2  │ 8  │ N  │ N  │
└───────────────┴────┴────┴────┴────┴────┘
```
