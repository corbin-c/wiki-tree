const initReducer = (state, action) => {
  const {
    type,
    payload
  } = action;
  switch (type) {
    case "init":
      return payload;
    default:
      return state;
  }
}
export default initReducer
