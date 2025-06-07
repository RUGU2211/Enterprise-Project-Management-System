import {
  GET_TEAMS,
  GET_TEAM,
  CREATE_TEAM,
  UPDATE_TEAM,
  DELETE_TEAM,
  GET_TEAM_MEMBERS,
  ADD_TEAM_MEMBER,
  REMOVE_TEAM_MEMBER
} from "../actions/types";

const initialState = {
  teams: [],
  team: {},
  teamMembers: [],
  loading: false
};

export default function(state = initialState, action) {
  console.log("Team reducer handling action:", action.type);
  
  switch (action.type) {
    case GET_TEAMS:
      console.log("GET_TEAMS payload:", action.payload);
      return {
        ...state,
        teams: action.payload,
        loading: false
      };
    
    case GET_TEAM:
      console.log("GET_TEAM payload:", action.payload);
      return {
        ...state,
        team: action.payload,
        loading: false
      };
    
    case CREATE_TEAM:
      console.log("CREATE_TEAM payload:", action.payload);
      return {
        ...state,
        teams: [action.payload, ...state.teams]
      };
    
    case UPDATE_TEAM:
      console.log("UPDATE_TEAM payload:", action.payload);
      return {
        ...state,
        team: action.payload,
        teams: state.teams.map(team => 
          team.id === action.payload.id ? action.payload : team
        )
      };
    
    case DELETE_TEAM:
      console.log("DELETE_TEAM payload:", action.payload);
      return {
        ...state,
        teams: state.teams.filter(team => team.id !== action.payload)
      };
    
    case GET_TEAM_MEMBERS:
      console.log("GET_TEAM_MEMBERS payload:", action.payload);
      return {
        ...state,
        teamMembers: action.payload,
        loading: false
      };
    
    case ADD_TEAM_MEMBER:
      console.log("ADD_TEAM_MEMBER payload:", action.payload);
      const updatedTeam = {
        ...state.team,
        members: state.team.members ? [...state.team.members, action.payload] : [action.payload]
      };
      return {
        ...state,
        team: updatedTeam,
        teamMembers: [...(state.teamMembers || []), action.payload]
      };
    
    case REMOVE_TEAM_MEMBER:
      console.log("REMOVE_TEAM_MEMBER payload:", action.payload);
      return {
        ...state,
        teamMembers: state.teamMembers.filter(
          member => member.id !== action.payload
        )
      };
    
    default:
      return state;
  }
} 