from prometheus_client import Counter

users_registered = Counter(
    "flashlink_users_registered_total",
    "Total Registered Users"
)
urls_created = Counter(
    "flashlink_urls_created_total",
    "Total URLs Created"
)
redirects = Counter(
    "flashlink_redirects_total",
    "Total URL Redirects"
)
cache_hits = Counter(
    "flashlink_cache_hits_total",
    "Redis Cache Hits"
)
cache_misses = Counter(
    "flashlink_cache_misses_total",
    "Redis Cache Misses"
)
analytics_events = Counter(
    "flashlink_analytics_events_total",
    "Analytics Events Processed"
)