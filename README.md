# Kafka Source missing events tests

Created for https://issues.redhat.com/browse/SRVKE-927

## Info


```
┌────────────────┐
│                │
│  sender        │
│                │
└──────┬─────────┘
       │
       │
┌──────▼─────────┐
│                │
│  Kafka topic   │
│                │
└──────┬─────────┘
       │
       │
       │
┌──────▼────────┐
│               │
│  Kafka source │
│               │
└──────┬────────┘
       │
       │
       │
┌──────▼────────┐
│               │
│  receiver     │
│               │
└───────────────┘
```

- Sender talks to Kafka directly
- Kafka source fetches the messages from Kafka and sends them to the receiver


The test is:
- Send events continuously over the pipeline
- Kill KafkaSource adapter pods and see what happens

## Instructions

Install 0.23 stuff:
```bash
./hack/0.23/01-kn-serving.sh
./hack/0.23/02-kn-eventing.sh
./hack/0.23/03-strimzi.sh
./hack/0.23/04-kn-kafka.sh
```

Install 0.24 stuff:
```bash
./hack/0.24/01-kn-serving.sh
./hack/0.24/02-kn-eventing.sh
./hack/0.24/03-strimzi.sh
./hack/0.24/04-kn-kafka.sh
```

Create receiver and the source:

```bash
k apply -f config/100-receiver.yaml
k apply -f config/200-kafka-source.yaml
```

Start watching receiver logs:

```
stern receiver
```

Create sender and start watching logs:

```
k apply -f config/300-sender.yaml
stern sender
```

Sender will send messages for N minutes. You have N mins to kill pods and create chaos.

Use following script to kill Kafka source pods continuously:

```
while kubectl delete pods -n default -l eventing.knative.dev/sourceName=test-kafka-source && sleep 10; do :; done
```

Receiver will stop receiving events after M mins.
Sender will print the number of messages it sends.
Receiver will print the number of messages it receives.


Restart

```
k delete -f config/300-sender.yaml
k delete -f config/200-kafka-source.yaml
k delete -f config/100-receiver.yaml

k apply -f config/100-receiver.yaml
k apply -f config/200-kafka-source.yaml
k apply -f config/300-sender.yaml
```
