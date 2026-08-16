from dataclasses import dataclass


@dataclass
class Plant:
    plant_id: str
    common_name: str
    nick_name: str
    scientific_name: str
    notes: str
    date_acquired: str
    location: str
    status: str
    routine: dict
    preference: dict
    active: bool
