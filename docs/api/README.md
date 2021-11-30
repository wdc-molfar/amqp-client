# @molfar/amqp-client. Специфікація модуля

## Modules

<dl>
<dt><a href="#module_AmqpManager">AmqpManager</a></dt>
<dd></dd>
<dt><a href="#module_Consumer">Consumer</a></dt>
<dd></dd>
<dt><a href="#module_Publisher">Publisher</a></dt>
<dd></dd>
<dt><a href="#MiddlewareMiddlewaremodule_">MiddlewareMiddleware</a></dt>
<dd></dd>
<dt><a href="#module_Validate">Validate</a></dt>
<dd><p>Validate</p>
</dd>
<dt><a href="#module_ConsumerValidate">ConsumerValidate</a></dt>
<dd></dd>
<dt><a href="#module_ManagerValidate">ManagerValidate</a></dt>
<dd></dd>
<dt><a href="#module_PublisherValidate">PublisherValidate</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#exp_module_ AmqpManager--AmqpManager.getInstance">AmqpManager.getInstance()</a> ⇒ <code>Object</code> ⏏</dt>
<dd><p>Створює посилання на amqp-manager якщо його немає</p>
</dd>
</dl>

<a name="module_AmqpManager"></a>

## AmqpManager

* [AmqpManager](#module_AmqpManager)
    * [~AmqpManager](#module_AmqpManager..AmqpManager)
        * [.pool](#module_AmqpManager..AmqpManager+pool) ⇒ <code>Map</code>
        * [.pool](#module_AmqpManager..AmqpManager+pool)
        * [.newInstance()](#module_AmqpManager..AmqpManager+newInstance) ⇒ <code>Object</code>
        * [.getConnectionConfig(url)](#module_AmqpManager..AmqpManager+getConnectionConfig) ⇒ <code>Map</code>
        * [.setConnectionConfig(url, connection)](#module_AmqpManager..AmqpManager+setConnectionConfig)
        * [.getClientConnection(client)](#module_AmqpManager..AmqpManager+getClientConnection) ⇒ <code>Map</code>
        * [.getConnection(client, options)](#module_AmqpManager..AmqpManager+getConnection) ⇒
        * [.createPublisher()](#module_AmqpManager..AmqpManager+createPublisher) ⇒ <code>Publisher</code>
        * [.createConsumer()](#module_AmqpManager..AmqpManager+createConsumer) ⇒ <code>Object</code>
        * [.closeConnection(client)](#module_AmqpManager..AmqpManager+closeConnection)
        * [.clearAndShutdown()](#module_AmqpManager..AmqpManager+clearAndShutdown)
        * [.size()](#module_AmqpManager..AmqpManager+size) ⇒ <code>size</code>

<a name="module_AmqpManager..AmqpManager"></a>

### AmqpManager~AmqpManager
AmqpManager

**Kind**: inner class of [<code>AmqpManager</code>](#module_AmqpManager)  

* [~AmqpManager](#module_AmqpManager..AmqpManager)
    * [.pool](#module_AmqpManager..AmqpManager+pool) ⇒ <code>Map</code>
    * [.pool](#module_AmqpManager..AmqpManager+pool)
    * [.newInstance()](#module_AmqpManager..AmqpManager+newInstance) ⇒ <code>Object</code>
    * [.getConnectionConfig(url)](#module_AmqpManager..AmqpManager+getConnectionConfig) ⇒ <code>Map</code>
    * [.setConnectionConfig(url, connection)](#module_AmqpManager..AmqpManager+setConnectionConfig)
    * [.getClientConnection(client)](#module_AmqpManager..AmqpManager+getClientConnection) ⇒ <code>Map</code>
    * [.getConnection(client, options)](#module_AmqpManager..AmqpManager+getConnection) ⇒
    * [.createPublisher()](#module_AmqpManager..AmqpManager+createPublisher) ⇒ <code>Publisher</code>
    * [.createConsumer()](#module_AmqpManager..AmqpManager+createConsumer) ⇒ <code>Object</code>
    * [.closeConnection(client)](#module_AmqpManager..AmqpManager+closeConnection)
    * [.clearAndShutdown()](#module_AmqpManager..AmqpManager+clearAndShutdown)
    * [.size()](#module_AmqpManager..AmqpManager+size) ⇒ <code>size</code>

<a name="module_AmqpManager..AmqpManager+pool"></a>

#### amqpManager.pool ⇒ <code>Map</code>
гетер для колекції

**Kind**: instance property of [<code>AmqpManager</code>](#module_AmqpManager..AmqpManager)  
<a name="module_AmqpManager..AmqpManager+pool"></a>

#### amqpManager.pool
Задає значення для колекції

**Kind**: instance property of [<code>AmqpManager</code>](#module_AmqpManager..AmqpManager)  

| Param | Description |
| --- | --- |
| newPool | нова колекція |

<a name="module_AmqpManager..AmqpManager+newInstance"></a>

#### amqpManager.newInstance() ⇒ <code>Object</code>
Створює нове посилання на amqp-manager

**Kind**: instance method of [<code>AmqpManager</code>](#module_AmqpManager..AmqpManager)  
<a name="module_AmqpManager..AmqpManager+getConnectionConfig"></a>

#### amqpManager.getConnectionConfig(url) ⇒ <code>Map</code>
**Kind**: instance method of [<code>AmqpManager</code>](#module_AmqpManager..AmqpManager)  
**Returns**: <code>Map</code> - повертає конфігурацію з'єднання  

| Param | Description |
| --- | --- |
| url | url для з'єднання з AMQP-брокером |

<a name="module_AmqpManager..AmqpManager+setConnectionConfig"></a>

#### amqpManager.setConnectionConfig(url, connection)
Задає конфігурації з'єднання по клієнту

**Kind**: instance method of [<code>AmqpManager</code>](#module_AmqpManager..AmqpManager)  

| Param | Description |
| --- | --- |
| url | url для з'єднання з AMQP-брокером |
| connection | з'єднання з AMQP-брокером |

<a name="module_AmqpManager..AmqpManager+getClientConnection"></a>

#### amqpManager.getClientConnection(client) ⇒ <code>Map</code>
**Kind**: instance method of [<code>AmqpManager</code>](#module_AmqpManager..AmqpManager)  
**Returns**: <code>Map</code> - Повертає конфігурацію з'єднання по клієнту  

| Param | Description |
| --- | --- |
| client | UUID клієнта |

<a name="module_AmqpManager..AmqpManager+getConnection"></a>

#### amqpManager.getConnection(client, options) ⇒
Створює конфігурацію по клієнту

**Kind**: instance method of [<code>AmqpManager</code>](#module_AmqpManager..AmqpManager)  
**Returns**: повертає з'єднання з AMQP-брокером  

| Param | Description |
| --- | --- |
| client | UUID клієнта |
| options | налаштування з'єднання з AMQP-брокером |

<a name="module_AmqpManager..AmqpManager+createPublisher"></a>

#### amqpManager.createPublisher() ⇒ <code>Publisher</code>
Створює publisher

**Kind**: instance method of [<code>AmqpManager</code>](#module_AmqpManager..AmqpManager)  
**Returns**: <code>Publisher</code> - об'єкт класу [Publisher](Publisher)  
**Params**: options налаштування публікувальника  
<a name="module_AmqpManager..AmqpManager+createConsumer"></a>

#### amqpManager.createConsumer() ⇒ <code>Object</code>
Створює consumer

**Kind**: instance method of [<code>AmqpManager</code>](#module_AmqpManager..AmqpManager)  
**Returns**: <code>Object</code> - об'єкт класу Consumer  
<a name="module_AmqpManager..AmqpManager+closeConnection"></a>

#### amqpManager.closeConnection(client)
Закриває з'днання по клієнту

**Kind**: instance method of [<code>AmqpManager</code>](#module_AmqpManager..AmqpManager)  

| Param |
| --- |
| client | 

<a name="module_AmqpManager..AmqpManager+clearAndShutdown"></a>

#### amqpManager.clearAndShutdown()
Закриває з'єднання для всіх клієнтів

**Kind**: instance method of [<code>AmqpManager</code>](#module_AmqpManager..AmqpManager)  
<a name="module_AmqpManager..AmqpManager+size"></a>

#### amqpManager.size() ⇒ <code>size</code>
**Kind**: instance method of [<code>AmqpManager</code>](#module_AmqpManager..AmqpManager)  
**Returns**: <code>size</code> - повертає розмір pool-конфігурацій з'єднання  
<a name="module_Consumer"></a>

## Consumer

* [Consumer](#module_Consumer)
    * [~Consumer](#module_Consumer..Consumer)
        * [new Consumer(manager, options)](#new_module_Consumer..Consumer_new)
        * [.connection](#module_Consumer..Consumer+connection) ⇒ <code>Object</code>
        * [.client](#module_Consumer..Consumer+client) ⇒ <code>Object</code>
        * [.options](#module_Consumer..Consumer+options) ⇒ <code>Object</code>
        * [.channel](#module_Consumer..Consumer+channel) ⇒ <code>URL</code>
        * [.queue](#module_Consumer..Consumer+queue) ⇒ <code>Object</code>
        * [.middleware](#module_Consumer..Consumer+middleware) ⇒ <code>URL</code>
        * [.moduleInit()](#module_Consumer..Consumer+moduleInit)
        * [.use(callback)](#module_Consumer..Consumer+use)
        * [.start()](#module_Consumer..Consumer+start)
        * [.close()](#module_Consumer..Consumer+close)

<a name="module_Consumer..Consumer"></a>

### Consumer~Consumer
Consumer

**Kind**: inner class of [<code>Consumer</code>](#module_Consumer)  
**Properties**

| Name | Description |
| --- | --- |
| client | {@see client} |


* [~Consumer](#module_Consumer..Consumer)
    * [new Consumer(manager, options)](#new_module_Consumer..Consumer_new)
    * [.connection](#module_Consumer..Consumer+connection) ⇒ <code>Object</code>
    * [.client](#module_Consumer..Consumer+client) ⇒ <code>Object</code>
    * [.options](#module_Consumer..Consumer+options) ⇒ <code>Object</code>
    * [.channel](#module_Consumer..Consumer+channel) ⇒ <code>URL</code>
    * [.queue](#module_Consumer..Consumer+queue) ⇒ <code>Object</code>
    * [.middleware](#module_Consumer..Consumer+middleware) ⇒ <code>URL</code>
    * [.moduleInit()](#module_Consumer..Consumer+moduleInit)
    * [.use(callback)](#module_Consumer..Consumer+use)
    * [.start()](#module_Consumer..Consumer+start)
    * [.close()](#module_Consumer..Consumer+close)

<a name="new_module_Consumer..Consumer_new"></a>

#### new Consumer(manager, options)
створює екземпляр отримувача


| Param | Description |
| --- | --- |
| manager | примірник amqp-manager [???](???)(./amqp-manager.js) |
| options | налаштування отримувача [options](options) |

<a name="module_Consumer..Consumer+connection"></a>

#### consumer.connection ⇒ <code>Object</code>
гетер для з'єднання з amqp

**Kind**: instance property of [<code>Consumer</code>](#module_Consumer..Consumer)  
**Returns**: <code>Object</code> - - {@see connection}  
<a name="module_Consumer..Consumer+client"></a>

#### consumer.client ⇒ <code>Object</code>
гетер для UUID клієнта

**Kind**: instance property of [<code>Consumer</code>](#module_Consumer..Consumer)  
**Returns**: <code>Object</code> - - {@see client}  
<a name="module_Consumer..Consumer+options"></a>

#### consumer.options ⇒ <code>Object</code>
гетер для налаштування Публікувальника повідомлень

**Kind**: instance property of [<code>Consumer</code>](#module_Consumer..Consumer)  
**Returns**: <code>Object</code> - - {@see client}  
<a name="module_Consumer..Consumer+channel"></a>

#### consumer.channel ⇒ <code>URL</code>
гетер для посилання на екземпляр каналу

**Kind**: instance property of [<code>Consumer</code>](#module_Consumer..Consumer)  
**Returns**: <code>URL</code> - - {@see client}  
<a name="module_Consumer..Consumer+queue"></a>

#### consumer.queue ⇒ <code>Object</code>
гетер для черги для обробки повідомлень

**Kind**: instance property of [<code>Consumer</code>](#module_Consumer..Consumer)  
**Returns**: <code>Object</code> - - {@see queue}  
<a name="module_Consumer..Consumer+middleware"></a>

#### consumer.middleware ⇒ <code>URL</code>
гетер для посилання на ланцюжок оброблення повыдомлень

**Kind**: instance property of [<code>Consumer</code>](#module_Consumer..Consumer)  
**Returns**: <code>URL</code> - - {@see client}  
<a name="module_Consumer..Consumer+moduleInit"></a>

#### consumer.moduleInit()
Ініціалізація Consumer-залежностей

**Kind**: instance method of [<code>Consumer</code>](#module_Consumer..Consumer)  
<a name="module_Consumer..Consumer+use"></a>

#### consumer.use(callback)
Додає callback до ланцюжка оброблення повідомлень [middleware](middleware)

**Kind**: instance method of [<code>Consumer</code>](#module_Consumer..Consumer)  

| Param |
| --- |
| callback | 

<a name="module_Consumer..Consumer+start"></a>

#### consumer.start()
Запускає ланцюжок оброблення повідомлень

**Kind**: instance method of [<code>Consumer</code>](#module_Consumer..Consumer)  
<a name="module_Consumer..Consumer+close"></a>

#### consumer.close()
Закриває канал по клієнту

**Kind**: instance method of [<code>Consumer</code>](#module_Consumer..Consumer)  
<a name="module_Publisher"></a>

## Publisher

* [Publisher](#module_Publisher)
    * [~Publisher](#module_Publisher..Publisher)
        * [new Publisher(manager, options)](#new_module_Publisher..Publisher_new)
        * [.connection](#module_Publisher..Publisher+connection) ⇒ <code>Object</code>
        * [.client](#module_Publisher..Publisher+client) ⇒ <code>Object</code>
        * [.options](#module_Publisher..Publisher+options) ⇒ <code>Object</code>
        * [.channel](#module_Publisher..Publisher+channel) ⇒ <code>URL</code>
        * [.middleware](#module_Publisher..Publisher+middleware) ⇒ <code>URL</code>
        * [.moduleInit()](#module_Publisher..Publisher+moduleInit)
        * [.use(callback)](#module_Publisher..Publisher+use)
        * [.send(msg)](#module_Publisher..Publisher+send)
        * [.close()](#module_Publisher..Publisher+close)

<a name="module_Publisher..Publisher"></a>

### Publisher~Publisher
Publisher

**Kind**: inner class of [<code>Publisher</code>](#module_Publisher)  
**Properties**

| Name | Description |
| --- | --- |
| client | {@see client} |


* [~Publisher](#module_Publisher..Publisher)
    * [new Publisher(manager, options)](#new_module_Publisher..Publisher_new)
    * [.connection](#module_Publisher..Publisher+connection) ⇒ <code>Object</code>
    * [.client](#module_Publisher..Publisher+client) ⇒ <code>Object</code>
    * [.options](#module_Publisher..Publisher+options) ⇒ <code>Object</code>
    * [.channel](#module_Publisher..Publisher+channel) ⇒ <code>URL</code>
    * [.middleware](#module_Publisher..Publisher+middleware) ⇒ <code>URL</code>
    * [.moduleInit()](#module_Publisher..Publisher+moduleInit)
    * [.use(callback)](#module_Publisher..Publisher+use)
    * [.send(msg)](#module_Publisher..Publisher+send)
    * [.close()](#module_Publisher..Publisher+close)

<a name="new_module_Publisher..Publisher_new"></a>

#### new Publisher(manager, options)
створює екземпляр публікувальника


| Param | Description |
| --- | --- |
| manager | примірник amqp-manager [???](???)(./amqp-manager.js) |
| options | налаштування Публікувальника [options](options) |

<a name="module_Publisher..Publisher+connection"></a>

#### publisher.connection ⇒ <code>Object</code>
гетер для з'єднання з amqp

**Kind**: instance property of [<code>Publisher</code>](#module_Publisher..Publisher)  
**Returns**: <code>Object</code> - - {@see connection}  
<a name="module_Publisher..Publisher+client"></a>

#### publisher.client ⇒ <code>Object</code>
гетер для UUID клієнта

**Kind**: instance property of [<code>Publisher</code>](#module_Publisher..Publisher)  
**Returns**: <code>Object</code> - - {@see client}  
<a name="module_Publisher..Publisher+options"></a>

#### publisher.options ⇒ <code>Object</code>
гетер для налаштування Публікувальника повідомлень

**Kind**: instance property of [<code>Publisher</code>](#module_Publisher..Publisher)  
**Returns**: <code>Object</code> - - {@see client}  
<a name="module_Publisher..Publisher+channel"></a>

#### publisher.channel ⇒ <code>URL</code>
гетер для посилання на екземпляр каналу

**Kind**: instance property of [<code>Publisher</code>](#module_Publisher..Publisher)  
**Returns**: <code>URL</code> - - {@see client}  
<a name="module_Publisher..Publisher+middleware"></a>

#### publisher.middleware ⇒ <code>URL</code>
гетер для посилання на ланцюжок оброблення повыдомлень

**Kind**: instance property of [<code>Publisher</code>](#module_Publisher..Publisher)  
**Returns**: <code>URL</code> - - {@see client}  
<a name="module_Publisher..Publisher+moduleInit"></a>

#### publisher.moduleInit()
Ініціалізація Publisher-залежностей

**Kind**: instance method of [<code>Publisher</code>](#module_Publisher..Publisher)  
<a name="module_Publisher..Publisher+use"></a>

#### publisher.use(callback)
Додає callback до ланцюжка оброблення повідомлень @link (#middleware)

**Kind**: instance method of [<code>Publisher</code>](#module_Publisher..Publisher)  

| Param |
| --- |
| callback | 

<a name="module_Publisher..Publisher+send"></a>

#### publisher.send(msg)
Відправлення повідомлення при цьому виконує ланцюжок оброблення повідомлення повідомлення [#middleware](#middleware)

**Kind**: instance method of [<code>Publisher</code>](#module_Publisher..Publisher)  

| Param | Description |
| --- | --- |
| msg | повідомлення |

<a name="module_Publisher..Publisher+close"></a>

#### publisher.close()
Закриває канал по клієнту

**Kind**: instance method of [<code>Publisher</code>](#module_Publisher..Publisher)  
<a name="MiddlewareMiddlewaremodule_"></a>

## MiddlewareMiddleware
<a name="module_Validate"></a>

## Validate
Validate

<a name="module_ConsumerValidate"></a>

## ConsumerValidate

* [ConsumerValidate](#module_ConsumerValidate)
    * [~ConsumerValidate](#module_ConsumerValidate..ConsumerValidate) ⇐ <code>Validate</code>
        * [.validateOptions(options)](#module_ConsumerValidate..ConsumerValidate.validateOptions)

<a name="module_ConsumerValidate..ConsumerValidate"></a>

### ConsumerValidate~ConsumerValidate ⇐ <code>Validate</code>
ConsumerValidate

**Kind**: inner class of [<code>ConsumerValidate</code>](#module_ConsumerValidate)  
**Extends**: <code>Validate</code>  
<a name="module_ConsumerValidate..ConsumerValidate.validateOptions"></a>

#### ConsumerValidate.validateOptions(options)
Викликає повідомлення про помилку, що виникає у зв'язкуз відсутніми налаштуваннями отримувача

**Kind**: static method of [<code>ConsumerValidate</code>](#module_ConsumerValidate..ConsumerValidate)  

| Param |
| --- |
| options | 

<a name="module_ManagerValidate"></a>

## ManagerValidate

* [ManagerValidate](#module_ManagerValidate)
    * [~ManagerValidate](#module_ManagerValidate..ManagerValidate) ⇐ <code>Validate</code>
        * [.validateOptions(options)](#module_ManagerValidate..ManagerValidate.validateOptions)

<a name="module_ManagerValidate..ManagerValidate"></a>

### ManagerValidate~ManagerValidate ⇐ <code>Validate</code>
ManagerValidate

**Kind**: inner class of [<code>ManagerValidate</code>](#module_ManagerValidate)  
**Extends**: <code>Validate</code>  
<a name="module_ManagerValidate..ManagerValidate.validateOptions"></a>

#### ManagerValidate.validateOptions(options)
Викликає повідомлення про помилку,що виникає у зв'язку з відсутньою url властивості

**Kind**: static method of [<code>ManagerValidate</code>](#module_ManagerValidate..ManagerValidate)  

| Param |
| --- |
| options | 

<a name="module_PublisherValidate"></a>

## PublisherValidate

* [PublisherValidate](#module_PublisherValidate)
    * [~PublisherValidate](#module_PublisherValidate..PublisherValidate) ⇐ <code>Validate</code>
        * [.validateOptions(options)](#module_PublisherValidate..PublisherValidate.validateOptions)

<a name="module_PublisherValidate..PublisherValidate"></a>

### PublisherValidate~PublisherValidate ⇐ <code>Validate</code>
PublisherValidate

**Kind**: inner class of [<code>PublisherValidate</code>](#module_PublisherValidate)  
**Extends**: <code>Validate</code>  
<a name="module_PublisherValidate..PublisherValidate.validateOptions"></a>

#### PublisherValidate.validateOptions(options)
Викликає повідомлення про помилку, що виникає у зв'язкуз відсутніми налаштуваннями публікувальника

**Kind**: static method of [<code>PublisherValidate</code>](#module_PublisherValidate..PublisherValidate)  

| Param |
| --- |
| options | 

