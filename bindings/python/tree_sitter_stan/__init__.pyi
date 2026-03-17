from typing import Final
from typing_extensions import CapsuleType

HIGHLIGHTS_QUERY: Final[str] | None
"""The syntax highlighting query for this grammar."""

INJECTIONS_QUERY: Final[str] | None
"""The language injection query for this grammar."""

LOCALS_QUERY: Final[str] | None
"""The local variable query for this grammar."""

TAGS_QUERY: Final[str] | None
"""The symbol tagging query for this grammar."""

def language_stan() -> CapsuleType:
    """The tree-sitter language function for Stan."""

def language_stanfunctions() -> CapsuleType:
    """The tree-sitter language function for Stan Functions."""
