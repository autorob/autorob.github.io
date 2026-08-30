# Autorob TCP/JSON Rosbridge Protocol

## Overview

This document defines the reusable course protocol for topic and service
communication. Individual projects define the names and payloads carried by
this protocol.

## Transport and common conventions

The gateway must be reachable at `127.0.0.1:9095` and accept multiple
concurrent TCP clients. Traffic is UTF-8, with one JSON object per line,
terminated by `\n`. JSON key order, insignificant whitespace, and unknown
object fields are not semantic.

Every request has an `op` field. An optional `id` identifies a request;
`call_service` requires one. IDs are opaque JSON values and must be unique
among a client's outstanding operations. When the protocol returns an ID to
the caller, it returns the caller's original value.

Names identify topics and services by exact match. Individual projects may
define naming conventions; behavior for malformed or empty names is
unspecified. Type strings are informational metadata, not a runtime type
system.

The gateway uses diagnostic status objects:

```json
{"op":"status","level":"info","msg":"subscribed to /topic","id":"sub-1"}
```

`level` is `"info"` or `"error"`, and `msg` is a string. Include the ID when
the triggering request supplied one. Clients may receive unrelated status or
publication messages while waiting for a service response.

## Topics

| Operation | Required fields | Effect |
| --- | --- | --- |
| `advertise` | `op`, `topic`, `type` | Register this connection as a publisher. |
| `unadvertise` | `op`, `topic` | Withdraw this connection's publisher registration. |
| `publish` | `op`, `topic`, `msg` | Deliver `msg` to current subscribers of that exact topic. |
| `subscribe` | `op`, `topic`, `type` | Register this connection as a subscriber. |
| `unsubscribe` | `op`, `topic` | Withdraw this connection's subscription. |

Examples:

```json
{"op":"advertise","topic":"/chatter","type":"example/Message","id":"pub-1"}
{"op":"subscribe","topic":"/chatter","type":"example/Message","id":"sub-1"}
{"op":"publish","topic":"/chatter","msg":{"data":"hello"}}
```

A subscriber receives:

```json
{"op":"publish","topic":"/chatter","msg":{"data":"hello"}}
```

Send an informational `status` after a subscription is registered. Topic
delivery is best-effort and nonpersistent: there is no latching, history, or
replay. Different topic names remain isolated. Repeated unadvertise and
unsubscribe operations must be safe. Project 1 does not otherwise rely on a
particular behavior for redundant advertisement or subscription requests.
Closing a connection withdraws only that connection's publishers and
subscriptions.

## Services

| Operation | Required fields | Effect |
| --- | --- | --- |
| `advertise_service` | `op`, `service`, `type` | Register this connection as a provider. |
| `unadvertise_service` | `op`, `service` | Withdraw this connection's current provider registration. |
| `call_service` | `op`, `service`, `id`, `args` | Call a named service. |
| `service_response` | `op`, `service`, `id`, `values`, `result` | Respond to a forwarded call. |

`args` may be any JSON value. A provider receives a forwarded `call_service`
with the same service and arguments but a provider-side ID. It responds using
the received ID:

```json
{"op":"service_response","service":"/echo","id":"provider-call-3","values":{"echo":"hello"},"result":true,"status":""}
```

The gateway sends the caller a response with its original ID:

```json
{"op":"service_response","service":"/echo","id":"call-17","values":{"echo":"hello"},"result":true,"status":""}
```

Individual projects define the structure and types of `values` and `result`.
`status`, when present, is a diagnostic string. Send an informational `status`
after a service registration completes.

One current provider per service name is sufficient. The policy for competing
simultaneous provider registrations is implementation-defined, but a future
call must never be routed to a provider that has withdrawn or disconnected.
`unadvertise_service` removes a service only when the sender is its current
provider. Connection close removes services owned by that connection.

Calls are correlated by connection and ID. Concurrent calls must not be
cross-correlated. A missing provider, provider disconnect, or timeout must
return a clean `result:false` response with the original caller ID. Timeout
duration is implementation-defined but must be bounded; a call must not wait
indefinitely. A `service_response` is valid only for an outstanding
provider-side call on that connection. Unknown or stale response IDs may be
ignored or receive an error status, but must never complete another caller's
request.

## Errors, cleanup, and implementation freedom

Unknown operations produce an error status. Malformed requests may be rejected
or may close the offending connection, but they must not terminate the gateway
or unrelated connections. Detailed malformed-request behavior, including
missing fields and malformed application payloads, is otherwise unspecified.

The protocol does not prescribe internal topology, process count, concurrency
strategy, message queues, timeout value, or implementation language. A slow
client must not prevent unrelated clients from making progress. All
registrations are owned by their connection and are cleaned up on disconnect.
