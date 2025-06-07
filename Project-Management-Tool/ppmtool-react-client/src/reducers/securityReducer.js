import { SET_CURRENT_USER, SET_USER_PROFILE } from "../actions/types";

const initialState = {
  validToken: false,
  user: {},
  profile: null
};

const booleanActionPayload = payload => {
  if (payload) {
    return true;
  } else {
    return false;
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        validToken: booleanActionPayload(action.payload),
        user: action.payload
      };
    
    case SET_USER_PROFILE:
      return {
        ...state,
        profile: action.payload
      };

    default:
      return state;
  }
}
