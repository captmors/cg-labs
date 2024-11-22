from enum import Enum
from pydantic import BaseModel

class ImageData(BaseModel):
    id: int
    url: str
    name: str
    
class RawImageData(BaseModel):
    id: int
    name: str
    image: bytes # base64

class FilterName(str, Enum):
    MEDIAN = "median"
    MINIMUM = "minimum"
    MAXIMUM = "maximum"
    EROSION = "erosion"
    DILATION = "dilation"
    OPENING = "opening"
    CLOSURE = "closure"
