from pydantic import BaseModel
from datetime import datetime

class EquipmentCreate(BaseModel):
    name: str
    equipment_type: str
    min_expected: float
    max_expected: float

class EquipmentOut(EquipmentCreate):
    id: int

    class Config:
        from_attributes = True
        
class ReadingCreate(BaseModel):
    value: float
    unit: str

class ReadingOut(ReadingCreate):
    id: int
    equipment_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class EquipmentStatus(BaseModel):
    equipment_id: int
    name: str
    latest_value: float | None
    unit: str | None
    is_anomalous: bool
    


