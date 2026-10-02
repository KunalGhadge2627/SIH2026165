from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = " SIF Sentinel"
    api_prefix: str = "/api"
    database_url: str = "sqlite:///./oil_safety.db"
    cors_origins: str = "*"
    llm_provider: str = "none"
    llm_api_key: str = ""
    llm_model: str = ""
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_list(self):
        if not self.cors_origins or self.cors_origins == "*":
            return ["*"]
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

settings = Settings()
