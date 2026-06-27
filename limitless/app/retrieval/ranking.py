from __future__ import annotations

from abc import ABC, abstractmethod
from collections import defaultdict
from dataclasses import dataclass
from uuid import UUID


@dataclass
class ScoredResult:
    message_id: UUID
    score: float


class RankingStrategyBase(ABC):
    @abstractmethod
    def rank(self, ranked_lists: list[list[UUID]]) -> list[ScoredResult]:
        """Merge multiple ranked lists into a single scored list."""
        ...


class ReciprocalRankFusion(RankingStrategyBase):
    def __init__(self, k: int = 60) -> None:
        self._k = k

    def rank(self, ranked_lists: list[list[UUID]]) -> list[ScoredResult]:
        scores: dict[UUID, float] = defaultdict(float)
        for ranking in ranked_lists:
            for rank, msg_id in enumerate(ranking):
                scores[msg_id] += 1.0 / (self._k + rank + 1)
        return [
            ScoredResult(message_id=msg_id, score=score)
            for msg_id, score in sorted(scores.items(), key=lambda x: x[1], reverse=True)
        ]
