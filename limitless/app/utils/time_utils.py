from __future__ import annotations

from datetime import datetime, timedelta, timezone


def resolve_time_range(time_range: str | None) -> tuple[datetime, datetime] | None:
    """Convert a time_range string into an inclusive (start, end) UTC datetime pair."""
    if not time_range:
        return None
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

    if time_range == "today":
        return (today_start, now)
    elif time_range == "yesterday":
        yesterday_start = today_start - timedelta(days=1)
        return (yesterday_start, today_start)
    elif time_range == "this_week":
        week_start = today_start - timedelta(days=today_start.weekday())
        return (week_start, now)
    elif time_range == "last_week":
        this_week_start = today_start - timedelta(days=today_start.weekday())
        last_week_start = this_week_start - timedelta(weeks=1)
        return (last_week_start, this_week_start)
    elif time_range == "this_month":
        month_start = today_start.replace(day=1)
        return (month_start, now)
    return None
