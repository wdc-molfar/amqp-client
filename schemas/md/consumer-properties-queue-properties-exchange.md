# Untitled object in Consumer options Schema

```txt
http://molfar.wdc.org.ua/schemas/consumer#/properties/queue/properties/exchange
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                   |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [consumer.schema.json*](../json/consumer.schema.json "open original schema") |

## exchange Type

`object` ([Details](consumer-properties-queue-properties-exchange.md))

# exchange Properties

| Property            | Type     | Required | Nullable       | Defined by                                                                                                                                                                                   |
| :------------------ | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [name](#name)       | `string` | Required | cannot be null | [Consumer options](consumer-properties-queue-properties-exchange-properties-name.md "http://molfar.wdc.org.ua/schemas/consumer#/properties/queue/properties/exchange/properties/name")       |
| [mode](#mode)       | `string` | Required | cannot be null | [Consumer options](consumer-properties-queue-properties-exchange-properties-mode.md "http://molfar.wdc.org.ua/schemas/consumer#/properties/queue/properties/exchange/properties/mode")       |
| [options](#options) | `object` | Required | cannot be null | [Consumer options](consumer-properties-queue-properties-exchange-properties-options.md "http://molfar.wdc.org.ua/schemas/consumer#/properties/queue/properties/exchange/properties/options") |

## name



`name`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [Consumer options](consumer-properties-queue-properties-exchange-properties-name.md "http://molfar.wdc.org.ua/schemas/consumer#/properties/queue/properties/exchange/properties/name")

### name Type

`string`

## mode



`mode`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [Consumer options](consumer-properties-queue-properties-exchange-properties-mode.md "http://molfar.wdc.org.ua/schemas/consumer#/properties/queue/properties/exchange/properties/mode")

### mode Type

`string`

## options



`options`

*   is required

*   Type: `object` ([Details](consumer-properties-queue-properties-exchange-properties-options.md))

*   cannot be null

*   defined in: [Consumer options](consumer-properties-queue-properties-exchange-properties-options.md "http://molfar.wdc.org.ua/schemas/consumer#/properties/queue/properties/exchange/properties/options")

### options Type

`object` ([Details](consumer-properties-queue-properties-exchange-properties-options.md))
