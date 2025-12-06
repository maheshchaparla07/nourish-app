from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app import schemas, models
from app.database import get_db

router = APIRouter()

@router.post("/carers", response_model=schemas.CarerResponse, status_code=status.HTTP_201_CREATED)
async def create_carer(
    carer_data: schemas.CarerCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new carer
    """
    new_carer = models.Carer(
        status=carer_data.status,
        title=carer_data.title,
        gender=carer_data.gender,
        forename=carer_data.forename,
        middle_name=carer_data.middle_name,
        surname=carer_data.surname,
        date_of_birth=carer_data.date_of_birth,
        email=carer_data.email,
        secondary_email=carer_data.secondary_email,
        landline=carer_data.landline,
        mobile=carer_data.mobile,
        has_mobile_access=carer_data.has_mobile_access
    )
    
    db.add(new_carer)
    db.commit()
    db.refresh(new_carer)
    
    return new_carer

@router.get("/carers", response_model=schemas.CarersListResponse)
async def get_all_carers(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all carers with optional filtering and search
    """
    query = db.query(models.Carer)
    
    # Filter by status if provided
    if status_filter and status_filter != "all":
        query = query.filter(models.Carer.status == status_filter)
    
    # Search by name if provided
    if search:
        search_term = f"%{search.lower()}%"
        query = query.filter(
            (models.Carer.forename.ilike(search_term)) |
            (models.Carer.surname.ilike(search_term)) |
            (models.Carer.middle_name.ilike(search_term))
        )
    
    carers = query.order_by(models.Carer.surname, models.Carer.forename).offset(skip).limit(limit).all()
    total = query.count()
    
    return {
        "carers": carers,
        "total": total
    }

@router.get("/carers/{carer_id}", response_model=schemas.CarerResponse)
async def get_carer(
    carer_id: str,
    db: Session = Depends(get_db)
):
    """
    Get a specific carer by ID
    """
    carer = db.query(models.Carer).filter(models.Carer.id == carer_id).first()
    
    if not carer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carer not found"
        )
    
    return carer

@router.put("/carers/{carer_id}", response_model=schemas.CarerResponse)
async def update_carer(
    carer_id: str,
    carer_data: schemas.CarerUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a carer
    """
    carer = db.query(models.Carer).filter(models.Carer.id == carer_id).first()
    
    if not carer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carer not found"
        )
    
    # Update only provided fields
    update_data = carer_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(carer, field, value)
    
    db.commit()
    db.refresh(carer)
    
    return carer

@router.delete("/carers/{carer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_carer(
    carer_id: str,
    db: Session = Depends(get_db)
):
    """
    Delete a carer
    """
    carer = db.query(models.Carer).filter(models.Carer.id == carer_id).first()
    
    if not carer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carer not found"
        )
    
    db.delete(carer)
    db.commit()
    
    return None

