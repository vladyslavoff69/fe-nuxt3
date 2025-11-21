import { userFields, addressFields, sponsorCodeFields } from './fragments'

export const CREATE_USER_MUTATION = gql`
  mutation createUser(
    $email: String!
    $username: String!
    $password: String!
    $fingerprint: String
    $sponsorCode: String
    $isVisitor: Boolean
    $promotional_code: String
  ) {
    createUser(
      input: {
        email: $email
        username: $username
        password: $password
        fingerprint: $fingerprint
        sponsorCode: $sponsorCode
        isVisitor: $isVisitor
        promotional_code: $promotional_code
      }
    ) {
      token
      user {
        ...userFields
      }
    }
  }
  ${userFields}
`

export const CREATE_USER_FINGERPRINT_MUTATION = gql`
  mutation createUserFingerprint(
    $fingerprint: String!
    $user_id: Int!
    $os: String
    $browser: String
    $ip: String
    $requestId: String
    $payload: JSON
  ) {
    createUserFingerprint(
      input: {
        fingerprint: $fingerprint
        user_id: $user_id
        os: $os
        browser: $browser
        ip: $ip
        requestId: $requestId
        payload: $payload
      }
    ) {
      id
      fingerprint
      os
      browser
      ip
      payload
      user {
        id
        username
      }
    }
  }
`

export const LOGIN_MUTATION = gql`
  mutation login(
    $email: String
    $password: String!
    $username: String
    $code: String
    $isLogin: Boolean
  ) {
    login(
      email: $email
      password: $password
      username: $username
      code: $code
      isLogin: $isLogin
    ) {
      token
      user {
        ...userFields
      }
    }
  }
  ${userFields}
`

export const SEND_EMAIL_TWO_FA_MUTATION = gql`
  mutation sendEmailTwoFa(
    $email: String
    $username: String
    $hash: String
  ) {
    sendEmailTwoFa(
      email: $email
      username: $username
      hash: $hash
    ) {
      title
      description
      createdAt
    }
  }
`

export const ME_QUERY = gql`
  query me {
    me {
      ...userFields
      roles {
        id
        name
      }
      address {
        ...addressFields
      }
      socialiteProviders {
        provider
        provider_user_id
        avatar
      }
      fingerprints {
        id
        fingerprint
        os
        browser
        ip
      }
      sponsorCodes {
        ...sponsorCodeFields
      }
    }
  }
  ${userFields}
  ${addressFields}
  ${sponsorCodeFields}
`

export const USER_UPDATED_SUBSCRIPTION = gql`
  subscription userUpdated {
    userUpdated {
      ...userFields
      address {
        ...addressFields
      }
      roles {
        id
        name
      }
      socialiteProviders {
        provider
        provider_user_id
        avatar
      }
      fingerprints {
        id
        fingerprint
      }
      sponsorCodes {
        ...sponsorCodeFields
      }
      is_banned {
        id
        bannable_id
        bannable_type
        comment
        created_at
        expired_at
      }
      __typename
    }
  }
  ${userFields}
  ${addressFields}
  ${sponsorCodeFields}
`

export const USER_MODAL_NOTIFY_SUBSCRIPTION = gql`
  subscription userModalNotification {
    userModalNotification {
      header
      body
      image
      action
      action_url
      __typename
    }
  }
`

export const MAKE_QR_MUTATION = gql`
  mutation makeQr {
    makeQr {
      secret
      urlQrCode
    }
  }
`

export const CONFIRM_QR_MUTATION = gql`
  mutation confirmQr($code: String!) {
    confirmQr(code: $code)
  }
`

export const DISABLE_TWOFA_MUTATION = gql`
  mutation disableTwoFa($code: String!, $password: String!) {
    disableTwoFa(code: $code, password: $password)
  }
`

export const GET_SOCIAL_URL_QUERY = gql`
  query getSocialContent($provider: SocialProvider!) {
    getSocialContent(provider: $provider) {
      url
    }
  }
`

export const SEND_RESET_LINK_MUTATION = gql`
  mutation sendResetLink($email: String!) {
    sendResetLink(email: $email)
  }
`

export const VERIFY_EMAIL_ADDRESS_MUTATION = gql`
  mutation verifyEmailAddress($hash: String!, $userId: Int!) {
    verifyEmailAddress(userId: $userId, hash: $hash)
  }
`

export const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail {
    verifyEmail
  }
`

export const RESET_PASSWORD_MUTATION = gql`
  mutation resetPassword(
    $email: String!
    $password: String!
    $password_confirmation: String!
    $token: String!
    $code: String
  ) {
    resetPassword(
      input: {
        email: $email
        password: $password
        password_confirmation: $password_confirmation
        token: $token
        code: $code
      }
    )
  }
`

export const PASSWORD_CHANGE_MUTATION = gql`
  mutation passwordChange(
    $password: String!
    $password_confirmation: String!
  ) {
    passwordChange(
      password: $password
      password_confirmation: $password_confirmation
    )
  }
`

export const LOGOUT_MUTATION = gql`
  mutation logout {
    logout
  }
`
