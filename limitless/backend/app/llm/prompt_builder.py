from __future__ import annotations

from app.prompts.answer import SYSTEM_TEMPLATE
from app.schemas.query import RetrievedMessage


def _format_message_block(msg: RetrievedMessage, index: int) -> str:
    time_str = msg.created_at.strftime("%Y-%m-%d %H:%M UTC")
    return (
        f"[{index}] User: {msg.user_name} | Time: {time_str}\n"
        f"{msg.content}"
    )


class PromptBuilder:
    def build(self, question: str, messages: list[RetrievedMessage]) -> list[dict[str, str]]:
        message_blocks = "\n\n".join(
            _format_message_block(m, i + 1) for i, m in enumerate(messages)
        )
        system_content = SYSTEM_TEMPLATE.format(message_blocks=message_blocks)
        return [
            {"role": "system", "content": system_content},
            {"role": "user", "content": question},
        ]
