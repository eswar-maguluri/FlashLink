ALPHABET = (
    "0123456789"
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    "abcdefghijklmnopqrstuvwxyz"
)

def encode(num: int) -> str:
    if num == 0:
        return ALPHABET[0]
    result = []

    while num:
        num, remainder = divmod(num, 62)
        result.append(
            ALPHABET[remainder]
        )

    return "".join(
        reversed(result)
    )

def decode(short_code: str) -> int:
    num = 0
    for char in short_code:
        num =(
            num * 62
            + ALPHABET.index(char)
        )
    return num