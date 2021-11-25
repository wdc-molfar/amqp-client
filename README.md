# MOLFAR. Програмний модуль для реалізації взаємодії мікросервісів за допомогою передачі повідомлень – @molfar/amqp-client

Програмний модуль @molfar/amqp-client написаний мовою програмування JavaScript та заснований на бібліотеці [AMQP 0-9-1](https://www.npmjs.com/package/amqplib/v/0.8.0).

Призначений для забезпечення обміну повідомленнями між компонентами системи та забезпечення повної функціональної сумісністі та взаємодії між мікросервісами – відповідними клієнтськими додатками (також званими «клієнтами») та серверами проміжного програмного забезпечення (також званими «брокерами»), які здійснюють маршрутизацію, гарантують доставку, розподіл потоків повідомлень та підписку на потрібні типи повідомлень. 

Містить також виконуваний приклад, що демонструє надсилання та споживання 5-ти тестових повідомлень.

Для запуску виконуваного прикладу використовуються менеджер пакетів для мови програмування JavaScript – `npm (Node Package Manager)`, та команда

```shell
   npm run example
```

Дивись [документацію](https://wdc-molfar.github.io/amqp-client/)
