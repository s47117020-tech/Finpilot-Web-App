from fastapi import APIRouter, HTTPException
from schemas.wrapped import WrappedSummaryResponse
from services import wrapped_service

router = APIRouter(tags=["Wrapped"])


@router.get("/wrapped/summary", response_model=WrappedSummaryResponse)
def get_wrapped_summary(user_id: str, year: int = 2025):
    """
    Get a year-end 'Budget Wrapped' summary for the user.
    Aggregates transactions, salaries, and goals for the specified year.
    """
    try:
        return wrapped_service.get_wrapped_summary(user_id, year)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
