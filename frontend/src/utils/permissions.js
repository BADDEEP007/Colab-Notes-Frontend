/**
 * Permission utilities for role-based access control
 */

/**
 * Role hierarchy for permission checking
 */
export const ROLES = {
  OWNER: 'Owner',
  EDITOR: 'Editor',
  VIEWER: 'Viewer',
};

/**
 * Role levels for comparison (higher number = more permissions)
 */
const ROLE_LEVELS = {
  [ROLES.OWNER]: 3,
  [ROLES.EDITOR]: 2,
  [ROLES.VIEWER]: 1,
};

/**
 * Check if a user has permission to perform an action based on their role
 * @param {string} userRole - The user's role (Owner, Editor, or Viewer)
 * @param {string} requiredRole - The minimum role required for the action
 * @returns {boolean} - True if user has permission, false otherwise
 */
export function hasPermission(userRole, requiredRole) {
  const userLevel = ROLE_LEVELS[userRole] || 0;
  const requiredLevel = ROLE_LEVELS[requiredRole] || 0;
  return userLevel >= requiredLevel;
}

/**
 * Check if a user can edit (requires Editor or Owner role)
 * @param {string} userRole - The user's role
 * @returns {boolean} - True if user can edit
 */
export function canEdit(userRole) {
  return hasPermission(userRole, ROLES.EDITOR);
}

/**
 * Check if a user is an owner (requires Owner role)
 * @param {string} userRole - The user's role
 * @returns {boolean} - True if user is owner
 */
export function isOwner(userRole) {
  return userRole === ROLES.OWNER;
}

/**
 * Check if a user can view (all roles can view)
 * @param {string} userRole - The user's role
 * @returns {boolean} - True if user can view
 */
export function canView(userRole) {
  return hasPermission(userRole, ROLES.VIEWER);
}

/**
 * Check if a user can delete (requires Owner role)
 * @param {string} userRole - The user's role
 * @returns {boolean} - True if user can delete
 */
export function canDelete(userRole) {
  return isOwner(userRole);
}

/**
 * Check if a user can invite others (requires Owner or Editor role)
 * @param {string} userRole - The user's role
 * @returns {boolean} - True if user can invite
 */
export function canInvite(userRole) {
  return hasPermission(userRole, ROLES.EDITOR);
}

/**
 * Check if a user can share (requires Owner or Editor role)
 * @param {string} userRole - The user's role
 * @returns {boolean} - True if user can share
 */
export function canShare(userRole) {
  return hasPermission(userRole, ROLES.EDITOR);
}

/**
 * Get a user's role for a specific resource
 * @param {Object} resource - The resource (instance, container, or note)
 * @param {string} userId - The user's ID
 * @returns {string|null} - The user's role or null if not a member
 */
export function getUserRole(resource, userId) {
  if (!resource || !userId) return null;

  // Check if resource has members array (for instances)
  if (resource.members) {
    const member = resource.members.find(m => m.userId === userId);
    return member?.role || null;
  }

  // Check if resource has sharedWith array (for notes)
  if (resource.sharedWith) {
    const sharedAccess = resource.sharedWith.find(s => s.userId === userId);
    return sharedAccess?.role || null;
  }

  // Check if user is the owner
  if (resource.ownerId === userId || resource.authorId === userId) {
    return ROLES.OWNER;
  }

  return null;
}

/**
 * Check if a user has access to a resource
 * @param {Object} resource - The resource to check
 * @param {string} userId - The user's ID
 * @param {string} [requiredRole] - Optional minimum role required
 * @returns {boolean} - True if user has access
 */
export function hasAccess(resource, userId, requiredRole = ROLES.VIEWER) {
  const userRole = getUserRole(resource, userId);
  if (!userRole) return false;
  return hasPermission(userRole, requiredRole);
}
