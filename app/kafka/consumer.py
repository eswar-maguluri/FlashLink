from kafka import KafkaConsumer
import json
from app.database import SessionLocal
from app.models import AnalyticsEvent

consumer = KafkaConsumer(
    "click-events",
    bootstrap_servers="kafka:9092",
    auto_offset_reset="earliest",
    value_deserializer=lambda m:
        json.loads(m.decode("utf-8"))
)

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

        print(
            f"Saved click for {event['short_code']}"
        )

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")

    finally:
        db.close()