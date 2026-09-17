import json
from fastapi import APIRouter
from app.routes.deps import SessionDep, CurrentUserDep
from app.models.setting import SiteSetting
from app.schemas.setting import ThemeSettingsSchema, ThemeSettingsResponse

router = APIRouter(prefix="/settings", tags=["Settings"])

THEME_SETTING_KEY = "theme_config"

DEFAULT_THEME_CONFIG = {
    "dark": {
        "primary": "#f59e0b",
        "primaryGradientEnd": "#ea580c",
        "accentSecondary": "#38bdf8",
        "bgPrimary": "#0b0f19",
        "bgCard": "#111827",
        "textPrimary": "#f9fafb",
    },
    "light": {
        "primary": "#f59e0b",
        "primaryGradientEnd": "#ea580c",
        "accentSecondary": "#0284c7",
        "bgPrimary": "#f8fafc",
        "bgCard": "#ffffff",
        "textPrimary": "#0f172a",
    },
}

@router.get("/theme", response_model=ThemeSettingsResponse)
def get_theme_settings(db: SessionDep):
    setting = db.query(SiteSetting).filter(SiteSetting.key == THEME_SETTING_KEY).first()
    if setting:
        try:
            parsed = json.loads(setting.value)
            return ThemeSettingsResponse(
                key=THEME_SETTING_KEY,
                config=ThemeSettingsSchema(**parsed),
                updated_at=setting.updated_at.isoformat() if setting.updated_at else None,
            )
        except Exception:
            pass

    return ThemeSettingsResponse(
        key=THEME_SETTING_KEY,
        config=ThemeSettingsSchema(**DEFAULT_THEME_CONFIG),
        updated_at=None,
    )

@router.put("/theme", response_model=ThemeSettingsResponse)
def update_theme_settings(
    db: SessionDep,
    current_user: CurrentUserDep,
    new_theme: ThemeSettingsSchema,
):
    setting = db.query(SiteSetting).filter(SiteSetting.key == THEME_SETTING_KEY).first()
    json_val = json.dumps(new_theme.model_dump())
    if setting:
        setting.value = json_val
    else:
        setting = SiteSetting(key=THEME_SETTING_KEY, value=json_val)
        db.add(setting)

    db.commit()
    db.refresh(setting)

    return ThemeSettingsResponse(
        key=THEME_SETTING_KEY,
        config=new_theme,
        updated_at=setting.updated_at.isoformat() if setting.updated_at else None,
    )

@router.post("/theme/reset", response_model=ThemeSettingsResponse)
def reset_theme_settings(
    db: SessionDep,
    current_user: CurrentUserDep,
):
    default_schema = ThemeSettingsSchema(**DEFAULT_THEME_CONFIG)
    json_val = json.dumps(default_schema.model_dump())
    setting = db.query(SiteSetting).filter(SiteSetting.key == THEME_SETTING_KEY).first()
    if setting:
        setting.value = json_val
    else:
        setting = SiteSetting(key=THEME_SETTING_KEY, value=json_val)
        db.add(setting)

    db.commit()
    db.refresh(setting)

    return ThemeSettingsResponse(
        key=THEME_SETTING_KEY,
        config=default_schema,
        updated_at=setting.updated_at.isoformat() if setting.updated_at else None,
    )
