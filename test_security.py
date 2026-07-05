from app.core.security import (
    hash_password,
    verify_password
)
password = "Password123"
hashed = hash_password(password)
print("Original Password:", password)
print("Hashed Password:", hashed)
print(
    "Correct Password:",
    verify_password(
        "Password123",
        hashed
    )
)
print(
    "Wrong Password:",
    verify_password(
        "WrongPassword",
        hashed
    )
)