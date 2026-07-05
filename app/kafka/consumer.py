from kafka import KafkaConsumer
import json
import time
from app.database import SessionLocal
from app.models import AnalyticsEvent
from app.monitoring.metrics import analytics_counter

consumer = None
while consumer is None:
    try:
        consumer = KafkaConsumer(
            "click-events",
            bootstrap_servers=["kafka:9092"],
            auto_offset_reset="earliest",
            enable_auto_commit=True,
            value_deserializer=lambda m: json.loads(
                m.decode("utf-8")
            )
        )
        print("Kafka Consumer Connected")
    except Exception as e:
        print(f"Waiting for Kafka... {e}")
        time.sleep(5)
for message in consumer:
    event = message.value
    db = SessionLocal()
    try:
        analytics_event = AnalyticsEvent(
            id=int(event["id"]),
            short_code=event["short_code"],
            ip_address=event["ip_address"],
            user_agent=event["user_agent"]
        )
        db.add(analytics_event)
        db.commit()
        analytics_counter.inc()
        print(
            f"Saved click for {event['short_code']}"
        )
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
    finally:
        db.close()