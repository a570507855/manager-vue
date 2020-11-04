module.exports = {

  title: '后台管理',

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false,
  development: {
    baseURL: 'http://localhost:8888/'
  },
  production: {
    baseURL: '/'
  }
}
