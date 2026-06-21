#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

: "${AWS_PROFILE:?Set AWS_PROFILE in .env or your shell environment}"

REGION="${AWS_REGION:-${AWS_DEFAULT_REGION:-$(aws configure get region --profile "$AWS_PROFILE" 2>/dev/null || true)}}"
if [[ -z "$REGION" ]]; then
  echo "Error: AWS region not set. Add AWS_REGION to .env or pass it as the second argument."
  exit 1
fi

STACK_NAME="${STACK_NAME:-novvys-website}"
BUCKET_NAME="${1:-${BUCKET_NAME:-}}"
REGION="${2:-$REGION}"

if [[ -z "$BUCKET_NAME" ]]; then
  ACCOUNT_ID="$(aws sts get-caller-identity --profile "$AWS_PROFILE" --query Account --output text)"
  BUCKET_NAME="novvys-site-${ACCOUNT_ID}"
fi

echo "==> Deploying CloudFormation stack: ${STACK_NAME} (${REGION})"
echo "    S3 bucket: ${BUCKET_NAME}"

aws cloudformation deploy \
  --template-file cloudformation.yaml \
  --stack-name "$STACK_NAME" \
  --parameter-overrides "BucketName=${BUCKET_NAME}" \
  --capabilities CAPABILITY_IAM \
  --region "$REGION" \
  --profile "$AWS_PROFILE"

CF_URL="$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --profile "$AWS_PROFILE" \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDomain'].OutputValue" \
  --output text)"
DISTRIBUTION_ID="$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --profile "$AWS_PROFILE" \
  --query "Stacks[0].Outputs[?OutputKey=='DistributionId'].OutputValue" \
  --output text)"
SITE_URL="${SITE_URL:-https://${CF_URL}}"
BASE_PATH="${BASE_PATH:-/}"

if [[ -f .nvmrc ]]; then
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [[ -s "$NVM_DIR/nvm.sh" ]]; then
    # shellcheck disable=SC1091
    source "$NVM_DIR/nvm.sh"
    nvm install >/dev/null
    nvm use >/dev/null
  fi
fi

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]" 2>/dev/null || echo 0)"
if [[ "$NODE_MAJOR" -lt 24 ]]; then
  echo "Error: Node.js >= 24 required (current: $(node -v 2>/dev/null || echo unknown))."
  echo "Run: nvm install && nvm use   (or: fnm use / mise install)"
  exit 1
fi

echo "==> Building Astro site"
echo "    SITE_URL=${SITE_URL}"
echo "    BASE_PATH=${BASE_PATH}"

npm ci
SITE_URL="$SITE_URL" BASE_PATH="$BASE_PATH" npm run build

cat > dist/robots.txt <<EOF
User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap-index.xml
EOF

echo "==> Uploading dist/ to s3://${BUCKET_NAME}"
aws s3 sync dist/ "s3://${BUCKET_NAME}/" \
  --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --exclude "index.html" \
  --exclude "*/index.html" \
  --exclude "sitemap*.xml" \
  --exclude "robots.txt" \
  --region "$REGION" \
  --profile "$AWS_PROFILE"

aws s3 sync dist/ "s3://${BUCKET_NAME}/" \
  --cache-control "public,max-age=0,must-revalidate" \
  --exclude "*" \
  --include "index.html" \
  --include "*/index.html" \
  --include "sitemap*.xml" \
  --include "robots.txt" \
  --region "$REGION" \
  --profile "$AWS_PROFILE"

echo "==> Invalidating CloudFront cache"
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" \
  --profile "$AWS_PROFILE" \
  --output text \
  --query 'Invalidation.Id'

echo ""
echo "Deployment complete!"
echo "  Stack:        ${STACK_NAME}"
echo "  Region:       ${REGION}"
echo "  Bucket:       ${BUCKET_NAME}"
echo "  Website URL:  ${SITE_URL}"
echo ""
echo "Next deploys: ./deploy.sh ${BUCKET_NAME} ${REGION}"
