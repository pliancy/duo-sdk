export type DuoIntegrationType =
    | 'accountsapi'
    | 'adminapi'
    | 'authapi'
    | 'okta'
    | 'sso-generic'
    | 'sso-oauth-client-credentials'
    | 'sso-oidc-generic'
    | 'websdk'
    | (string & {})

export type DuoIntegrationUserAccess = 'ALL_USERS' | 'NO_USERS' | 'PERMITTED_GROUPS'

export type DuoUsernameNormalizationPolicy = 'None' | 'Simple' | '' | (string & {})

export type DuoIntegrationFlag = 0 | 1

export interface DuoIntegrationsListParams {
    limit?: number
    offset?: number
}

export interface DuoIntegrationPermissionFlags {
    adminapi_admins: DuoIntegrationFlag
    adminapi_admins_read: DuoIntegrationFlag
    adminapi_allow_to_set_permissions: DuoIntegrationFlag
    adminapi_info: DuoIntegrationFlag
    adminapi_integrations: DuoIntegrationFlag
    adminapi_read_log: DuoIntegrationFlag
    adminapi_read_resource: DuoIntegrationFlag
    adminapi_settings: DuoIntegrationFlag
    adminapi_write_resource: DuoIntegrationFlag
}

export interface DuoIntegrationIdpMetadata {
    authorize_endpoint_url?: string
    cert?: string
    client_id?: string
    client_secret?: string
    discovery_url?: string
    entity_id?: string
    issuer?: string
    jwks_endpoint_url?: string
    metadata_url?: string
    slo_url?: string
    sso_url?: string
    token_endpoint_url?: string
    token_introspection_endpoint_url?: string
    userinfo_endpoint_url?: string
}

export interface DuoIntegrationClaimTransformation {
    [key: string]: unknown
}

export interface DuoIntegrationSamlAcsUrl {
    url: string
    binding?: string
    index?: number
    isDefault?: boolean
}

export interface DuoIntegrationSamlConfig {
    acs_urls: DuoIntegrationSamlAcsUrl[]
    assertion_encryption_algorithm?: string | null
    attribute_transformations?: DuoIntegrationClaimTransformation[]
    encrypt_assertion?: boolean
    entity_id: string
    key_transport_encryption_algorithm?: string | null
    mapped_attrs?: Record<string, string>
    nameid_attribute: string
    nameid_format: string
    relaystate?: string | null
    remote_cert?: string | null
    role_attrs?: Record<string, string[]>
    sign_assertion: boolean
    sign_response: boolean
    signing_algorithm: string
    slo_url?: string
    spinitiated_url?: string | null
    static_attrs?: Record<string, string> | null
}

export interface DuoIntegrationOAuthScope {
    id: string
    name: string
    description?: string
}

export interface DuoIntegrationOAuthClient {
    assigned_scopes_ids: string[]
    client_id: string
    client_secret?: string
    description?: string
    name: string
}

export interface DuoIntegrationOAuthConfig {
    clients: DuoIntegrationOAuthClient[]
    scopes: DuoIntegrationOAuthScope[]
}

export interface DuoIntegrationOidcGrantTypes {
    authorization_code: boolean
    refresh_token?: boolean
}

export interface DuoIntegrationOidcScopes {
    openid: boolean
    email?: boolean
    profile?: boolean
    [scope: string]: boolean | undefined
}

export interface DuoIntegrationOidcConfig {
    access_token_lifespan?: number
    allow_pkce_only?: boolean
    claim_transformations?: DuoIntegrationClaimTransformation[]
    grant_types: DuoIntegrationOidcGrantTypes
    redirect_uris: string[]
    refresh_token_chain_lifespan?: number
    refresh_token_single_lifespan?: number
    scopes: DuoIntegrationOidcScopes
}

export interface DuoIntegrationSsoConfig {
    idp_metadata?: DuoIntegrationIdpMetadata
    oauth_config?: DuoIntegrationOAuthConfig
    oidc_config?: DuoIntegrationOidcConfig
    saml_config?: DuoIntegrationSamlConfig
}

export interface DuoIntegration extends DuoIntegrationPermissionFlags {
    enroll_policy: string
    frameless_auth_prompt_enabled?: DuoIntegrationFlag
    greeting?: string
    groups_allowed: string[]
    integration_key: string
    ip_whitelist?: string[]
    ip_whitelist_enroll_policy?: string
    missing_web_referer_policy?: string
    name: string
    networks_for_api_access?: string
    notes?: string
    policy_key?: string
    prompt_v4_enabled?: DuoIntegrationFlag
    secret_key?: string
    self_service_allowed?: DuoIntegrationFlag
    sso?: DuoIntegrationSsoConfig
    trusted_device_days?: number
    type: DuoIntegrationType
    user_access: DuoIntegrationUserAccess
    username_normalization_policy?: DuoUsernameNormalizationPolicy
    visual_style?: string
    web_referers_enabled?: DuoIntegrationFlag
}

export interface DuoIntegrationUpsertPayload {
    adminapi_admins?: DuoIntegrationFlag
    adminapi_admins_read?: DuoIntegrationFlag
    adminapi_allow_to_set_permissions?: DuoIntegrationFlag
    adminapi_info?: DuoIntegrationFlag
    adminapi_integrations?: DuoIntegrationFlag
    adminapi_read_log?: DuoIntegrationFlag
    adminapi_read_resource?: DuoIntegrationFlag
    adminapi_settings?: DuoIntegrationFlag
    adminapi_write_resource?: DuoIntegrationFlag
    enroll_policy?: string
    greeting?: string
    groups_allowed?: string[]
    ip_whitelist?: string[]
    ip_whitelist_enroll_policy?: string
    name?: string
    networks_for_api_access?: string
    notes?: string
    policy_key?: string
    prompt_v4_enabled?: DuoIntegrationFlag
    self_service_allowed?: DuoIntegrationFlag
    sso?: DuoIntegrationSsoConfig
    trusted_device_days?: number
    user_access?: DuoIntegrationUserAccess
    username_normalization_policy?: DuoUsernameNormalizationPolicy
}

export interface CreateDuoIntegrationPayload extends DuoIntegrationUpsertPayload {
    name: string
    type: DuoIntegrationType
}

export interface UpdateDuoIntegrationPayload extends DuoIntegrationUpsertPayload {}

export interface DuoIntegrationClientSecret {
    client_secret: string
}

export interface DuoIntegrationSecretKeyV1 {
    secret_key: string
}
