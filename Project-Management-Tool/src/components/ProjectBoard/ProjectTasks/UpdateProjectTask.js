import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import { getProjectTask, updateProjectTask } from "../../../actions/backlogActions";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { createCommentNotification } from "../../../actions/notificationActions";

class UpdateProjectTask extends Component {
  constructor() {
    super();

    this.state = {
      id: "",
      projectSequence: "",
      summary: "",
      acceptanceCriteria: "",
      status: "",
      priority: "",
      dueDate: "",
      projectIdentifier: "",
      create_At: "",
      comments: [],
      newComment: "",
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCommentSubmit = this.onCommentSubmit.bind(this);
  }

  componentDidMount() {
    const { backlog_id, pt_id } = this.props.match.params;
    this.props.getProjectTask(backlog_id, pt_id, this.props.history);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    const {
      id,
      projectSequence,
      summary,
      acceptanceCriteria,
      status,
      priority,
      dueDate,
      projectIdentifier,
      create_At,
      comments = []
    } = nextProps.project_task;

    this.setState({
      id,
      projectSequence,
      summary,
      acceptanceCriteria,
      status,
      priority,
      dueDate,
      projectIdentifier,
      create_At,
      comments
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const updatedTask = {
      id: this.state.id,
      projectSequence: this.state.projectSequence,
      summary: this.state.summary,
      acceptanceCriteria: this.state.acceptanceCriteria,
      status: this.state.status,
      priority: this.state.priority,
      dueDate: this.state.dueDate,
      projectIdentifier: this.state.projectIdentifier,
      create_At: this.state.create_At,
      comments: this.state.comments
    };

    this.props.updateProjectTask(
      this.state.projectIdentifier,
      this.state.projectSequence,
      updatedTask,
      this.props.history
    );
  }

  onCommentSubmit(e) {
    e.preventDefault();
    
    const { projectTask, newComment } = this.state;
    const { user } = this.props.security;

    // Skip if the comment is empty
    if (!newComment.trim()) return;

    // Create a new comment
    const comment = {
      author: user.fullName,
      text: newComment,
      timestamp: new Date().toISOString()
    };

    // Add the comment to the comments array
    const updatedComments = [...projectTask.comments, comment];

    this.setState({
      projectTask: {
        ...projectTask,
        comments: updatedComments
      },
      newComment: ""
    });

    // Create a notification for the comment (in a real app, you'd only send this to the task owner if not the current user)
    if (user.username !== "taskowner") { // This is just for demo, in a real app you'd check if the current user is not the task owner
      this.props.createCommentNotification(
        user.fullName,
        projectTask.summary,
        projectTask.projectIdentifier,
        projectTask.projectSequence
      );
    }
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <Link to={`/projectBoard/${this.state.projectIdentifier}`} className="btn btn-light mb-3">
              Back to Project Board
            </Link>
            <h4 className="display-4 text-center">Update Project Task</h4>
            <p className="lead text-center">
              Project Name: {this.state.projectIdentifier} | Project Task ID:{" "}
              {this.state.projectSequence}
            </p>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="summary">Project Task Summary</label>
                <input
                  type="text"
                  className={classnames("form-control form-control-lg", {
                    "is-invalid": errors.summary
                  })}
                  name="summary"
                  placeholder="Project Task summary"
                  value={this.state.summary}
                  onChange={this.onChange}
                />
                {errors.summary && (
                  <div className="invalid-feedback">{errors.summary}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="acceptanceCriteria">Acceptance Criteria</label>
                <textarea
                  className="form-control form-control-lg"
                  placeholder="Acceptance Criteria"
                  name="acceptanceCriteria"
                  value={this.state.acceptanceCriteria}
                  onChange={this.onChange}
                />
              </div>
              <h6>Due Date</h6>
              <div className="form-group mb-3">
                <input
                  type="date"
                  className="form-control form-control-lg"
                  name="dueDate"
                  value={this.state.dueDate || ""}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="priority">Priority</label>
                <select
                  className="form-control form-control-lg"
                  name="priority"
                  value={this.state.priority}
                  onChange={this.onChange}
                >
                  <option value={0}>Low</option>
                  <option value={1}>High</option>
                  <option value={2}>Medium</option>
                </select>
              </div>

              <div className="form-group mb-3">
                <label htmlFor="status">Status</label>
                <select
                  className="form-control form-control-lg"
                  name="status"
                  value={this.state.status}
                  onChange={this.onChange}
                >
                  <option value="TO_DO">TO DO</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
              </div>

              <input
                type="submit"
                className="btn btn-primary btn-block mt-4"
                value="Update"
              />
            </form>
            
            {/* Team Collaboration - Comments Section */}
            <div className="card mt-5">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="fas fa-comments mr-2"></i> Team Comments
                </h5>
              </div>
              <div className="card-body">
                <div className="comments-list mb-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {this.state.comments && this.state.comments.length > 0 ? (
                    this.state.comments.map(comment => (
                      <div key={comment.id} className="comment-item border-bottom pb-3 mb-3">
                        <div className="d-flex justify-content-between">
                          <h6 className="font-weight-bold">{comment.author}</h6>
                          <small className="text-muted">
                            {new Date(comment.timestamp).toLocaleString()}
                          </small>
                        </div>
                        <p className="mb-1">{comment.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted py-3">
                      <i className="fas fa-comment-slash fa-2x mb-2"></i>
                      <p>No comments yet. Be the first to comment!</p>
                    </div>
                  )}
                </div>
                
                <form onSubmit={this.onCommentSubmit}>
                  <div className="form-group">
                    <label htmlFor="newComment">Add a Comment</label>
                    <textarea
                      className="form-control"
                      placeholder="Type your comment here..."
                      name="newComment"
                      value={this.state.newComment}
                      onChange={this.onChange}
                      rows="3"
                    />
                  </div>
                  <button type="submit" className="btn btn-success">
                    <i className="fas fa-paper-plane mr-2"></i>Post Comment
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UpdateProjectTask.propTypes = {
  getProjectTask: PropTypes.func.isRequired,
  updateProjectTask: PropTypes.func.isRequired,
  project_task: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  security: PropTypes.object.isRequired,
  createCommentNotification: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  project_task: state.backlog.project_task,
  errors: state.errors,
  security: state.security
});

export default connect(
  mapStateToProps,
  { getProjectTask, updateProjectTask, createCommentNotification }
)(UpdateProjectTask); 