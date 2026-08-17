resource "aws_dynamodb_table" "plants" {
  name         = "plants"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "plant_id"

  attribute {
    name = "plant_id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "activity" {
  name         = "activity"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "activity_id"

  attribute {
    name = "activity_id"
    type = "S"
  }

  attribute {
    name = "plant_id"
    type = "S"
  }

  attribute {
    name = "activity_date"
    type = "S"
  }

  global_secondary_index {
    name            = "plant_id-activity_date-index"
    hash_key        = "plant_id"
    range_key       = "activity_date"
    projection_type = "ALL"
  }
}

resource "aws_dynamodb_table" "activity_type" {
  name         = "activity_type"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "activity_type_id"

  attribute {
    name = "activity_type_id"
    type = "S"
  }
}
