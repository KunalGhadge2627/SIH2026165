import { UserRole } from '../types/safety';
import { ViewName } from '../context/AppStateContext';

export type AccessLevel = 'full' | 'view_only' | 'limited' | 'none';

export interface ViewPermission {
  access: AccessLevel;
  siteScoped?: boolean;
  description?: string;
}

export type PermissionMatrix = Record<UserRole, Record<ViewName, ViewPermission>>;

export const PERMISSION_MATRIX: PermissionMatrix = {
  'HSE Officer': {
    dashboard: { access: 'full' },
    reports: { access: 'full' },
    triage: { access: 'full' },
    'case-detail': { access: 'full' },
    heatmap: { access: 'full' },
    patterns: { access: 'full' },
    trend: { access: 'full' },
    rules: { access: 'full' },
    analytics: { access: 'full' },
    ingestion: { access: 'full' },
    'model-health': { access: 'full' },
    settings: { access: 'none', description: 'Settings access is restricted to System Administrators.' },
    login: { access: 'full' },
  },
  'Site Manager': {
    dashboard: { access: 'full', siteScoped: true },
    reports: { access: 'view_only' },
    triage: { access: 'none', description: 'AI Review is restricted for Site Managers.' },
    'case-detail': { access: 'view_only' },
    heatmap: { access: 'view_only', siteScoped: true },
    patterns: { access: 'view_only' },
    trend: { access: 'full', siteScoped: true },
    rules: { access: 'view_only' },
    analytics: { access: 'full', siteScoped: true },
    ingestion: { access: 'limited', siteScoped: true, description: 'Report upload is restricted to your assigned site.' },
    'model-health': { access: 'view_only' },
    settings: { access: 'none', description: 'Settings access is restricted to System Administrators.' },
    login: { access: 'full' },
  },
  'System Administrator': {
    dashboard: { access: 'full' },
    reports: { access: 'view_only' },
    triage: { access: 'none', description: 'AI Review is restricted for System Administrators.' },
    'case-detail': { access: 'view_only' },
    heatmap: { access: 'full' },
    patterns: { access: 'view_only' },
    trend: { access: 'view_only' },
    rules: { access: 'view_only' },
    analytics: { access: 'view_only' },
    ingestion: { access: 'full' },
    'model-health': { access: 'full' },
    settings: { access: 'full' },
    login: { access: 'full' },
  },
};

/**
 * Get permission details for a given role and view.
 */
export function getPermission(role: UserRole, view: ViewName): ViewPermission {
  return PERMISSION_MATRIX[role]?.[view] || { access: 'none' };
}

/**
 * Check whether a view is accessible (either full, view_only, or limited).
 */
export function isViewAllowed(role: UserRole, view: ViewName): boolean {
  const perm = getPermission(role, view);
  return perm.access !== 'none';
}

/**
 * Check if the current view is in view-only mode for the role.
 */
export function isViewOnly(role: UserRole, view: ViewName): boolean {
  return getPermission(role, view).access === 'view_only';
}

/**
 * Check whether a specific action is allowed for a given role.
 */
export function canPerformAction(
  role: UserRole,
  action: 'edit_report' | 'review_report' | 'upload_reports' | 'manage_settings' | 'dismiss_alert'
): boolean {
  switch (action) {
    case 'edit_report':
    case 'review_report':
      return role === 'HSE Officer';
    case 'upload_reports':
      return role === 'HSE Officer' || role === 'Site Manager' || role === 'System Administrator';
    case 'manage_settings':
      return role === 'System Administrator';
    case 'dismiss_alert':
      return role === 'HSE Officer' || role === 'Site Manager';
    default:
      return false;
  }
}

/**
 * Get user-friendly label for active view blocking.
 */
export function getAccessDeniedReason(role: UserRole, view: ViewName): string {
  const perm = getPermission(role, view);
  if (perm.description) return perm.description;
  return `Access to ${view} is restricted for ${role}.`;
}
