resource "aws_s3_bucket" "plant_images" {
  bucket = "plant-app-images-${var.aws_region}"
}

resource "aws_s3_bucket_cors_configuration" "plant_images" {
  bucket = aws_s3_bucket.plant_images.id

  cors_rule {
    allowed_origins = ["https://main.d2dl67h6vhyf6v.amplifyapp.com", "http://127.0.0.1:3000"]
    allowed_methods = ["PUT"]
    allowed_headers = ["*"]
  }
}

resource "aws_s3_bucket_public_access_block" "plant_images" {
  bucket = aws_s3_bucket.plant_images.id

  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = false
  restrict_public_buckets = false
}

# Uploaded plant photos are read via a public https://<bucket>.s3.amazonaws.com/<key>
# URL directly in <img> tags, so the uploads/ prefix needs anonymous read. Everything
# else in the bucket stays private.
resource "aws_s3_bucket_policy" "public_read_uploads" {
  bucket = aws_s3_bucket.plant_images.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadUploads"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.plant_images.arn}/uploads/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.plant_images]
}
