from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "OIL Safety Intelligence"
    api_prefix: str = "/api"
    database_url: str = "sqlite:///./oil_safety.db"
    cors_origins: str = "*"
    llm_provider: str = "none"
    llm_api_key: str = ""
    llm_model: str = ""
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_list(self):
        return ["*"]

settings = Settings()

