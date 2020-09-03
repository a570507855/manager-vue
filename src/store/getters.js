const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  permission_routes: state => state.permission.routes,
  async_routes: state => state.permission.asyncRoutes,
}
export default getters
