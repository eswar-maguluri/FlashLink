from prometheus_client import Counter

user_registered_counter = Counter(
    "flashlink_users_registered_total",
    "Total Registered Users"
)
url_created_counter = Counter(
    "flashlink_urls_created_total",
    "Total URLs Created"
)
redirect_counter = Counter(
    "flashlink_redirects_total",
    "Total URL Redirects"
)
cache_hit_counter = Counter(
    "flashlink_cache_hits_total",
    "Redis Cache Hits"
)
cache_miss_counter = Counter(
    "flashlink_cache_misses_total",
    "Redis Cache Misses"
)
analytics_counter = Counter(
    "flashlink_analytics_events_total",
    "Analytics Events Processed"
)