const config={
    "aws_project_region": "ap-south-1",
    "aws_cognito_identity_pool_id": "ap-south-1:7184fe7e-4f99-4a7f-832e-4ef9cbe8b73b",
    "aws_cognito_region": "ap-south-1",
    "aws_user_pools_id": "ap-south-1_3sNwf5juJ",
    "aws_user_pools_web_client_id": "74d8k4ef9qoi4jjq5blkednll5",
    "oauth": {},
    "aws_cognito_username_attributes": [
      "EMAIL"
    ],
    "aws_cognito_social_providers": [],
    "aws_cognito_signup_attributes": [
      "EMAIL"
    ],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": [
      "SMS"
    ],
    "aws_cognito_password_protection_settings": {
      "passwordPolicyMinLength": 8,
      "passwordPolicyCharacters": [
        "REQUIRES_LOWERCASE",
        "REQUIRES_NUMBERS",
        "REQUIRES_SYMBOLS",
        "REQUIRES_UPPERCASE"
      ]
    },
    "aws_cognito_verification_mechanisms": [
      "EMAIL"
    ]
  }
  export default config