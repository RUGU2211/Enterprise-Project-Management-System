import React, { Component } from "react";
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

  // Life cycle hook
  UNSAFE_componentWillReceiveProps(nextProps) {
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
      <div className="create-team">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <h1 className="text-center my-4">Create Team</h1>
              <hr />
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className={classnames("form-control form-control-lg", {
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
                  <input
                    type="text"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.teamIdentifier
                    })}
                    placeholder="Unique Team ID (4-5 Characters)"
                    name="teamIdentifier"
                    value={this.state.teamIdentifier}
                    onChange={this.onChange}
                  />
                  {errors.teamIdentifier && (
                    <div className="invalid-feedback">{errors.teamIdentifier}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <textarea
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.description
                    })}
                    placeholder="Team Description"
                    name="description"
                    value={this.state.description}
                    onChange={this.onChange}
                  />
                  {errors.description && (
                    <div className="invalid-feedback">{errors.description}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-lg btn-block">
                    Create Team
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
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