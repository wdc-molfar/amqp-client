# Consumer options Schema

```txt
http://molfar.wdc.org.ua/schemas/consumer
```

Bla bla bla

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                               |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [consumer.schema.json](json/consumer.schema.json "open original schema") |

## Consumer options Type

`object` ([Consumer options](consumer.md))

# Consumer options Properties

| Property            | Type     | Required | Nullable       | Defined by                                                                                                                                         |
| :------------------ | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| [amqp](#amqp)       | `object` | Required | cannot be null | [Consumer options](consumer-properties-amqp.md "http://molfar.wdc.org.ua/schemas/consumer#/properties/amqp")                                       |
| [queue](#queue)     | `object` | Required | cannot be null | [Consumer options](consumer-properties-consumes-queue-options.md "http://molfar.wdc.org.ua/schemas/consumer/#/properties/queue#/properties/queue") |
| [message](#message) | `object` | Required | cannot be null | [Consumer options](consumer-properties-message.md "http://molfar.wdc.org.ua/schemas/consumer#/properties/message")                                 |

## amqp



`amqp`

*   is required

*   Type: `object` ([Details](consumer-properties-amqp.md))

*   cannot be null

*   defined in: [Consumer options](consumer-properties-amqp.md "http://molfar.wdc.org.ua/schemas/consumer#/properties/amqp")

### amqp Type

`object` ([Details](consumer-properties-amqp.md))

## queue

Options for queue configuration

`queue`

*   is required

*   Type: `object` ([Consumes queue options](consumer-properties-consumes-queue-options.md))

*   cannot be null

*   defined in: [Consumer options](consumer-properties-consumes-queue-options.md "http://molfar.wdc.org.ua/schemas/consumer/#/properties/queue#/properties/queue")

### queue Type

`object` ([Consumes queue options](consumer-properties-consumes-queue-options.md))

## message



`message`

*   is required

*   Type: `object` ([Details](consumer-properties-message.md))

*   cannot be null

*   defined in: [Consumer options](consumer-properties-message.md "http://molfar.wdc.org.ua/schemas/consumer#/properties/message")

### message Type

`object` ([Details](consumer-properties-message.md))
