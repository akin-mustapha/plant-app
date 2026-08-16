import json

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "https://main.d2dl67h6vhyf6v.amplifyapp.com",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
}


def json_response(status_code, body, extra_headers=None):
    return {
        "statusCode": status_code,
        "headers": {**CORS_HEADERS, **(extra_headers or {})},
        "body": json.dumps(body),
    }
