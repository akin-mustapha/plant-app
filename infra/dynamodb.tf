resource "aws_dynamodb_table" "plants" {
  name         = "plants"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "plant_id"

  attribute {
    name = "plant_id"
    type = "S"
  }
}
