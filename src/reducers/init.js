const initReducer = (state, action) => {
  const {
    type,
    payload
  } = action;
  switch (type) {
    case "init/set":
      return {
        ...state,
        [payload.key]: payload.value
      }
    case "init/start":
      return {
        ...state,
        start: true
      };
    default:
      return state;
  }
}
export default initReducer
