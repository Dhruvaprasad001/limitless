from __future__ import annotations

from openai import AsyncOpenAI

from app.config import settings
from app.llm.base import LLMProviderBase


class OpenAIProvider(LLMProviderBase):
    def __init__(self, client: AsyncOpenAI | None = None, model: str | None = None) -> None:
        self._client = client or AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self._model = model or settings.OPENAI_MODEL

    async def complete(self, messages: list[dict[str, str]]) -> str:
        response = await self._client.chat.completions.create(
            model=self._model,
            messages=messages,
            temperature=0.1,  # low temp for factual grounded answers
        )
        return response.choices[0].message.content or ""
