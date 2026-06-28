from __future__ import annotations

from app.schemas.query import RetrievedMessage

_SYSTEM_TEMPLATE = """\
You are a team updates assistant. You answer questions strictly based on the provided team messages.

Rules:
- Answer ONLY using the messages provided below. Do not use any prior knowledge.
- If the provided messages do not contain enough information to answer, say: "I don't have enough information in the retrieved messages to answer this question."
- If messages contain conflicting information about the same subject, explain the conflict clearly and prefer the most recent evidence — but do not ignore earlier events.
- Always cite the Message IDs you rely on in your answer (e.g. "Based on Message ID abc123...").
- Keep answers concise and factual.

---

{message_blocks}\
"""


def _format_message_block(msg: RetrievedMessage) -> str:
    time_str = msg.created_at.strftime("%Y-%m-%d %H:%M UTC")
    return (
        f"[Message ID: {msg.id}]\n"
        f"User: {msg.user_name}\n"
        f"Time: {time_str}\n"
        f"Content:\n{msg.content}"
    )


class PromptBuilder:
    def build(self, question: str, messages: list[RetrievedMessage]) -> list[dict[str, str]]:
        message_blocks = "\n\n".join(_format_message_block(m) for m in messages)
        system_content = _SYSTEM_TEMPLATE.format(message_blocks=message_blocks)
        return [
            {"role": "system", "content": system_content},
            {"role": "user", "content": question},
        ]
