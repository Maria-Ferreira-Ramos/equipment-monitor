from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import models
import schemas
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message" : "Hello, this is my equipment monitor API"}

@app.post("/equipment", response_model=schemas.EquipmentOut)
def create_equipment(equipment: schemas.EquipmentCreate, db: Session = Depends(get_db)):
    db_equipment = models.Equipment(**equipment.model_dump())
    db.add(db_equipment)
    db.commit()
    db.refresh(db_equipment)
    return db_equipment

@app.get("/equipment", response_model=list[schemas.EquipmentOut])
def list_equipment(db: Session = Depends(get_db)):
    return db.query(models.Equipment).all()

@app.post("/equipment/{equipment_id}/readings", response_model=schemas.ReadingOut)
def add_reading(equipment_id: int, reading: schemas.ReadingCreate, db: Session = Depends(get_db)):
    equipment = db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")

    db_reading = models.Reading(equipment_id=equipment_id, **reading.model_dump())
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)
    return db_reading

@app.get("/equipment/{equipment_id}/status", response_model=schemas.EquipmentStatus)
def get_status(equipment_id: int, db: Session = Depends(get_db)):
    equipment = db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    latest = (
        db.query(models.Reading)
        .filter(models.Reading.equipment_id == equipment_id)
        .order_by(models.Reading.timestamp.desc())
        .first()
    )

    if not latest:
        return schemas.EquipmentStatus(
            equipment_id=equipment_id,
            name=equipment.name,
            latest_value=None,
            unit=None,
            is_anomalous=False
        )
    is_anomalous = latest.value < equipment.min_expected or latest.value > equipment.max_expected

    return schemas.EquipmentStatus(
        equipment_id=equipment_id,
        name=equipment.name,
        latest_value=latest.value,
        unit=latest.unit,
        is_anomalous=is_anomalous
    )