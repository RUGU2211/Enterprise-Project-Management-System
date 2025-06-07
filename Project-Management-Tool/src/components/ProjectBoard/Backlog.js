import { createTaskNotification } from "../../actions/notificationActions";

class Backlog extends React.Component {
  onDragEnd = result => {
    const { destination, source, draggableId } = result;

    // If there's no destination or the item was dropped back in the same place
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Find the moved task
    const projectTask = this.props.backlog.project_tasks.find(
      task => task.projectSequence === draggableId
    );

    if (!projectTask) return;

    // Only update if the status column changed
    if (destination.droppableId !== source.droppableId) {
      // Create a copy of the task with the updated status
      const updatedTask = {
        ...projectTask,
        status: destination.droppableId
      };

      // Update the task in the backend
      this.props.updateProjectTask(
        updatedTask.projectIdentifier,
        updatedTask.projectSequence,
        updatedTask
      );

      // Create a notification for the status change
      const statusText = {
        "TO_DO": "To Do",
        "IN_PROGRESS": "In Progress",
        "DONE": "Done"
      };
      
      this.props.createTaskNotification(
        `${updatedTask.summary} moved to ${statusText[destination.droppableId]}`,
        updatedTask.projectIdentifier,
        updatedTask.projectSequence
      );
    }
  };

  render() {
    // ... existing render code ...
  }
}

export default connect(
  mapStateToProps,
  { getBacklog, updateProjectTask, createTaskNotification }
)(Backlog); 