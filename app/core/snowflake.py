import threading
import time


class SnowflakeGenerator:
    """
    Twitter Snowflake Implementation
    41 bits timestamp
    10 bits machine id
    12 bits sequence
    """

    EPOCH = 1704067200000
    MACHINE_BITS = 10
    SEQUENCE_BITS = 12
    MAX_MACHINE_ID = (1 << MACHINE_BITS) - 1
    MAX_SEQUENCE = (1 << SEQUENCE_BITS) - 1

    def __init__(self, machine_id: int):
        if machine_id < 0 or machine_id > self.MAX_MACHINE_ID:
            raise ValueError(
                f"Machine ID must be between 0 and {self.MAX_MACHINE_ID}"
            )
        self.machine_id = machine_id
        self.sequence = 0
        self.last_timestamp = -1
        self.lock = threading.Lock()

    def _current_timestamp(self) -> int:
        return int(time.time() * 1000)

    def generate(self) -> int:
        with self.lock:
            timestamp = self._current_timestamp()
            if timestamp < self.last_timestamp:
                raise RuntimeError(
                    "Clock moved backwards"
                )
            if timestamp == self.last_timestamp:
                self.sequence = (
                    self.sequence + 1
                ) & self.MAX_SEQUENCE
                if self.sequence == 0:
                    while timestamp <= self.last_timestamp:
                        timestamp = self._current_timestamp()
            else:
                self.sequence = 0
            self.last_timestamp = timestamp
            return (
                ((timestamp - self.EPOCH) << 22)
                | (self.machine_id << 12)
                | self.sequence
            )