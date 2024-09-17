from enum import Enum


class TaskStatus(int, Enum):
    BLOCKED = 4
    NEW = 0
    IN_PROCESS = 1
    FINISHED = 2
    CLOSED = 3


class ProjectStatus(int, Enum):
    NEW = 0
    IN_PROCESS = 1
    FINISHED = 2
    CLOSED = 3
