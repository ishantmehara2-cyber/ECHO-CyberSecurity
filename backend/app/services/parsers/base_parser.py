from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseParser(ABC):
    @abstractmethod
    def can_parse(self, content: str, filename: str) -> bool:
        pass

    @abstractmethod
    def parse(self, content: str, filename: str) -> List[Dict[str, Any]]:
        pass
