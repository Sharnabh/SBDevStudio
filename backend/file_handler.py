import os
import uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException
from typing import List

# Use env override for uploads; default to backend/uploads
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", Path(__file__).parent / "uploads"))
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "gif"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

# Create upload directories if missing
(UPLOAD_DIR / "projects").mkdir(parents=True, exist_ok=True)
(UPLOAD_DIR / "testimonials").mkdir(parents=True, exist_ok=True)


def validate_file(file: UploadFile) -> None:
    """Validate uploaded file."""
    # Check file extension
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    extension = file.filename.split(".")[-1].lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )


async def save_upload_file(file: UploadFile, subfolder: str) -> str:
    """Save uploaded file and return the file path."""
    validate_file(file)
    
    # Generate unique filename
    extension = file.filename.split(".")[-1].lower()
    unique_filename = f"{uuid.uuid4()}.{extension}"
    
    # Create full path
    file_path = UPLOAD_DIR / subfolder / unique_filename
    
    # Save file
    contents = await file.read()
    
    # Check file size
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE / 1024 / 1024}MB"
        )
    
    with open(file_path, "wb") as f:
        f.write(contents)
    
    # Return relative path for URL
    return f"/uploads/{subfolder}/{unique_filename}"


def delete_file(file_path: str) -> None:
    """Delete a file from the uploads directory."""
    if file_path.startswith("/uploads/"):
        full_path = UPLOAD_DIR / file_path.replace("/uploads/", "")
        if full_path.exists():
            full_path.unlink()