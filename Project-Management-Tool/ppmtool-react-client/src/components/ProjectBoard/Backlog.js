import React, { Component } from "react";
import ProjectTask from "./ProjectTasks/ProjectTask";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { updateProjectTask } from "../../actions/backlogActions";

class Backlog extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.organizeTasksIntoColumns(this.props.project_tasks_prop);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.project_tasks_prop !== this.props.project_tasks_prop) {
      this.organizeTasksIntoColumns(this.props.project_tasks_prop);
    }
  }

  organizeTasksIntoColumns(project_tasks) {
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

    // If there's no destination, do nothing
    if (!destination) {
      return;
    }

    // If dropped in the same position, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Get the start and finish columns
    const startColumn = this.state.columns[source.droppableId];
    const finishColumn = this.state.columns[destination.droppableId];

    // If moving within the same column
    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      // Remove from old position
      newTaskIds.splice(source.index, 1);
      // Insert at new position
      newTaskIds.splice(destination.index, 0, draggableId);

      // Create new column with updated taskIds
      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds
      };

      // Update state with new column
      this.setState({
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn
        }
      });
    } else {
      // Moving from one column to another
      const startTaskIds = Array.from(startColumn.taskIds);
      // Remove from start column
      startTaskIds.splice(source.index, 1);
      
      const newStartColumn = {
        ...startColumn,
        taskIds: startTaskIds
      };

      const finishTaskIds = Array.from(finishColumn.taskIds);
      // Add to finish column
      finishTaskIds.splice(destination.index, 0, draggableId);
      
      const newFinishColumn = {
        ...finishColumn,
        taskIds: finishTaskIds
      };

      // Update state with new columns
      this.setState({
        columns: {
          ...this.state.columns,
          [newStartColumn.id]: newStartColumn,
          [newFinishColumn.id]: newFinishColumn
        }
      });

      // Update the task status in the backend
      const task = this.state.tasks[draggableId];
      const updatedTask = {
        ...task,
        status: finishColumn.id
      };

      this.props.updateProjectTask(
        task.projectIdentifier,
        task.projectSequence,
        updatedTask
      );
    }
  }

  render() {
    const { columns, columnOrder, tasks } = this.state;

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="row">
          {columnOrder.map(columnId => {
            const column = columns[columnId];
            const columnTasks = column.taskIds.map(taskId => tasks[taskId]);
            const columnClass = 
              columnId === 'TO_DO' ? 'bg-secondary' : 
              columnId === 'IN_PROGRESS' ? 'bg-primary' : 'bg-success';

            return (
              <div className="col-md-4" key={column.id}>
                <div className="card shadow-sm border-0 mb-4">
                  <div className={`card-header ${columnClass} text-white d-flex justify-content-between align-items-center`}>
                    <h5 className="mb-0 font-weight-bold">
                      <i className={`fas ${
                        columnId === 'TO_DO' ? 'fa-list' : 
                        columnId === 'IN_PROGRESS' ? 'fa-spinner fa-spin' : 'fa-check-circle'
                      } mr-2`}></i>
                      {column.title}
                    </h5>
                    <span className="badge badge-light">
                      {columnTasks.length}
                    </span>
                  </div>
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="card-body"
                        style={{ 
                          minHeight: '50vh',
                          backgroundColor: snapshot.isDraggingOver ? '#f8f9fc' : 'white',
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        {columnTasks.map((task, index) => (
                          <ProjectTask 
                            key={task.projectSequence} 
                            task={task} 
                            index={index} 
                          />
                        ))}
                        {provided.placeholder}
                        
                        {columnTasks.length === 0 && (
                          <div className="text-center text-muted p-3">
                            <i className="fas fa-inbox fa-2x mb-2"></i>
                            <p>No tasks in this column</p>
                            <small>Drag and drop tasks here</small>
                          </div>
                        )}
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
}

export default connect(null, { updateProjectTask })(Backlog);
