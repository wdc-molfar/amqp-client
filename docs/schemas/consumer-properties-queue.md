# Untitled object in Consumer options Schema

```txt
http://molfar.wdc.org.ua/schemas/consumer#/properties/queue
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [consumer.schema.json*](json/consumer.schema.json "open original schema") |

## queue Type

`object` ([Details](consumer-properties-queue.md))

# queue Properties

| Property              | Type     | Required | Nullable       | Defined by                                                                                                                                             |
| :-------------------- | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| [name](#name)         | Merged   | Optional | cannot be null | [Consumer options](consumer-properties-queue-properties-name.md "http://molfar.wdc.org.ua/schemas/consumer#/properties/queue/properties/name")         |
| [exchange](#exchange) | `object` | Required | cannot be null | [Consumer options](consumer-properties-queue-properties-exchange.md "http://molfar.wdc.org.ua/schemas/consumer#/properties/queue/properties/exchange") |
| [options](#options)   | `object` | Required | cannot be null | [Consumer options](consumer-properties-queue-properties-options.md "http://molfar.wdc.org.ua/schemas/consumer#/properties/queue/properties/options")   |

## name



`name`

*   is optional

*   Type: merged type ([Details](consumer-properties-queue-properties-name.md))

*   cannot be null

*   defined in: [Consumer options](consumer-properties-queue-properties-name.md "http://molfar.wdc.org.ua/schemas/consumer#/properties/queue/properties/name")

### name Type

merged type ([Details](consumer-properties-queue-properties-name.md))

any of

*   [Untitled string in Consumer options](consumer-properties-queue-properties-name-anyof-0.md "check type definition")

*   [Untitled null in Consumer options](consumer-properties-queue-properties-name-anyof-1.md "check type definition")

## exchange



`exchange`

*   is required

*   Type: `object` ([Details](consumer-properties-queue-properties-exchange.md))

*   cannot be null

*   defined in: [Consumer options](consumer-properties-queue-properties-exchange.md "http://molfar.wdc.org.ua/schemas/consumer#/properties/queue/properties/exchange")

### exchange Type

`object` ([Details](consumer-properties-queue-properties-exchange.md))

## options



`options`

*   is required

*   Type: `object` ([Details](consumer-properties-queue-properties-options.md))

*   cannot be null

*   defined in: [Consumer options](consumer-properties-queue-properties-options.md "http://molfar.wdc.org.ua/schemas/consumer#/properties/queue/properties/options")

### options Type

`object` ([Details](consumer-properties-queue-properties-options.md))
