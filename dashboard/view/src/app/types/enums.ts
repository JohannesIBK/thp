export enum Permission {
  /**
   * User is not logged in.
   * Only in frontend
   * @type {Permission.NOTHING}
   */
  NOTHING = -1,
  /**
   * Normal User - No permissions
   * @type {Permission.USER}
   */
  USER,
  /**
   * Helper - Is bound to one or multiple tournaments
   * Can only send tournament data
   * @type {Permission.HELPER}
   */
  HELPER = 3,
  /**
   * Admin - Is able to create users, helpers and tournaments
   * Can only manage tournaments the user created
   * @type {Permission.ADMIN}
   */
  ADMIN = 7,
  /**
   * Head Admin - Is able to create admins, helpers or users
   * Can manage all accounts and tournaments
   * @type {Permission.HEAD}
   */
  HEAD = 10,
}

export enum TeamManageResponse {
  NOTHING,
  LOG_CHANGE,
  DISQUALIFIED,
  QUALIFIED,
}
