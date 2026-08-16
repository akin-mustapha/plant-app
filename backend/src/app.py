import json
import uuid
import logging
from dataclasses import dataclass, asdict

import boto3
from boto3.dynamodb.conditions import Attr
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# HTTP STATUS CODE

# Command Pattern
# CREATE - POST
# READ - GET
# UPDATE - PUT
# DELETE _ DELETE

# Dispatch Table

ROUTES = {
    # ("GET", "/plants/{id}"): get_plant_by_id,
    # ("POST", "/plants/{id}"): create_plant_by_id,
    # ("PUT", "/plants/{id}"): update_plant_by_id,
    # ("DELETE", "/plants/{id}"): delete_plant_by_id,
}


# ========================
# Data Object
# ========================

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


# ========================
# Helpers
# ========================

# Decorator - Register handlers into Dispatch Table (Route)
def route(method: str, path: str):
    def decorator (func):
        logger.info(f"Registering {method} {path}")
        ROUTES [(method, path)] = func
        logger.info(f"Registered {len(ROUTES)} routes")
        return func
    return decorator


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
    return {
        "statusCode": 201,
        "headers": {
            "Access-Control-Allow-Origin": "https://main.d2dl67h6vhyf6v.amplifyapp.com",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
        },
        "body": json.dumps(created_plant)
    }

@route("GET", "/plants")
def get_all_plants(event):
    logger.info("Getting all plants")
    plants = PlantService().get_all()

    logger.info(f"Fetched {len(plants)} plant(s)")
    return {
    "statusCode": 200,
    "headers": {
        "Access-Control-Allow-Origin": "https://main.d2dl67h6vhyf6v.amplifyapp.com",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
    },
    "body": json.dumps(plants)
    }

@route("GET", "/plants/{id}")
def get_plant_by_id(event):
    plant_id = event['pathParameters']['id']

    logger.info(f"Getting plant by id {plant_id}")
    plant = PlantService().get_plant_by_id(plant_id)

    if plant is None:
        return {
            "statusCode": 404,
            "headers": {
                "Access-Control-Allow-Origin": "https://main.d2dl67h6vhyf6v.amplifyapp.com",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
            },
            "body": json.dumps({"message": "Plant not found"})
        }

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "https://main.d2dl67h6vhyf6v.amplifyapp.com",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
        },
        "body": json.dumps(plant)
        }

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
    return {
        "statusCode": 201,
        "headers": {
            "Access-Control-Allow-Origin": "https://main.d2dl67h6vhyf6v.amplifyapp.com",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
        },
        "body": json.dumps(update_result)
    }

@route("DELETE", "/plants/{id}")
def delete_plant_by_id(event):
    plant_id = event['pathParameters']['id']

    logger.info(f"Deleting plant by id {plant_id}")

    delete_result = PlantService().delete_plant_by_id(plant_id)

    logger.info("Deleted a plant")

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "https://main.d2dl67h6vhyf6v.amplifyapp.com",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
        },
        "body": json.dumps(delete_result)
    }

@route("POST", "/plants/{id}/image/upload-url")
def request_plant_image_upload_url(event):
    body = json.loads(event["body"])

    logger.info(f"Uploading image for plant {body['plant_id']}")

    plant_service = PlantService()

    plant_id = body.get("plant_id", None)
    file_name = body.get("file_name", None)
    content_type = body.get("content_type") or "image/jpeg"

    upload_url = plant_service.generate_plant_image_upload_url(plant_id, file_name, content_type)

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://main.d2dl67h6vhyf6v.amplifyapp.com",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
        },
        "body": json.dumps(upload_url)
    }

@route("POST", "/plants/{id}/image/confirm")
def confirm_plant_image_upload(event):

    body = json.loads(event["body"])

    plant_service = PlantService()

    confirmation = plant_service.confirm_plant_image_upload(body)

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://main.d2dl67h6vhyf6v.amplifyapp.com",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
        },
        "body": json.dumps(confirmation)
    }


# ========================
# Service
# ========================

class PlantService:
    def __init__(self):

        logger.info("Initialising Plant Service")
        self.plant_repo = PlantRepository()


        self.plant_bucket="plant-app-images-eu-west-1"
        self.s3_client = boto3.client(
            's3',
            region_name='eu-west-1',
            endpoint_url='https://s3.eu-west-1.amazonaws.com'
        )

    def add_plant(self, plant: Plant):
        self.plant_repo.insert_plant(plant)
        return {"message": "Plant added successfully"}

    def get_all(self):
        plants = self.plant_repo.select_all()
        return plants

    def get_plant_by_id(self, plant_id: str):
        plant = self.plant_repo.select_by_id(plant_id)
        return plant

    def update_plant_by_id(self, plant_id: str, plant: Plant):
        update_result = self.plant_repo.update_plant_by_id(plant_id, plant)
        return update_result

    def delete_plant_by_id(self, plant_id: str):
        delete_result = self.plant_repo.delete_by_id(plant_id)

        return delete_result
    
    def generate_plant_image_upload_url(self, plant_id: str, file_name: str, content_type: str = "image/jpeg"):
        key = f"uploads/{uuid.uuid4()}-{file_name}"

        presigned_url = self.s3_client.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": self.plant_bucket,
                "Key": key,
                "ContentType": content_type
            },
            ExpiresIn=300  # 5 minutes
        )

        return {"uploadUrl": presigned_url, "key": key}

    def confirm_plant_image_upload(self, body: dict):
        plant_id = body.get("plant_id", None)
        key = body.get("key", None)

        try:
            image_url = f"https://{self.plant_bucket}.s3.amazonaws.com/{key}"

            self.plant_repo.update_plant_image_url(plant_id, image_url)

        except ClientError as e:
            logger.error(e)
            return {"message": "Image upload confirmation failed"}

        return {"message": "Image uploaded", "image_url": image_url}


# ========================
# Repository
# ========================

class PlantRepository:
    def __init__(self):
        logger.info("Initialising DynamoDB resource")
        try:
            self.db = boto3.resource("dynamodb", region_name='eu-west-1')
        except ClientError as e:
            logger.error(e)

    def insert_plant(self, plant: Plant):
        logger.info(f"Inserting {plant.common_name} into DB")
        try:
            table = self.db.Table("plants")
            table.put_item(Item=asdict(plant))
        except ClientError as e:
            logger.error(e)
            raise

    def select_all(self):
        logger.info("Selecting all plants")
        try:
            table = self.db.Table("plants")
            response = table.scan(
                FilterExpression=Attr("active").ne(False)
            )
            items = response["Items"]
            logger.info(f"Selected {len(items)}")

            return [
                {k: (list(v) if isinstance(v, set) else v) for k, v in item.items()}
                for item in items
            ]
        except ClientError as e:
            logger.error(e)

    def select_by_id(self, plant_id: str):
        logger.info(f"Selecting plant by id: {plant_id}")
        try:
            table = self.db.Table("plants")
            response = table.get_item(Key={"plant_id": plant_id})

            item = response.get("Item")
            if item is None or item.get("active") is False:
                logger.info(f"No active plant found for id: {plant_id}")
                return None

            logger.info(f"Selected {len(item)}")

            return {k: (list(v) if isinstance(v, set) else v) for k, v in item.items()}
        except ClientError as e:
            logger.error(e)
            return None

    def delete_by_id(self, plant_id: str):
        logger.info(f"Deleting plant by id: {plant_id}")
        # hard delete
        try:
            table = self.db.Table("plants")
            response = table.update_item(
                Key={"plant_id": plant_id},
                UpdateExpression="set active = :a",
                ExpressionAttributeValues={
                    ':a': False
                }
            )
        except ClientError as e:
            logger.error(e)

        logger.info(f"Deleted {plant_id}")

        return {"message": "Plant deleted successfully"}

    def update_plant_by_id(self, plant_id: str, plant: Plant):
        logger.info(f"Updating plant by id: {plant_id}")
        try:
            table = self.db.Table("plants")
            table.update_item(
                Key={
                    "plant_id": plant_id
                },
                UpdateExpression="""
                    set #cn=:cn,
                    #nn=:nn,
                    #sn=:sn,
                    #n=:n,
                    #da=:da,
                    #loc=:l,
                    #st=:s,
                    #r=:r,
                    #p=:p,
                    #a=:a
                """,
                ExpressionAttributeNames={
                    "#cn": "common_name",
                    "#nn": "nick_name",
                    "#sn": "scientific_name",
                    "#n": "notes",
                    "#da": "date_acquired",
                    "#loc": "location",
                    "#st": "status",
                    "#r": "routine",
                    "#p": "preference",
                    "#a": "active"
                },
                ExpressionAttributeValues={
                    ":cn": plant.common_name,
                    ":nn": plant.nick_name,
                    ":sn": plant.scientific_name,
                    ":n": plant.notes,
                    ":da": plant.date_acquired,
                    ":l": plant.location,
                    ":s": plant.status,
                    ":r": plant.routine,
                    ":p": plant.preference,
                    ":a": plant.active
                },
                ConditionExpression=Attr("active").eq(True)
            )
        except ClientError as e:
            logger.error(e)
            return {"message": "Plant update failed"}

        logger.info(f"Updated {plant_id}")

        return {"message": "Plant updated successfully"}

    def update_plant_image_url(self, plant_id: str, image_url: str):
        logger.info(f"Updating image url for plant: {plant_id}")
        try:
            table = self.db.Table("plants")
            table.update_item(
                Key={
                    "plant_id": plant_id
                },
                UpdateExpression="set image_url=:i",
                ExpressionAttributeValues={
                    ":i": image_url
                },
                ConditionExpression=Attr("active").eq(True)
            )
        except ClientError as e:
            logger.error(e)
            return {"message": "Plant image url update failed"}

        logger.info(f"Updated image url for {plant_id}")

        return {"message": "Plant image url updated successfully"}


# ========================
# Entry Point
# ========================

def lambda_handler(event, context):
    route_key = (
        event["requestContext"]["http"]["method"],
        event["routeKey"].split(" ", 1)[1]
    )

    handler = ROUTES.get(route_key)

    if handler is None:
        return {
            'statusCode': 404,
            'body': json.dumps('Route not found')
        }

    try:
        return handler(event)
    except Exception as e:
        logger.error(e)
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "https://main.d2dl67h6vhyf6v.amplifyapp.com",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
            },
            "body": json.dumps({"message": "Internal server error"})
        }