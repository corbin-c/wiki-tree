const drawerReducer = (state, action) => {
  const {
    type,
    payload
  } = action;
  switch (type) {
    case "drawer/action":
      if (payload === "closeDrawer") {
        return {
          ...state,
          content: {},
          action: payload
        }
      }
      return {
        ...state,
        action: payload
      }
    case "drawer/content":
      return {
        ...state,
        content: payload
      }
    default:
      return state;
  }
}
export default drawerReducer
