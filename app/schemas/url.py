from pydantic import BaseModel
from pydantic import HttpUrl

class CreateURLRequest(BaseModel):
    url: HttpUrl
class URLResponse(BaseModel):
    short_url: str