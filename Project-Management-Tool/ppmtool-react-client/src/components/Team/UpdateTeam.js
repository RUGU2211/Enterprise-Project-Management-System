import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getTeam, updateTeam } from "../../actions/teamActions";
import classnames from "classnames";
import { Link } from "react-router-dom";

class UpdateTeam extends Component {
  constructor() {
    super();

    this.state = {
      id: "",
      name: "",
      description: "",
      teamIdentifier: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getTeam(id, this.props.history);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    // Only update state if team data exists
    if (nextProps.team) {
      const {
        id,
        name,
        description,
        teamIdentifier
      } = nextProps.team;

      this.setState({
        id: id || "",
        name: name || "",
        description: description || "",
        teamIdentifier: teamIdentifier || ""
      });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const updatedTeam = {
      id: this.state.id,
      name: this.state.name,
      description: this.state.description,
      teamIdentifier: this.state.teamIdentifier
    };

    console.log("Submitting team update:", updatedTeam);
    this.props.updateTeam(this.state.id, updatedTeam, this.props.history);
  }

  render() {
    const { errors } = this.state;
    
    const iconOptions = [
      { value: "users", display: "Users Group" },
      { value: "user-friends", display: "Friends" },
      { value: "laptop-code", display: "Development" },
      { value: "tasks", display: "Tasks" },
      { value: "project-diagram", display: "Project" },
      { value: "bug", display: "QA/Testing" },
      { value: "rocket", display: "Launch" },
      { value: "chart-line", display: "Analytics" }
    ];
    
    const colorOptions = [
      "#3f51b5", // Indigo
      "#2196f3", // Blue
      "#00bcd4", // Cyan
      "#009688", // Teal
      "#4caf50", // Green
      "#ff9800", // Orange
      "#f44336", // Red
      "#9c27b0"  // Purple
    ];

    return (
      <div className="update-team">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to={`/team/${this.state.id}`} className="btn btn-light mb-3">
                <i className="fas fa-arrow-left mr-1"></i> Back to Team Details
              </Link>
              
              <div className="card shadow">
                <div className="card-header bg-primary text-white text-center py-3">
                  <h4 className="mb-0">
                    <i className="fas fa-edit mr-2"></i>
                    Update Team
                  </h4>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <label htmlFor="name">Team Name</label>
                      <input
                        type="text"
                        className={classnames("form-control", {
                          "is-invalid": errors.name
                        })}
                        placeholder="Team Name"
                        name="name"
                        value={this.state.name}
                        onChange={this.onChange}
                      />
                      {errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="description">Team Description</label>
                      <textarea
                        className={classnames("form-control", {
                          "is-invalid": errors.description
                        })}
                        placeholder="Team Description"
                        name="description"
                        value={this.state.description}
                        onChange={this.onChange}
                        rows="3"
                      ></textarea>
                      {errors.description && (
                        <div className="invalid-feedback">{errors.description}</div>
                      )}
                    </div>
                    
                    <input 
                      type="hidden" 
                      name="teamIdentifier"
                      value={this.state.teamIdentifier} 
                    />
                    
                    <button type="submit" className="btn btn-primary btn-block mt-4">
                      <i className="fas fa-save mr-2"></i>Update Team
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UpdateTeam.propTypes = {
  getTeam: PropTypes.func.isRequired,
  updateTeam: PropTypes.func.isRequired,
  team: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  team: state.team.team,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getTeam, updateTeam }
)(UpdateTeam); 