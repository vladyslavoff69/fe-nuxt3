import { userFields } from './fragments'

export const SAVE_USER_PREFERENCES_MUTATION = gql`
  mutation saveUserPreferences(
    $activeCryptoCode: String
    $activeFiatCode: String
    $ghostMode: Boolean
    $orderedCryptoCodes: [String]
    $showStats: Boolean
    $rainEnabled: Boolean
    $tipsEnable: Boolean
    $displayInfiatEnabled: Boolean
    $showVaultBalance: Boolean
    $hideZeroBalance: Boolean
    $homePageSettings: JSON
    $languageCode: String,
    $hideAllProfileInformation: Boolean,
    $hideMyUsername: Boolean
    $hideMyBio: Boolean
    $hideMysocialLinks: Boolean
    $hideOnlineStatus: Boolean
    $hideMyGamingActivity: Boolean
    $hideMyBattleRewards: Boolean
    $hideBets: Boolean
    $hideWageredAmounts: Boolean
    $hideFollowers: Boolean
    $hideFollowedUsers: Boolean
    $receive_newsletter: Boolean
  ) {
    saveUserPreferences(
      preferences: {
        activeCryptoCode: $activeCryptoCode
        activeFiatCode: $activeFiatCode
        ghostMode: $ghostMode
        orderedCryptoCodes: $orderedCryptoCodes
        showStats: $showStats
        rainEnabled: $rainEnabled
        tipsEnable: $tipsEnable
        displayInfiatEnabled: $displayInfiatEnabled
        showVaultBalance: $showVaultBalance
        hideZeroBalance: $hideZeroBalance
        homePageSettings: $homePageSettings
        languageCode: $languageCode
        hideAllProfileInformation: $hideAllProfileInformation
        hideMyUsername: $hideMyUsername
        hideMyBio: $hideMyBio
        hideMysocialLinks: $hideMysocialLinks
        hideOnlineStatus: $hideOnlineStatus
        hideMyGamingActivity: $hideMyGamingActivity
        hideMyBattleRewards: $hideMyBattleRewards
        hideBets: $hideBets
        hideWageredAmounts: $hideWageredAmounts
        hideFollowers: $hideFollowers
        hideFollowedUsers: $hideFollowedUsers
        receive_newsletter: $receive_newsletter
      }
    ) {
      id
      preferences
    }
  }
`

export const REGISTER_NEWSLETTER = gql`
  mutation RegisterNewsletter($input: NewsletterMailInput) {
    registerNewsletter(input: $input){
      email
      ip
      location
    }
  }
`

export const UPDATE_USER_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateUserInput!) {
    updateProfile(input: $input){
      ...userFields
    }
  }
  ${userFields}
`

export const GET_KYC_USER_QUERY = gql`
  query getKycUser {
    getKycUser {
      address
      bank_statement
      date_of_birth
      driver_license
      email
      kyc_level
      lastname
      name
      national_id
      passport
      phone
      proof_address
      utility_bill
    }
  }
`

export const APPLY_KYC_LEVEL_ONE = gql`
  mutation ApplyKycLevelOne($input: KycLevelOneInput!) {
    applyKycLevelOne(input: $input){
      title
      description
      kyc_level
    }
  }
`
