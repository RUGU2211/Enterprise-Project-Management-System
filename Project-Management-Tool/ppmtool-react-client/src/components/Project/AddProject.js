import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createProject } from "../../actions/projectActions";
import classnames from "classnames";
import { Link } from "react-router-dom";

class AddProject extends Component {
  constructor() {
    super();

    this.state = {
      projectName: "",
      projectIdentifier: "",
      description: "",
      start_date: "",
      end_date: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  //life cycle hooks
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      // Handle case where error is a string
      if (typeof nextProps.errors === 'string') {
        this.setState({ 
          errors: { 
            general: nextProps.errors 
          } 
        });
      } else {
        this.setState({ errors: nextProps.errors });
      }
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const newProject = {
      projectName: this.state.projectName,
      projectIdentifier: this.state.projectIdentifier,
      description: this.state.description,
      start_date: this.state.start_date,
      end_date: this.state.end_date
    };
    this.props.createProject(newProject, this.props.history);
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="project add-project-page">
        <div className="container">
          {/* Background Image */}
          <div className="add-project-background"></div>
          
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="card shadow">
                <div className="card-header bg-white text-center border-bottom-0 pt-4 pb-3">
                  <div className="mb-3">
                    <i className="fas fa-folder-plus fa-3x text-primary"></i>
                  </div>
                  <h2 className="font-weight-bold">Create New Project</h2>
                  <p className="text-muted">Complete the form below to create your new project</p>
                </div>
                <div className="card-body p-4">
                  {errors.general && (
                    <div className="alert alert-danger" role="alert">
                      {errors.general}
                    </div>
                  )}
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <label htmlFor="projectName" className="text-muted font-weight-bold small">Project Name</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text bg-light">
                            <i className="fas fa-project-diagram text-primary"></i>
                          </span>
                        </div>
                        <input
                          type="text"
                          className={classnames("form-control", {
                            "is-invalid": errors.projectName
                          })}
                          placeholder="Enter project name"
                          name="projectName"
                          id="projectName"
                          value={this.state.projectName}
                          onChange={this.onChange}
                        />
                        {errors.projectName && (
                          <div className="invalid-feedback">
                            {errors.projectName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="projectIdentifier" className="text-muted font-weight-bold small">Project ID</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text bg-light">
                            <i className="fas fa-hashtag text-primary"></i>
                          </span>
                        </div>
                        <input
                          type="text"
                          className={classnames("form-control", {
                            "is-invalid": errors.projectIdentifier
                          })}
                          placeholder="Unique project identifier (5 characters)"
                          name="projectIdentifier"
                          id="projectIdentifier"
                          value={this.state.projectIdentifier}
                          onChange={this.onChange}
                        />
                        {errors.projectIdentifier && (
                          <div className="invalid-feedback">
                            {errors.projectIdentifier}
                          </div>
                        )}
                      </div>
                      <small className="form-text text-muted">This unique identifier will be used throughout the project.</small>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="description" className="text-muted font-weight-bold small">Project Description</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text bg-light">
                            <i className="fas fa-align-left text-primary"></i>
                          </span>
                        </div>
                        <textarea
                          className={classnames("form-control", {
                            "is-invalid": errors.description
                          })}
                          placeholder="Describe your project in detail"
                          name="description"
                          id="description"
                          value={this.state.description}
                          onChange={this.onChange}
                          rows="4"
                        />
                        {errors.description && (
                          <div className="invalid-feedback">
                            {errors.description}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="row mt-4">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="start_date" className="text-muted font-weight-bold small">
                            <i className="fas fa-calendar-check mr-1 text-success"></i> Start Date
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            name="start_date"
                            id="start_date"
                            value={this.state.start_date}
                            onChange={this.onChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="end_date" className="text-muted font-weight-bold small">
                            <i className="fas fa-flag-checkered mr-1 text-danger"></i> Estimated End Date
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            name="end_date"
                            id="end_date"
                            value={this.state.end_date}
                            onChange={this.onChange}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between mt-4">
                      <Link 
                        to="/dashboard"
                        className="btn btn-light"
                      >
                        <i className="fas fa-arrow-left mr-1"></i>
                        Back to Dashboard
                      </Link>
                      <button
                        type="submit"
                        className="btn btn-primary px-4"
                      >
                        <i className="fas fa-save mr-1"></i>
                        Create Project
                      </button>
                    </div>
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

AddProject.propTypes = {
  createProject: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createProject }
)(AddProject);
