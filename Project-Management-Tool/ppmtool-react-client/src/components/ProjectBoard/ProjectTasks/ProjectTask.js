import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { deleteProjectTask } from "../../../actions/backlogActions";
import { Draggable } from "react-beautiful-dnd";

class ProjectTask extends Component {
  onDeleteClick(backlog_id, pt_id) {
    this.props.deleteProjectTask(backlog_id, pt_id);
  }

  render() {
    const { task, index } = this.props;

    // Priority class
    let priorityClass = "bg-info";
    let priorityText = "Low";

    if (task.priority === 1) {
      priorityClass = "bg-danger";
      priorityText = "High";
    } else if (task.priority === 2) {
      priorityClass = "bg-warning";
      priorityText = "Medium";
    }

    return (
      <Draggable draggableId={task.projectSequence} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="card task-item mb-3 shadow-sm"
            style={{
              ...provided.draggableProps.style,
              opacity: snapshot.isDragging ? 0.8 : 1,
              transform: snapshot.isDragging ? 
                `${provided.draggableProps.style.transform} rotate(2deg)` : 
                provided.draggableProps.style.transform
            }}
          >
            <div className={`card-header ${priorityClass} d-flex justify-content-between align-items-center py-2`}>
              <h6 className="mb-0 text-white">
                <span className="font-weight-bold">#{task.projectSequence}</span>
              </h6>
              <span className="badge badge-light font-weight-bold">
                {priorityText} Priority
              </span>
            </div>
            <div className="card-body py-3">
              <h5 className="card-title">{task.summary}</h5>
              {task.acceptanceCriteria && (
                <p className="card-text small text-muted">
                  {task.acceptanceCriteria.length > 100 ? 
                    `${task.acceptanceCriteria.substring(0, 100)}...` : 
                    task.acceptanceCriteria
                  }
                </p>
              )}
              
              <div className="task-meta d-flex justify-content-between align-items-center mb-3">
                <small className="text-muted">
                  <i className="fas fa-calendar-alt mr-1"></i>
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                </small>
                <small className="text-muted">
                  <i className="fas fa-user mr-1"></i>
                  {task.assignee || "Unassigned"}
                </small>
              </div>
              
              <div className="d-flex justify-content-between">
                <Link
                  to={`/updateProjectTask/${task.projectIdentifier}/${task.projectSequence}`}
                  className="btn btn-primary btn-sm"
                >
                  <i className="fas fa-edit mr-1"></i> Edit
                </Link>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={this.onDeleteClick.bind(this, task.projectIdentifier, task.projectSequence)}
                >
                  <i className="fas fa-trash-alt mr-1"></i> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  }
}

ProjectTask.propTypes = {
  deleteProjectTask: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
};

export default connect(
  null,
  { deleteProjectTask }
)(ProjectTask);
