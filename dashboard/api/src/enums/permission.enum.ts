// eslint-disable-next-line no-shadow
export enum PermissionEnum {
  /**
   * Normal User - No permissions
   * @type {PermissionEnum.USER}
   */
  USER,
  /**
   * Scrims - can only count data for scrims.
   * @type {PermissionEnum.SCRIMS_HELPER}
   */
  SCRIMS_HELPER = 2,
  /**
   * Helper - Is bound to one or multiple tournaments
   * Can only send tournament data
   * @type {PermissionEnum.TOURNAMENT_HELPER}
   */
  TOURNAMENT_HELPER = 3,
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
