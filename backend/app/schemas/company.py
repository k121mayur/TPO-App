from pydantic import BaseModel, Field


class CompanyRead(BaseModel):
    id: str
    name: str
    logo: str
    description: str
    website: str
    is_verified: bool = Field(alias="isVerified")

    class Config:
        allow_population_by_field_name = True
        orm_mode = True


class CompanyCreate(BaseModel):
    name: str
    description: str
    website: str | None = None
