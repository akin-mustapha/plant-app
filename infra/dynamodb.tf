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
    type = "N"
  }
}

resource "aws_dynamodb_table_item" "watering" {
  table_name = aws_dynamodb_table.activity_type.name
  hash_key   = aws_dynamodb_table.activity_type.hash_key

  item = jsonencode({
    activity_type_id = { N = "1" }
    description       = { S = "Watering" }
    created           = { S = "2026-08-17" }
    active            = { BOOL = true }
  })
}

resource "aws_dynamodb_table_item" "fertilizing" {
  table_name = aws_dynamodb_table.activity_type.name
  hash_key   = aws_dynamodb_table.activity_type.hash_key

  item = jsonencode({
    activity_type_id = { N = "2" }
    description       = { S = "Fertilizing" }
    created           = { S = "2026-08-22" }
    active            = { BOOL = true }
  })
}
