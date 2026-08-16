import json
import logging
import uuid

from models import Plant
from routes import route
from service import PlantService
from responses import json_response

logger = logging.getLogger()


# ========================
# API
# ========================

@route("POST", "/plants")
def create_plant(event):
    body = json.loads(event["body"])

    logger.info(f'Create plant - {body.get("common_name")}')
    plant = Plant(
        plant_id=str(uuid.uuid4()),
        active=True,
        **body
    )

    created_plant = PlantService().add_plant(plant)

    logger.info(f"Plant created - {plant.plant_id}")
    return json_response(201, created_plant)

@route("GET", "/plants")
def get_all_plants(event):
    logger.info("Getting all plants")
    plants = PlantService().get_all()

    logger.info(f"Fetched {len(plants)} plant(s)")
    return json_response(200, plants)

@route("GET", "/plants/{id}")
def get_plant_by_id(event):
    plant_id = event['pathParameters']['id']

    logger.info(f"Getting plant by id {plant_id}")
    plant = PlantService().get_plant_by_id(plant_id)

    if plant is None:
        return json_response(404, {"message": "Plant not found"})

    return json_response(200, plant)

@route("PUT", "/plants/{id}")
def update_plant_by_id(event):
    body = json.loads(event["body"])
    plant_id = event["pathParameters"]["id"]

    logger.info(f"Updating plant by id {plant_id}")

    plant = Plant(plant_id=plant_id, active=True, **{
        k: v for k, v in body.items() if k not in ("plant_id", "active")
    })

    update_result = PlantService().update_plant_by_id(plant_id, plant)
    logger.info("Updated a plant")
    return json_response(201, update_result)

@route("DELETE", "/plants/{id}")
def delete_plant_by_id(event):
    plant_id = event['pathParameters']['id']

    logger.info(f"Deleting plant by id {plant_id}")

    delete_result = PlantService().delete_plant_by_id(plant_id)

    logger.info("Deleted a plant")

    return json_response(200, delete_result)

@route("POST", "/plants/{id}/image/upload-url")
def request_plant_image_upload_url(event):
    body = json.loads(event["body"])

    logger.info(f"Uploading image for plant {body['plant_id']}")

    plant_service = PlantService()

    plant_id = body.get("plant_id", None)
    file_name = body.get("file_name", None)
    content_type = body.get("content_type") or "image/jpeg"

    upload_url = plant_service.generate_plant_image_upload_url(plant_id, file_name, content_type)

    return json_response(200, upload_url, extra_headers={"Content-Type": "application/json"})

@route("POST", "/plants/{id}/image/confirm")
def confirm_plant_image_upload(event):

    body = json.loads(event["body"])

    plant_service = PlantService()

    confirmation = plant_service.confirm_plant_image_upload(body)

    return json_response(200, confirmation, extra_headers={"Content-Type": "application/json"})
