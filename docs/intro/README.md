# Програмний модуль @molfar/amqp-client | Вступ

**Програмний модуль @molfar/amqp-client – "Програмний модуль для реалізації взаємодії мікросервісів за допомогою передачі повідомлень"**, який написаний мовою програмування JavaScript та заснований на бібліотеці [AMQP 0-9-1](https://www.npmjs.com/package/amqplib/v/0.8.0), призначений для забезпечення обміну повідомленнями між компонентами системи та забезпечення повної функціональної сумісністі та взаємодії між мікросервісами – відповідними клієнтськими додатками (також званими «клієнтами») та серверами проміжного програмного забезпечення (також званими «брокерами»), які здійснюють маршрутизацію, гарантують доставку, розподіл потоків повідомлень та підписку на потрібні типи повідомлень. 

## Зміст
- [Позначення та найменування програмного модуля](#name)
- [Програмне забезпечення, необхідне для функціонування програмного модуля](#software)
- [Функціональне призначення](#function)
- [Опис логічної структури](#structure)
- [Використовувані технічні засоби](#hardware)
- [Виклик та завантаження](#run)

<a name="name"></a>
<h2>Позначення та найменування програмного модуля</h2>

Програмний модуль має позначення **"@molfar/amqp-client"**.

Повне найменування програмного модуля – **"Програмний модуль для реалізації взаємодії мікросервісів за допомогою передачі повідомлень"**.


<a name="software"></a>
<h2>Програмне забезпечення, необхідне для функціонування програмного модуля</h2>

Для функціонування програмного модуля, написаного мовою програмування JavaScript, необхідне наступне програмне забезпечення та пакети:

- `@adobe/jsonschema2md` [v6.1.4](https://www.npmjs.com/package/@adobe/jsonschema2md/v/6.1.4)
- `@molfar/msapi-schemas` [v1.0.1](https://github.com/wdc-molfar/msapi-schemas)
- `Ajv JSON schema validator` [v8.6.3](https://www.npmjs.com/package/ajv/v/8.6.3)
- `ajv-errors` [v3.0.0](https://www.npmjs.com/package/ajv-errors/v/3.0.0)
- `ajv-formats` [v2.1.1](https://www.npmjs.com/package/ajv-formats/v/2.1.1)
- `amqp-client.js` [v1.1.6](https://www.npmjs.com/package/@cloudamqp/amqp-client/v/1.1.6)
- `AMQP 0-9-1 library and client for Node.JS` [v0.8.0](https://www.npmjs.com/package/amqplib/v/0.8.0)
- `amqplib-plus` [v1.0.9](https://www.npmjs.com/package/amqplib-plus/v/1.0.9)
- `eslint` [v8.2.0](https://www.npmjs.com/package/eslint/v/8.2.0)
- `eslint-config-airbnb-base` [v15.0.0](https://www.npmjs.com/package/eslint-config-airbnb-base/v/15.0.0)
- `eslint-config-prettier` [v8.3.0](https://www.npmjs.com/package/eslint-config-prettier/v/8.3.0)
- `eslint-plugin-import` [v2.25.3](https://www.npmjs.com/package/eslint-plugin-import/v/2.25.3)
- `eslint-plugin-prettier` [v4.0.0](https://www.npmjs.com/package/eslint-plugin-prettier/v/4.0.0)
- `eslint-plugin-vue` [v8.0.3](https://www.npmjs.com/package/eslint-plugin-vue/v/8.0.3)
- `deep-extend` [v0.6.0](https://www.npmjs.com/package/deep-extend/v/0.6.0)
- `Docker` [v20.10](https://docs.docker.com/engine/release-notes/#version-2010)
- `express` [v4.17.1](https://www.npmjs.com/package/express/v/4.17.1)
- `jest` [v27.2.5](https://www.npmjs.com/package/jest/v/27.2.5)
- `jest-cli` [v27.3.1](https://www.npmjs.com/package/jest-cli/v/27.3.1)
- `jest-html-reporters` [v2.1.6](https://www.npmjs.com/package/jest-html-reporters/v/2.1.6)
- `jest-openapi` [v0.14.0](https://www.npmjs.com/package/jest-openapi/v/0.14.0)
- `jest-stare` [v2.3.0](https://www.npmjs.com/package/jest-stare/v/2.3.0)
- `js-yaml` [v4.1.0](https://www.npmjs.com/package/js-yaml/v/4.1.0)
- `jsdoc-to-markdown` [v7.0.1](https://www.npmjs.com/package/jsdoc-to-markdown/v/7.1.0)
- `Kubernetes` [v1.22.4](https://github.com/kubernetes/kubernetes/releases/tag/v1.22.4)
- `lodash` [v4.17.21](https://www.npmjs.com/package/lodash/v/4.17.21)
- `mock-amqplib` [v1.4.0](https://www.npmjs.com/package/mock-amqplib/v/1.4.0)
- `Node.js` [v16.13.0](https://nodejs.org/download/release/v16.13.0/)
- `nodemon` [v2.0.15](https://www.npmjs.com/package/nodemon/v/2.0.15)
- `prettier` [v2.4.1](https://www.npmjs.com/package/prettier/v/2.4.1)
- `prism-themes` [v1.9.0](https://www.npmjs.com/package/prism-themes/v/1.9.0)
- `prom-client` [v14.0.1](https://www.npmjs.com/package/prom-client/v/14.0.1)
- `regenerator-runtime` [v0.13.9](https://www.npmjs.com/package/regenerator-runtime/v/0.13.9)
- `require-yml` [v2.0.0](https://www.npmjs.com/package/require-yml/v/2.0.0)
- `uuid` [v8.3.2](https://www.npmjs.com/package/uuid/v/8.3.2)
- `VuePress` [v1.8.2](https://www.npmjs.com/package/vuepress/v/1.8.2)
- `vuepress-theme-cool` [v1.3.1](https://www.npmjs.com/package/vuepress-theme-cool/v/1.3.1)
- `widdershins` [v4.0.1](https://www.npmjs.com/package/widdershins/v/4.0.1)

<a name="function"></a>
<h2>Функціональне призначення</h2>

Програмний модуль призначений для забезпечення обміну повідомленнями між компонентами системи та забезпечення повної функціональної сумісністі та взаємодії між мікросервісами – відповідними клієнтськими додатками (також званими «клієнтами») та серверами проміжного програмного забезпечення (також званими «брокерами»), які здійснюють маршрутизацію, гарантують доставку, розподіл потоків повідомлень, підписку на потрібні типи повідомлень.

<a name="structure"></a>
<h2>Опис логічної структури</h2>

Програмний модуль складається з:
- `Publisher` – клієнтський додаток, який відправляє повідомлення
- `AMQP-Manager` – сервер проміжного програмного забезпечення, що складається з `Exchange`та `Message queue`
- `Exchange` – здійснюює маршрутизацію, гарантує доставку, розподіл потоків повідомлень, підписку на потрібні черги повідомлень
- `Message queue` – черга повідомлень
- `Consumer` – клієнтський додаток, який споживає повідомлення

Повідомлення від `Publisher` відправляються до `AMQP manager`, який завдяки `Exchange` розподіляє повідомлення в одну або кілька черг повідомлень `Message queue`, які зберігають повідомлення, поки вони не будуть безпечно оброблені клієнтським додатком (або декількома клієнтськими додатками) `Consumer`, який споживає повідомлення. 

<a name="hardware"></a>
<h2>Використовувані технічні засоби</h2>

Програмний модуль експлуатується на сервері під управлінням `Node.js`. В основі управління всіх сервісів є система оркестрації `Kubernetes`, де всі контейнери працюють з використанням `Docker`.

<a name="run"></a>
<h2>Виклик та завантаження</h2>

Завантаження програмного модуля забезпечується шляхом запуску через планувальник задач – `Task Scheduler`.
