## Status

[![CI/CD Workflow](https://github.com/leosch1/youtube-path/actions/workflows/deploy.yaml/badge.svg)](https://github.com/leosch1/youtube-path/actions/workflows/deploy.yaml)

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

<!-- ## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details. -->

## Deployment


### Prerequisites

* AWS Account
* Hosted zone in Route53
* User with following policies attached

Create a user in the AWS account where the app should be deployed with the following policies. (Please adapt account ID, hosted zone ID, domain, domain certificate etc. in CloudFormation and policy templates accordingly.)

CloudFormation (needed for `/infrastructure/frontend.yaml` and `/infrastructure/file-upload.yaml`):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "cloudformation:CreateStack",
                "cloudformation:DescribeStackEvents",
                "cloudformation:DescribeStacks",
                "cloudformation:UpdateStack",
                "cloudformation:DeleteStack",
                "cloudformation:ListStackResources",
                "cloudformation:CreateChangeSet",
                "cloudformation:DescribeChangeSet",
                "cloudformation:ExecuteChangeSet",
                "cloudformation:GetTemplateSummary"
            ],
            "Resource": [
                "arn:aws:cloudformation:eu-central-1:611312332993:stack/YoutubePathFrontend/*",
                "arn:aws:cloudformation:eu-central-1:611312332993:stack/YoutubePathFileUpload/*"
            ]
        }
    ]
}
```

S3 (needed for `/infrastructure/frontend.yaml`):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:CreateBucket",
                "s3:DeleteBucket",
                "s3:PutBucketWebsite",
                "s3:PutBucketPolicy",
                "s3:PutBucketCors",
                "s3:GetBucketWebsite",
                "s3:PutBucketPublicAccessBlock",
                "s3:GetBucketPolicy"
            ],
            "Resource": "arn:aws:s3:::youtube-path-*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::youtube-path-*/*"
        }
    ]
}
```

CloudFront (needed for `/infrastructure/frontend.yaml`):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "cloudfront:CreateDistribution",
                "cloudfront:GetDistribution",
                "cloudfront:UpdateDistribution",
                "cloudfront:DeleteDistribution",
                "cloudfront:ListDistributions",
                "cloudfront:CreateInvalidation",
                "cloudfront:TagResource"
            ],
            "Resource": "*"
        }
    ]
}
```

Route53 (needed for `/infrastructure/frontend.yaml`):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Route53Permissions",
            "Effect": "Allow",
            "Action": [
                "route53:GetHostedZone",
                "route53:ChangeResourceRecordSets",
                "route53:ListResourceRecordSets",
                "route53:GetChange"
            ],
            "Resource": [
                "arn:aws:route53:::hostedzone/Z0720910164XX8B5317OC",
                "arn:aws:route53:::change/*"
            ]
        }
    ]
}
```

IAM (needed for `/infrastructure/file-upload.yaml`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:AttachRolePolicy",
        "iam:DetachRolePolicy",
        "iam:DeleteRolePolicy",
        "iam:GetRolePolicy",
        "iam:PutRolePolicy",
        "iam:GetRole",
        "iam:PassRole"
      ],
      "Resource": "arn:aws:iam::611312332993:role/YouTubePathFileUploadLambdaExecutionRole"
    }
  ]
}
```

Lambda (needed for `/infrastructure/file-upload.yaml`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:CreateFunction",
        "lambda:GetFunction",
        "lambda:DeleteFunction",
        "lambda:InvokeFunction",
        "lambda:AddPermission",
        "lambda:RemovePermission",
        "lambda:UpdateFunctionCode"
      ],
      "Resource": "arn:aws:lambda:eu-central-1:611312332993:function:PreSignedUrlFunction"
    }
  ]
}
```

API Gateway (needed for `/infrastructure/file-upload.yaml`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "apigateway:POST",
        "apigateway:GET",
        "apigateway:PUT",
        "apigateway:DELETE",
        "apigateway:PATCH"
      ],
      "Resource": "arn:aws:apigateway:eu-central-1::/*"
    }
  ]
}
```

After creating the user with the needed policies, define the necessary secrets in GitHub Actions (used in `.github/workflows/deploy.yaml`):

* `AWS_ACCESS_KEY_ID`
* `AWS_SECRET_ACCESS_KEY`
* `AWS_REGION`

After doing that the Deployment pipeline should be ran automatically by GitHub Actions on every commit to the main branch.
