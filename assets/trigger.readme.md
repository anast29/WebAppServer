### Protocol

Currently only json protocol is supported for sending requests from one component to another. In future others like Protocol Buffers or plain binary protocol may be added if necessary. However, for GUI, which can be developed on many languages, json fits well.  
Every message consists of a header and a body. The header is a 4-bytes integer (in little endian) that is the size of the body. The body has the size specified in the header and is a json string. Each json string can contain either a single object or an array of objects. Each object is a request and all the possible formats are described below. Responses have the same format, except that only objects are sent in json, not arrays.  


#### Criterion/Subscription Requests

This section describes TM <-> T protocol. The role of TM is to instruct what securities to track (subscribe) and what criterions to evaluate. Each criterion consists of several expressions + order action. Each expression is a simple condition, such as, quote price is greater than some value, or broker id of a quote equals to some number.
To evaluate expressions in criterions, T maintains order books for all the subscribed securities. The order books are updated live. After every update, expressions are reevaluated.  
When all expressions in a criterion are evaluated to true, an insert order request (order action) is sent from T to OG.  

T accepts two types of requests:
1. Criterions requests
2. Securities subscription requests

When a client connects to T, a list of available omdc and omdd securities is sent immediately:

```
{
    "omdc" : [ ], // list of omdc securities
    "omdd" : [ ], // list of omdd securities
}
```

omdc security object:

```
{
    "security" : 1, // integer. Security id
    "name" : "sec1" // string. Security name 
}
```

omdd security object (the format is the same as for omdc. This can be changed in future, so objects definitions is kept separate):

```
{
    "security" : 1, // integer. Security id
    "name" : "orderbook1" // string. Security name 
}
```

##### Add Criterion

```
{
    "op" : "add",
    "ext_cl_ord_id" : 1, // unique integer for given connection to OG. Mandatory
    "enabled" : true, // boolean. If criterion is enabled when added. Expressions are evaluated only for enabled criterions. Mandatory
    "expressions" : [ ], // array of expression objects. Described below. Must not be empty. Mandatory
    "order_action" : { } // order to send to OG when all expressions are evaluated to true. Mandatory
}
```

Expression object:

There are several types of expressions that T accepts, depending on what parameter needs to be controlled. Each expression type is identified by a `type` field.

1. Quote price. The logic is the following: take a book that corresponds to a given security, take either buy or sell side, take the price at a specified level, compare it with a given value.

```
{
    "type" : "omdc_quote_price_expression" or "omdd_quote_price_expression", // expression type. Mandatory
    "security" : 1, // integer. security id. Mandatory
    "side" : "buy", // string. Book side. Can be "buy" or "sell". Mandatory
    "level" : 0, // integer. Quote level in a book to which the expression is applied. Levels are 0-based. Mandatory
    "compare" : "le", // string.  can be "l"(less), "le"(less or equal), "eq"(equal), "ne"(not equal), "ge"(greater or equal), "g"(greater). Mandatory
    "price" : // decimal. Value to compare with. Mandatory
}
```

2. Quote quantity. The logic is the following: take a book that corresponds to a given security, take either buy or sell side, take the quantity at a specified level, compare it with a given value.

```
{
    "type" : "omdc_quote_qty_expression" or "omdd_quote_qty_expression", // expression type. Mandatory
    "security" : 1, // integer. security id. Mandatory
    "side" : "buy", // string. Book side. Can be "buy" or "sell". Mandatory
    "level" : 0, // integer. Quote level in a book to which the expression is applied. Levels are 0-based. Mandatory
    "compare" : "le", // string.  can be "l"(less), "le"(less or equal), "eq"(equal), "ne"(not equal), "ge"(greater or equal), "g"(greater). Mandatory
    "qty" : // decimal. Value to compare with. Mandatory
}
```

3. Quote broker id. The logic is the following: take a book that corresponds to a given security, take either buy or sell side, take the broker id at a specified level, compare it with a given value.

```
{
    "type" : "omdc_quote_broker_id_expression" or "omdd_quote_broker_id_expression", // expression type. Mandatory
    "security" : 1, // integer. Security id. Mandatory
    "side" : "buy", // string. Book side. Can be "buy" or "sell". Mandatory
    "level" : 0, // integer. Quote level in a book to which the expression is applied. Levels are 0-based. Mandatory
    "broker_id" : 2488: // integer. Value of broker id to compare with. Mandatory
}
```

4. Trade price. The logic is the following: for the given security, take the price of the latest trade and compare it with the given value.

```
{
    "type" : "omdc_trade_price_expression" or "omdd_trade_price_expression", // expression type. Mandatory
    "security" : 1, // integer. Security id. Mandatory
    "compare" : "le", // string.  can be "l"(less), "le"(less or equal), "eq"(equal), "ne"(not equal), "ge"(greater or equal), "g"(greater). Mandatory
    "price" : // decimal. Value to compare with. Mandatory
}
```

5. Trade quantity. The logic is the following: for the given security, take the quantity of the latest trade and compare it with the given value.

```
{
    "type" : "omdc_trade_qty_expression" or "omdd_trade_qty_expression", // expression type. Mandatory
    "security" : 1, // integer. Security id. Mandatory
    "compare" : "le", // string.  can be "l"(less), "le"(less or equal), "eq"(equal), "ne"(not equal), "ge"(greater or equal), "g"(greater). Mandatory
    "quantity" : // decimal. Value to compare with. Mandatory
}
```

Order action object:

{
    "account_id" : 100, // integer specifying account id on behalf of which an order is sent. Mandatory.
    "broker_id" : 2844, // integer, OGC broker id. Mandatory.
    "security" : 128, // integer or string specifying security id. Mandatory.
    "side" : "buy", // string. Order side. Can be "buy","sell","sell_short","buy_short". Mandatory.
    "type" : "market", // string. Order type. Can be "market" or "limit". Mandatory.
    "price" : // decimal. Order price. Mandatory for limit orders only
    "qty" : // decimal. Order quantity. Must be multiple of the lot size for a given security. Mandatory.
    "tif" : "day", // string. Time in force of an order. Can be "day","ioc","fok","at_crossing". Mandatory.
    "currency" : "HKD", // string. Security currency. OG account management accepts only "HKD". Mandatory.
    "execution_instuctions" : [0, 1], //array of integers. Can contain values 0, 1. See OCG doc for more details. Optional.
}

After add criterion action is executed the following response is sent back from T to TM:

```
{
    "ext_cl_ord_id" : 1 // integer. The ext_cl_ord_id specified in the request
    "criterion_id" : 2 // integer. Unique id of the criterion.
}
```

When all the expressions of a criterion are evaluated to true, an order is sent and the criterion becomes disabled. The following message is sent to TM:

```
{
    "op" : "executed",
    "cl_ord_id : 5, // integer. `cl_ord_id` value of an order sent to OCG
    "criterion_id" : 2, // integer. Criterion id.
}
```

##### Clear All Criterions

Request:

```
{
    "op" : "clear",
    "ext_cl_ord_id" : 1, // unique integer for given connection to OG. Mandatory
}
```

Response:

```
{
    "ext_cl_ord_id" : 1 // integer. The ext_cl_ord_id specified in the request
}
```

##### Enable/Disable Criterions

Request:

```
{
    "op" : "enable",
    "ext_cl_ord_id" : 1, // unique integer for given connection to OG. Mandatory
    "criterion_id" : 5, // integer. Criterion id returned from Add Criterion request. Mandatory
    "enable" : false // boolean. Enable or disable criterion. Mandatory
}
```

Response:

```
{
    "ext_cl_ord_id" : 1 // integer. The ext_cl_ord_id specified in the request
}
```

##### Subscribe

After TM connects to T, it receives a list of all the available omdc and omdd securities. TM needs to decide what securities T must subscribe to.

Request:

```
{
    "op" : "subscribe",
    "ext_cl_ord_id" : 1, // unique integer for given connection to OG. Mandatory
    "omdc" : [ ], // array of integer. Array of omdc security ids to subscribe to. Mandatory
    "omdd" : [ ], // array of integer. Array of omdd security ids to subscribe to. Mandatory
}
```

Response:

```
{
    "ext_cl_ord_id" : 1 // integer. The ext_cl_ord_id specified in the request
}
```
