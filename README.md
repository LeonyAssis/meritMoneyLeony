# GIS - Gerencianet Internal Service

[![pipeline status](https://gitlab.interno.testegerencianet.com.br/desenvolvimento/gis_lab/badges/master/pipeline.svg)](https://gitlab.interno.testegerencianet.com.br/desenvolvimento/gis_lab/commits/master)
[![coverage report](https://gitlab.interno.testegerencianet.com.br/desenvolvimento/gis_lab/badges/master/coverage.svg)](https://gis.gitlab-pages.interno.testegerencianet.com.br/gis_lab/coverage/)

> Disponibiliza endpoints para serviços internos utilizados pela Intranet.

<p align="center">
 <img src="https://content.screencast.com/users/yury.oliveira/folders/Jing/media/2ab638a6-4f12-42ec-8fd2-00950516af33/2020-03-27_0740.png"/>
</p>

## 1 - Requisitos para rodar na máquina local

- NodeJS 12.15.0
- sequelize-cli para rodar as migrations;
- Credenciais para consumir o _auth-server_;

## 2 - Iniciando o server

```shell
$ npm start
```

O servidor escuta na porta 4427, podendo ser acessado através da url `http://localhost:4427`.

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
MPTK_1234-ajustar_endoints

[PATCH] Corrige tratamento de erros
[PATCH] Otimiza consultas no bd
[FEATURE] Implementa novo endpoint
[BREAKING] Altera parâmetros de autenticação dos endpoints
```

## 7 - Para configuração do projeto em sua VM, siga as seguintes instruções abaixo:

```
//Clonar projeto
$ git clone git@gitlab.interno.testegerencianet.com.br:gis/gis_lab.git

//Setar versão do Node
$ nvm use 12.15.0

//Instalar pacotes
$ npm install

//Rodar migrations
$ sequelize db:migrate --env=main

//Rodar seeders
$ sequelize db:seed:all --env=main
```

Caso queira configurar o projeto para iniciar pelo PM2, copie e crie um arquivo gis.json com o conteúdo abaixo:

```
{
  "apps" : [
  {
    "name": "auth",
    "cwd": "/home/vagrant/projects/src/auth",
    "script": "app.js",
    "watch": false,
    "exec_interpreter": "/home/vagrant/.nvm/versions/node/v6.10.3/bin/node",
    "log_date_format": "YYYY-MM-DD HH:mm Z",
    "out_file": "/dev/null",
    "error_file": "/dev/null"
  },
  {
    "name": "gis",
    "cwd": "/home/vagrant/projects/src/gis-lab",
    "script": "app.js",
    "watch": true,
    "exec_interpreter": "/home/vagrant/.nvm/versions/node/v12.13.0/bin/node",
    "log_date_format": "YYYY-MM-DD HH:mm Z",
    "out_file": "/dev/null",
    "error_file": "/dev/null"
  }
  ]
}
```

Depois basta rodar o seguinte comando:

```
//Caso não possua instale o PM2
$ npm install -g pm2

//Inicia o serviço pelo PM2
$ pm2 start gis.json
```
