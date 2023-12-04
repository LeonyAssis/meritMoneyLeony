# GIS - Gerencianet Internal Service

[![pipeline status](https://gitlab.interno.testegerencianet.com.br/desenvolvimento/gis_lab/badges/master/pipeline.svg)](https://gitlab.interno.testegerencianet.com.br/desenvolvimento/gis_lab/commits/master)
[![coverage report](https://gitlab.interno.testegerencianet.com.br/desenvolvimento/gis_lab/badges/master/coverage.svg)](https://gis.gitlab-pages.interno.testegerencianet.com.br/gis_lab/coverage/)

> Disponibiliza endpoints para serviços internos utilizados pela Intranet.

<p align="center">
 <img src="https://content.screencast.com/users/yury.oliveira/folders/Jing/media/2ab638a6-4f12-42ec-8fd2-00950516af33/2020-03-27_0740.png"/>
</p>

## Índice
1. [Requisitos para Rodar na Máquina Local](#1---requisitos-para-rodar-na-máquina-local)
2. [Para Iniciar a Aplicação](#2---para-iniciar-a-aplicação)
3. [Testes](#3---testes)
4. [Documentação dos Endpoints](#4---documentação-dos-endpoints)
5. [Collection do Postman](#5---collection-do-postman)
6. [Versionamento](#6---versionamento)
7. [Configuração do Projeto](#7---para-configuração-do-projeto-em-sua-vm-siga-as-seguintes-instruções-abaixo)
## 1 - Requisitos para rodar na máquina local

- NodeJS 20.10.0
- Docker
- Credenciais para consumir o _auth-server_;

## 2 - Para iniciar a aplicação

Para iniciar o projeto sem watch

```shell
$ make start
```

Para iniciar o projeto com watch ligado

```shell
$ make watch
```

O servidor escuta na porta 4427, podendo ser acessado através da url `https://gis.{{SUA_MATRICULA}}.orp-1.colaboradores.labgerencianet.com.br` ou `http://localhost:4427` desde que tenha sido mapeada no Vagrantfile.

## 3 - Testes

Para rodar a suíte de testes unitários:

```shell
$ npm run test
```

ou com coverage:

```shell
$ npm run test-coverage
```

ou com coverage gerando um html:

```shell
$ npm run test-coverage-html
```

## 4 - Documentação dos endpoints

[![Documentação dos endpoints no Swagger](https://content.screencast.com/users/yury.oliveira/folders/Jing/media/9b10cdd7-293d-41a1-9ff3-a86e3273c862/2020-03-27_0804.png)](https://swagger.interno.testegerencianet.com.br/?url=https://gis.gitlab-pages.interno.testegerencianet.com.br/gis_lab/gis.yml)

## 5 - Collection do Postman

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.getpostman.com/collections/676df81d34ccd7583660)

## 6 - Versionamento

Para efetuar o deploy nas camadas de teste e produção é necessário criar uma tag no projeto.
A criação de tag deve ser feita apenas pela aprovação de um merge request para que o pipeline execute os testes, linter e etc.
A tag é criada automaticamente depois da aprovação do merge request com base em algumas flags contidas na mensagem do merge request.
São elas:

- `[BREAKING]` Incrementa a versão major. Ex: 1.1.1 ---> 2.0.0
- `[FEATURE]` Incrementa a versão minor. Ex: 1.1.1 ---> 1.2.0
- `[PATCH]` Incrementa a versão patch. Ex: 1.1.1 ---> 1.1.2

Ao inserir uma ou mais flags no campo "Merge commit message" durante a aprovação do merge request, o pipeline irá verificar
esta mensagem e incrementar o número de versão com maior precedência, ou seja, se por exemplo você usar `[PATCH]` e `[FEATURE]`
na mesma mensagem, apenas a versão minor será incrementada.

E lembre-se, sempre utilize as flags de acordo com o código implementado para que o versionamento fique coerente.
Em alguns casos será necessário utilizar várias flags para descrever tudo o que foi implementado, mas isso não é um problema
já que o script de criação de tag fará este tratamento. Veja abaixo um exemplo de mensagem:

```
CRM_1234-ajustar_endoints

[PATCH] Corrige tratamento de erros
[PATCH] Otimiza consultas no bd
[FEATURE] Implementa novo endpoint
[BREAKING] Altera parâmetros de autenticação dos endpoints
```

## 7 - Para configuração do projeto em sua VM, siga as seguintes instruções abaixo:

```
O servidor escuta na porta 4427, podendo ser acessado através da url `https://gis.{{SUA_MATRICULA}}.orp-1.colaboradores.labgerencianet.com.br` ou http://localhost:4427 desde que tenha sido mapeada no Vagrantfile.

// Clonar projeto
$ git clone git@gitlab.interno.testegerencianet.com.br:gis/gis_lab.git

// Build da aplicação
$ make build

// Instalar pacotes, rodar migrations, rodar seeders
$ make setup

// Rodar migrations
$ sequelize db:migrate --env=main

// Rodar seeders
$ sequelize db:seed:all --env=main
```

