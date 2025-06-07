import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createTeam } from "../../actions/teamActions";
import classnames from "classnames";

class CreateTeam extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      teamIdentifier: "",
      description: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const newTeam = {
      name: this.state.name,
      teamIdentifier: this.state.teamIdentifier,
      description: this.state.description
    };

    this.props.createTeam(newTeam, this.props.history);
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="create-team bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <Link to="/teams" className="btn btn-outline-secondary mb-4 shadow-sm">
                <i className="fas fa-arrow-left mr-2"></i> Back to Teams
              </Link>
              
              <div className="card shadow-lg border-0 rounded">
                <div className="card-header bg-gradient-primary text-white py-3">
                  <h1 className="h4 m-0 font-weight-bold">
                    <i className="fas fa-users-cog mr-2"></i>
                    Create New Team
                  </h1>
                </div>
                
                <div className="card-body py-4 px-4">
                  <p className="lead text-muted mb-4">
                    Create a new team to coordinate projects and collaborate with team members.
                  </p>
                  
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group mb-4">
                      <label htmlFor="name" className="form-label font-weight-bold">
                        <i className="fas fa-users text-primary mr-2"></i>
                        Team Name
                      </label>
                      <input
                        type="text"
                        className={classnames("form-control form-control-lg shadow-sm", {
                          "is-invalid": errors.name
                        })}
                        placeholder="Enter team name"
                        name="name"
                        value={this.state.name}
                        onChange={this.onChange}
                      />
                      {errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                      )}
                      <small className="form-text text-muted">
                        Choose a descriptive name for your team
                      </small>
                    </div>
                    
                    <div className="form-group mb-4">
                      <label htmlFor="teamIdentifier" className="form-label font-weight-bold">
                        <i className="fas fa-fingerprint text-primary mr-2"></i>
                        Team Identifier
                      </label>
                      <input
                        type="text"
                        className={classnames("form-control form-control-lg shadow-sm", {
                          "is-invalid": errors.teamIdentifier
                        })}
                        placeholder="Unique team identifier"
                        name="teamIdentifier"
                        value={this.state.teamIdentifier}
                        onChange={this.onChange}
                      />
                      {errors.teamIdentifier && (
                        <div className="invalid-feedback">{errors.teamIdentifier}</div>
                      )}
                      <small className="form-text text-muted">
                        Unique ID for your team (4-5 characters, letters and numbers only)
                      </small>
                    </div>
                    
                    <div className="form-group mb-4">
                      <label htmlFor="description" className="form-label font-weight-bold">
                        <i className="fas fa-info-circle text-primary mr-2"></i>
                        Team Description
                      </label>
                      <textarea
                        className={classnames("form-control shadow-sm", {
                          "is-invalid": errors.description
                        })}
                        placeholder="Describe the team's purpose and focus"
                        name="description"
                        rows="4"
                        value={this.state.description}
                        onChange={this.onChange}
                      ></textarea>
                      {errors.description && (
                        <div className="invalid-feedback">{errors.description}</div>
                      )}
                      <small className="form-text text-muted">
                        Provide details about this team's purpose, goals, and focus areas
                      </small>
                    </div>
                    
                    <div className="form-group d-flex justify-content-between mt-5">
                      <Link to="/teams" className="btn btn-outline-secondary">
                        <i className="fas fa-times mr-2"></i>Cancel
                      </Link>
                      <button type="submit" className="btn btn-success btn-lg shadow-sm px-5">
                        <i className="fas fa-plus-circle mr-2"></i>Create Team
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          .bg-gradient-primary {
            background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
          }
          
          .form-control {
            border-radius: 0.25rem;
          }
          
          .form-control:focus {
            border-color: #4e73df;
            box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
          }
          
          .create-team {
            min-height: 100vh;
          }
        `}</style>
      </div>
    );
  }
}

CreateTeam.propTypes = {
  createTeam: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createTeam }
)(CreateTeam); 