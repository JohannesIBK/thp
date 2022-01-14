export enum PermissionEnum {
  /**
   * User is not logged in.
   * Only in frontend
   * @type {PermissionEnum.NOTHING}
   */
  NOTHING = -1,
  /**
   * Normal User - No permissions
   * @type {PermissionEnum.USER}
   */
  USER,
  /**
   * Helper - Is bound to one or multiple tournaments
   * Can only send tournament data
   * @type {PermissionEnum.HELPER}
   */
  HELPER = 3,
  /**
   * Admin - Is able to create users, helpers and tournaments
   * Can only manage tournaments the user created
   * @type {PermissionEnum.ADMIN}
   */
  ADMIN = 7,
  /**
   * Head Admin - Is able to create admins, helpers or users
   * Can manage all accounts and tournaments
   * @type {PermissionEnum.HEAD}
   */
  HEAD = 10,
}

export enum TeamManageResponse {
  NOTHING,
  LOG_CHANGE,
  DISQUALIFIED,
  QUALIFIED,
}
