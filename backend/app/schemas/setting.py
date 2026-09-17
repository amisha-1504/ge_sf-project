from pydantic import BaseModel
from typing import Optional

class ThemeModeColors(BaseModel):
    primary: str
    primaryGradientEnd: str
    accentSecondary: str
    bgPrimary: str
    bgCard: str
    textPrimary: str

class ThemeSettingsSchema(BaseModel):
    dark: ThemeModeColors
    light: ThemeModeColors

class ThemeSettingsResponse(BaseModel):
    key: str = "theme_config"
    config: ThemeSettingsSchema
    updated_at: Optional[str] = None
