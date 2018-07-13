const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routers: state => state.menu.routers,
  addRouters: state => state.menu.addRouters,
  defaultOptions: state => {
    return [ { label: '全部', value: '' } ]
  },
  defaultItemType: state => {
    return [
      { value: '1', label: '道具' },
      { value: '2', label: '货币' }
    ]
  }
}
export default getters
