from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app import schemas, models
from app.database import get_db

router = APIRouter()

@router.post("/clients", response_model=schemas.ClientResponse, status_code=status.HTTP_201_CREATED)
async def create_client(
    client_data: schemas.ClientCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new client
    """
    new_client = models.Client(
        status=client_data.status,
        client_type=client_data.client_type,
        title=client_data.title,
        gender=client_data.gender,
        forename=client_data.forename,
        middle_name=client_data.middle_name,
        surname=client_data.surname,
        date_of_birth=client_data.date_of_birth,
        email=client_data.email,
        secondary_email=client_data.secondary_email,
        landline=client_data.landline
    )
    
    db.add(new_client)
    db.commit()
    db.refresh(new_client)
    
    return new_client

@router.get("/clients", response_model=schemas.ClientsListResponse)
async def get_all_clients(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all clients with optional filtering and search
    """
    query = db.query(models.Client)
    
    # Filter by status if provided
    if status_filter and status_filter != "all":
        query = query.filter(models.Client.status == status_filter)
    
    # Search by name if provided
    if search:
        search_term = f"%{search.lower()}%"
        query = query.filter(
            (models.Client.forename.ilike(search_term)) |
            (models.Client.surname.ilike(search_term)) |
            (models.Client.middle_name.ilike(search_term))
        )
    
    clients = query.order_by(models.Client.surname, models.Client.forename).offset(skip).limit(limit).all()
    total = query.count()
    
    return {
        "clients": clients,
        "total": total
    }

@router.get("/clients/{client_id}", response_model=schemas.ClientResponse)
async def get_client(
    client_id: str,
    db: Session = Depends(get_db)
):
    """
    Get a specific client by ID
    """
    client = db.query(models.Client).filter(models.Client.id == client_id).first()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    return client

@router.put("/clients/{client_id}", response_model=schemas.ClientResponse)
async def update_client(
    client_id: str,
    client_data: schemas.ClientUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a client
    """
    client = db.query(models.Client).filter(models.Client.id == client_id).first()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Update only provided fields
    update_data = client_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(client, field, value)
    
    db.commit()
    db.refresh(client)
    
    return client

@router.delete("/clients/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_client(
    client_id: str,
    db: Session = Depends(get_db)
):
    """
    Delete a client
    """
    client = db.query(models.Client).filter(models.Client.id == client_id).first()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    db.delete(client)
    db.commit()
    
    return None

