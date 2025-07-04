import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import projectReducer from "./projectReducer";
import backlogReducer from "./backlogReducer";
import securityReducer from "./securityReducer";
import teamReducer from "./teamReducer";

export default combineReducers({
  errors: errorReducer,
  project: projectReducer,
  backlog: backlogReducer,
  security: securityReducer,
  team: teamReducer
});
