# @molfar/amqp-client. Специфікація модуля

<a name="Publisher"></a>

## Publisher
**Kind**: global class  
**Properties**

| Name | Description |
| --- | --- |
| client | {@see client} |


* [Publisher](#Publisher)
    * [new Publisher(manager, options)](#new_Publisher_new)
    * [.connection](#Publisher+connection) ⇒ <code>Object</code>
    * [.client](#Publisher+client) ⇒ <code>Object</code>
    * [.options](#Publisher+options) ⇒ <code>Object</code>
    * [.channel](#Publisher+channel) ⇒ <code>Object</code>
    * [.middleware](#Publisher+middleware) ⇒ <code>Object</code>
    * [.moduleInit()](#Publisher+moduleInit)
    * [.use(callback)](#Publisher+use)
    * [.send(msg)](#Publisher+send)
    * [.close()](#Publisher+close)

<a name="new_Publisher_new"></a>

### new Publisher(manager, options)
створює екземпляр публікувальника


| Param | Description |
| --- | --- |
| manager | примірник amqp-manager [???](???)(./amqp-manager.js) |
| options | налаштування Публікувальника [options](options) |

<a name="Publisher+connection"></a>

### publisher.connection ⇒ <code>Object</code>
гетер для з'єднання

**Kind**: instance property of [<code>Publisher</code>](#Publisher)  
**Returns**: <code>Object</code> - - {@see connection}  
<a name="Publisher+client"></a>

### publisher.client ⇒ <code>Object</code>
гетер для клієнта

**Kind**: instance property of [<code>Publisher</code>](#Publisher)  
**Returns**: <code>Object</code> - - {@see client}  
<a name="Publisher+options"></a>

### publisher.options ⇒ <code>Object</code>
гетер для клієнта

**Kind**: instance property of [<code>Publisher</code>](#Publisher)  
**Returns**: <code>Object</code> - - {@see client}  
<a name="Publisher+channel"></a>

### publisher.channel ⇒ <code>Object</code>
гетер для клієнта

**Kind**: instance property of [<code>Publisher</code>](#Publisher)  
**Returns**: <code>Object</code> - - {@see client}  
<a name="Publisher+middleware"></a>

### publisher.middleware ⇒ <code>Object</code>
гетер для клієнта

**Kind**: instance property of [<code>Publisher</code>](#Publisher)  
**Returns**: <code>Object</code> - - {@see client}  
<a name="Publisher+moduleInit"></a>

### publisher.moduleInit()
Ініціалізація Publisher-залежностей

**Kind**: instance method of [<code>Publisher</code>](#Publisher)  
<a name="Publisher+use"></a>

### publisher.use(callback)
Додає callback до ланцюжка оброблення повідомлень @link (#middleware)

**Kind**: instance method of [<code>Publisher</code>](#Publisher)  

| Param |
| --- |
| callback | 

<a name="Publisher+send"></a>

### publisher.send(msg)
Відправлення повідомлення при цьому виконує ланцюжок оброблення повідомлення повідомлення [#middleware](#middleware)

**Kind**: instance method of [<code>Publisher</code>](#Publisher)  

| Param | Description |
| --- | --- |
| msg | повідомлення |

<a name="Publisher+close"></a>

### publisher.close()
Закриває канал по клієнту

**Kind**: instance method of [<code>Publisher</code>](#Publisher)  
