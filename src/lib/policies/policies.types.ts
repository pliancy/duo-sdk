export interface DuoPoliciesListParams {
    limit?: number
    offset?: number
}

export interface DuoPolicySections {
    [section: string]: unknown
}

export interface DuoPolicy {
    policy_key: string
    policy_name: string
    is_global_policy: boolean
    sections?: DuoPolicySections
}

export interface CreateDuoPolicyPayload {
    policy_name: string
    sections?: DuoPolicySections
}

export interface UpdateDuoPolicyPayload {
    sections?: DuoPolicySections
    sections_to_delete?: string[]
    apply_to_apps?: string[]
    apply_to_groups_in_apps?: Record<string, string[]>
}
