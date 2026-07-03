from prometheus_client import Counter

url_created_counter = Counter(
    "flashlink_urls_created_total",
    "Total URLs created"
)

redirect_counter = Counter(
    "flashlink_redirects_total",
    "Total redirects"
)

user_registered_counter = Counter(
    "flashlink_users_registered_total",
    "Total registered users"
)