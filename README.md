<div>
  <img src="https://brandslogos.com/wp-content/uploads/thumbs/nodejs-logo-vector.svg" width="512">
</div>

# RestAPI com NodeJS Vanilla

***

# Introdução

## Sobre
Este projeto consiste em uma Rest API feita totalmente com NodeJS sem nenhum framework extra, apenas com ```built-in modules``` do próprio NodeJS. Esta foi, literalmente, minha primeira API, portanto, não irei pedir desculpas por isso... mas sim agradecer por você estar aqui. Neste README terá todos os detalhes de como utilizar a API, recomendo fortemente que utilize apenas estudos.

## Atenção

- Utilize o [Postman](https://www.postman.com/) ou algum serviço semelhante para realizar requests GET, POST, PUT e DELETE com IDs específicos. Como foi utilizado MVC (design pattern), possui um index.html dentro de um view para realizar requests GET pegando todos os produtos.

## Instalação
Este projeto não utiliza nenhum modulo de terceiros, apenas built-in modules. Portanto, apenas certifique-se que o NodeJS esteja instalado em seu computador. Entretanto, o único modulo está relacionado a dev dependecy que é o nodemon. Utilize o comando abaixo para a instalação:

> npm install

## Comandos
Antes de ir para os primeiros passos, a única coisa que você precisa é inicializar o servidor local. Para isso, utilize algum comando abaixo (de preferência, a versão de desenvolvimento)

produção (production):
> npm run start

desenvolvimento (development):
> npm run dev

***

# Primeiros passos

## Acessando a página inicial (index.html)
Todo o tutorial será baseado em um servidor local, não irá mudar muito caso você queira testar em um servidor próprio, basta mudar os domínios de localhost para o seu domínio **mantendo os paths** nos URLs conforme será mostrado. Vamos começar!

- Após o servidor se inicializar, acesse o seguinte URL: ```http://localhost:8080/index.html``` (ou apenas ```localhost:8080/index.html```).
- Nessa página terá alguns botões, veja como cada um funciona:

| fetch request | 
| --------------|
| Ao clicar neste botão e visualizar o console do seu browser, você irá visualizar todos os produtos que estão contidos dentro de um arquivo ```.json```, dentro da página database do projeto. Este botão irá utilizar o fetch API para fazer as requisições |

| xhr request |
| ----------- |
| Este botão faz a mesma função que o botão ```fetch request``` a única diferença interna é que é utilizado XMLHttpRequest para as requisições |

| temp key request |
| ---------------- |
| Ao clicar neste botão e visualizar o console do seu browser, uma chave única e geral (um UUID) irá ser enviada para você. Essa chave sempre será uma chave geral contida na pasta temp_data do projeto, isso é, não é gerada uma chave para cada usuário e sim para todos... portanto se dois usuários solicitarem ao mesmo tempo, a última requisição que chegar será a chave. **Esta é apenas uma forma de 'teste' para não fazer requisições POST, PUT e DELETE sem uma confirmação do lado do servidor, algo bem básico e obviamente sem uma segurança recomendada**. |

| Feito por |
| -------- | 
|<img src="https://avatars.githubusercontent.com/u/74028582?v=4" width="128">|
|<a href="https://github.com/vinicius-goncalves/">Vinícius Gonçalves</a>|

Projeto sob [licença](LICENSE.md) GPL 3.0
