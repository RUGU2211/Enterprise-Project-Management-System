import React, { Component } from "react";
import { Link } from "react-router-dom";
import Backlog from "./Backlog";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getBacklog } from "../../actions/backlogActions";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { updateProjectTask } from "../../actions/backlogActions";

class ProjectBoard extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
      columns: {
        'TO_DO': {
          id: 'TO_DO',
          title: 'TO DO',
          taskIds: []
        },
        'IN_PROGRESS': {
          id: 'IN_PROGRESS',
          title: 'IN PROGRESS',
          taskIds: []
        },
        'DONE': {
          id: 'DONE',
          title: 'DONE',
          taskIds: []
        }
      },
      columnOrder: ['TO_DO', 'IN_PROGRESS', 'DONE'],
      tasks: {}
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getBacklog(id);
  }

  componentDidUpdate(prevProps) {
    // If backlog has changed, reorganize tasks into columns
    if (prevProps.backlog.project_tasks !== this.props.backlog.project_tasks) {
      this.organizeTasksIntoColumns();
    }

    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }
  }

  organizeTasksIntoColumns() {
    const { project_tasks } = this.props.backlog;
    
    if (!project_tasks) {
      return;
    }

    // Create a tasks object with task IDs as keys
    const tasks = {};
    const todoTaskIds = [];
    const inProgressTaskIds = [];
    const doneTaskIds = [];

    project_tasks.forEach(task => {
      tasks[task.projectSequence] = task;
      
      // Add task ID to the appropriate column
      if (task.status === "TO_DO") {
        todoTaskIds.push(task.projectSequence);
      } else if (task.status === "IN_PROGRESS") {
        inProgressTaskIds.push(task.projectSequence);
      } else if (task.status === "DONE") {
        doneTaskIds.push(task.projectSequence);
      }
    });

    // Update columns with task IDs
    const columns = {
      'TO_DO': {
        ...this.state.columns['TO_DO'],
        taskIds: todoTaskIds
      },
      'IN_PROGRESS': {
        ...this.state.columns['IN_PROGRESS'],
        taskIds: inProgressTaskIds
      },
      'DONE': {
        ...this.state.columns['DONE'],
        taskIds: doneTaskIds
      }
    };

    this.setState({ tasks, columns });
  }

  onDragEnd(result) {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Get the source and destination columns
    const sourceColumn = this.state.columns[source.droppableId];
    const destinationColumn = this.state.columns[destination.droppableId];

    // If moving within the same column
    if (sourceColumn.id === destinationColumn.id) {
      const newTaskIds = Array.from(sourceColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds
      };

      const newColumns = {
        ...this.state.columns,
        [newColumn.id]: newColumn
      };

      this.setState({ columns: newColumns });
    } else {
      // Moving from one column to another
      const sourceTaskIds = Array.from(sourceColumn.taskIds);
      sourceTaskIds.splice(source.index, 1);
      
      const destinationTaskIds = Array.from(destinationColumn.taskIds);
      destinationTaskIds.splice(destination.index, 0, draggableId);

      const newSourceColumn = {
        ...sourceColumn,
        taskIds: sourceTaskIds
      };

      const newDestinationColumn = {
        ...destinationColumn,
        taskIds: destinationTaskIds
      };

      const newColumns = {
        ...this.state.columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestinationColumn.id]: newDestinationColumn
      };

      this.setState({ columns: newColumns });

      // Update the task status in the backend
      const task = this.state.tasks[draggableId];
      const updatedTask = {
        ...task,
        status: destination.droppableId
      };

      // Call API to update task status
      this.props.updateProjectTask(
        updatedTask.projectIdentifier,
        updatedTask.projectSequence,
        updatedTask
      );
    }
  }

  render() {
    const { id } = this.props.match.params;
    const { project_tasks } = this.props.backlog;
    const { errors, columns, columnOrder, tasks } = this.state;

    let BoardContent;

    const boardAlgorithm = (errors, project_tasks) => {
      if (project_tasks.length < 1) {
        if (errors.projectNotFound) {
          return (
            <div className="alert alert-danger text-center" role="alert">
              {errors.projectNotFound}
            </div>
          );
        } else if (errors.projectIdentifier) {
          return (
            <div className="alert alert-danger text-center" role="alert">
              {errors.projectIdentifier}
            </div>
          );
        } else {
          return (
            <div className="alert alert-info text-center" role="alert">
              No Project Tasks on this board
            </div>
          );
        }
      } else {
        return (
          <DragDropContext onDragEnd={this.onDragEnd}>
            <div className="row">
              {columnOrder.map(columnId => {
                const column = columns[columnId];
                const columnTasks = column.taskIds.map(taskId => tasks[taskId]);

                return (
                  <div className="col-md-4" key={column.id}>
                    <div className="card mb-4 shadow-sm">
                      <div className={`card-header text-white ${
                        column.id === 'TO_DO' ? 'bg-danger' : 
                        column.id === 'IN_PROGRESS' ? 'bg-primary' : 'bg-success'
                      }`}>
                        <h5>{column.title}</h5>
                      </div>
                      <Droppable droppableId={column.id}>
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="card-body kanban-column"
                            style={{ 
                              minHeight: '300px',
                              backgroundColor: snapshot.isDraggingOver ? '#f1f1f1' : 'white'
                            }}
                          >
                            {columnTasks.map((task, index) => (
                              <Draggable
                                key={task.projectSequence}
                                draggableId={task.projectSequence}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`card mb-2 shadow-sm ${snapshot.isDragging ? 'dragging' : ''}`}
                                    style={{
                                      ...provided.draggableProps.style,
                                      opacity: snapshot.isDragging ? 0.9 : 1
                                    }}
                                  >
                                    <div className="card-body p-2">
                                      <h5 className="card-title">{task.summary}</h5>
                                      <p className="card-text text-truncate">
                                        {task.acceptanceCriteria}
                                      </p>
                                      <div className="d-flex justify-content-between">
                                        <Link to={`/updateProjectTask/${task.projectIdentifier}/${task.projectSequence}`} className="btn btn-sm btn-info">
                                          View / Update
                                        </Link>
                                        <span className={`badge ${
                                          task.priority === 1 ? 'bg-danger' : 
                                          task.priority === 2 ? 'bg-warning' : 'bg-info'
                                        } text-white p-2`}>
                                          {task.priority === 1 ? "High" : 
                                           task.priority === 2 ? "Medium" : "Low"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        );
      }
    };

    BoardContent = boardAlgorithm(errors, project_tasks);

    return (
      <div className="container">
        <Link to={`/addProjectTask/${id}`} className="btn btn-primary mb-3">
          <i className="fas fa-plus-circle"> Create Project Task</i>
        </Link>
        <h2 className="display-4 text-center mb-4">Project Tasks</h2>

        {BoardContent}
      </div>
    );
  }
}

ProjectBoard.propTypes = {
  backlog: PropTypes.object.isRequired,
  getBacklog: PropTypes.func.isRequired,
  updateProjectTask: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  backlog: state.backlog,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getBacklog, updateProjectTask }
)(ProjectBoard); 