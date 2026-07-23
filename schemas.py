from pydantic import BaseModel

class EquipmentCreate(BaseModel):
    name: str
    equipment_type: str
    min_expected: float
    max_expected: float

class EquipmentOut(EquipmentCreate):
    id: int

    class Config:
        from_attributes = True
        
