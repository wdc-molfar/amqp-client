# Untitled object in Consumer options Schema

```txt
http://molfar.wdc.org.ua/schemas/consumer/#/properties/queue#/properties/queue/properties/options
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [consumer.schema.json*](json/consumer.schema.json "open original schema") |

## options Type

`object` ([Details](consumer-properties-consumes-queue-options-properties-options.md))

# options Properties

| Property                  | Type      | Required | Nullable       | Defined by                                                                                                                                                                                                                           |
| :------------------------ | :-------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [noAck](#noack)           | `boolean` | Required | cannot be null | [Consumer options](consumer-properties-consumes-queue-options-properties-options-properties-noack.md "http://molfar.wdc.org.ua/schemas/consumer/#/properties/queue#/properties/queue/properties/options/properties/noAck")           |
| [exclusive](#exclusive)   | `boolean` | Required | cannot be null | [Consumer options](consumer-properties-consumes-queue-options-properties-options-properties-exclusive.md "http://molfar.wdc.org.ua/schemas/consumer/#/properties/queue#/properties/queue/properties/options/properties/exclusive")   |
| [durable](#durable)       | `boolean` | Required | cannot be null | [Consumer options](consumer-properties-consumes-queue-options-properties-options-properties-durable.md "http://molfar.wdc.org.ua/schemas/consumer/#/properties/queue#/properties/queue/properties/options/properties/durable")       |
| [autoDelete](#autodelete) | `boolean` | Required | cannot be null | [Consumer options](consumer-properties-consumes-queue-options-properties-options-properties-autodelete.md "http://molfar.wdc.org.ua/schemas/consumer/#/properties/queue#/properties/queue/properties/options/properties/autoDelete") |
| [prefetch](#prefetch)     | `number`  | Required | cannot be null | [Consumer options](consumer-properties-consumes-queue-options-properties-options-properties-prefetch.md "http://molfar.wdc.org.ua/schemas/consumer/#/properties/queue#/properties/queue/properties/options/properties/prefetch")     |

## noAck



`noAck`

*   is required

*   Type: `boolean`

*   cannot be null

*   defined in: [Consumer options](consumer-properties-consumes-queue-options-properties-options-properties-noack.md "http://molfar.wdc.org.ua/schemas/consumer/#/properties/queue#/properties/queue/properties/options/properties/noAck")

### noAck Type

`boolean`

## exclusive



`exclusive`

*   is required

*   Type: `boolean`

*   cannot be null

*   defined in: [Consumer options](consumer-properties-consumes-queue-options-properties-options-properties-exclusive.md "http://molfar.wdc.org.ua/schemas/consumer/#/properties/queue#/properties/queue/properties/options/properties/exclusive")

### exclusive Type

`boolean`

## durable



`durable`

*   is required

*   Type: `boolean`

*   cannot be null

*   defined in: [Consumer options](consumer-properties-consumes-queue-options-properties-options-properties-durable.md "http://molfar.wdc.org.ua/schemas/consumer/#/properties/queue#/properties/queue/properties/options/properties/durable")

### durable Type

`boolean`

## autoDelete



`autoDelete`

*   is required

*   Type: `boolean`

*   cannot be null

*   defined in: [Consumer options](consumer-properties-consumes-queue-options-properties-options-properties-autodelete.md "http://molfar.wdc.org.ua/schemas/consumer/#/properties/queue#/properties/queue/properties/options/properties/autoDelete")

### autoDelete Type

`boolean`

## prefetch



`prefetch`

*   is required

*   Type: `number`

*   cannot be null

*   defined in: [Consumer options](consumer-properties-consumes-queue-options-properties-options-properties-prefetch.md "http://molfar.wdc.org.ua/schemas/consumer/#/properties/queue#/properties/queue/properties/options/properties/prefetch")

### prefetch Type

`number`
