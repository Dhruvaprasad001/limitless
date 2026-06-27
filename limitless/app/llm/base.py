from __future__ import annotations

from abc import ABC, abstractmethod


class LLMProviderBase(ABC):
    @abstractmethod
    async def complete(self, messages: list[dict[str, str]]) -> str:
        """Send a list of {role, content} messages and return the assistant reply."""
        ...
