# Kafka Channel reload tests

Created for https://issues.redhat.com/browse/SRVKE-927

Install 0.23 stuff:
```bash
./hack/0.23/01-kn-serving.sh
./hack/0.23/02-kn-eventing.sh
./hack/0.23/03-strimzi.sh
./hack/0.23/04-kn-kafka.sh
```

Install 0.24 stuff:
```bash
TODO
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

Sender will send messages for 2 minutes. You have 2 mins to kill pods and create chaos.

Use following script to kill Kafka source pods continuously:

```
while kubectl delete pods -n default -l eventing.knative.dev/sourceName=test-kafka-source && sleep 10; do :; done
```

Receiver will stop receiving events after 3 mins.
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
