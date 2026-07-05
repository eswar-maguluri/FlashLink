from kafka import KafkaProducer
import json

producer = None

def get_producer():
    global producer
    if producer is None:
        producer = KafkaProducer(
            bootstrap_servers="kafka:9092",
            value_serializer=lambda v:
                json.dumps(v).encode("utf-8")
        )
    return producer