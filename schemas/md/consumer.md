# Consumer options Schema

```txt
http://molfar.wdc.org.ua/schemas/consumer
```

Bla bla bla

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                  |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [consumer.schema.json](../json/consumer.schema.json "open original schema") |

## Consumer options Type

`object` ([Consumer options](consumer.md))

# Consumer options Properties

| Property            | Type     | Required | Nullable       | Defined by                                                                                                         |
| :------------------ | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------- |
| [queue](#queue)     | `object` | Required | cannot be null | [Consumer options](consumer-properties-queue.md "http://molfar.wdc.org.ua/schemas/consumer#/properties/queue")     |
| [message](#message) | `object` | Required | cannot be null | [Consumer options](consumer-properties-message.md "http://molfar.wdc.org.ua/schemas/consumer#/properties/message") |

## queue



`queue`

*   is required

*   Type: `object` ([Details](consumer-properties-queue.md))

*   cannot be null

*   defined in: [Consumer options](consumer-properties-queue.md "http://molfar.wdc.org.ua/schemas/consumer#/properties/queue")

### queue Type

`object` ([Details](consumer-properties-queue.md))

## message



`message`

*   is required

*   Type: `object` ([Details](consumer-properties-message.md))

*   cannot be null

*   defined in: [Consumer options](consumer-properties-message.md "http://molfar.wdc.org.ua/schemas/consumer#/properties/message")

### message Type

`object` ([Details](consumer-properties-message.md))
