export default {
  addTasks(state, payload) {
    const { source, tasks: todoistTasks } = payload;
    if (!todoistTasks) return;

    // Add any new tasks to list from Todoist
    // and also remove any completed tasks that we updated
    // in the Todoist app
    todoistTasks.forEach((task) => {
      const taskInList = state.tasks
        ? state.tasks.find((element) => parseInt(element.sourceId, 10) === parseInt(task.id, 10))
        : undefined;

      if (!taskInList) {
        state.tasks.push({
          id: state.tasks.length,
          description: task.content,
          order: state.tasks.length,
          priority: task.priority,
          time: 0,
          isCurrent: false,
          completed: state.completed,
          source,
          sourceId: task.id,
          scheduled: false,
          currentTime: task.currentTime ? task.currentTime : 0,
          projectId: task.project_id,
          list: 'main',
          storeStyle: { opacity: 1 },
        });
      } else if (task.completed !== taskInList.completed) {
        taskInList.completed = task.completed;
        taskInList.scheduled = false;
      }
    });

    // Remove any Todoist tasks from the store that we completed in the store
    // but not synchronized
    state.tasks.forEach((task) => {
      const taskInList = todoistTasks.find(
        (element) => parseInt(element.id, 10) === parseInt(task.sourceId, 10),
      );

      if (!taskInList) {
        // Need to find the current index as deleting in a loop will change the
        // index of the array as each one is deleted.
        const currentTaskIndex = state.tasks.findIndex((element) => element.id === task.id);
        state.tasks.splice(currentTaskIndex, 1);
      }
    });
  },
  completeTask(state, taskToRemove) {
    const taskId = state.tasks.findIndex((task) => task.id === taskToRemove.id);
    state.tasks.splice(taskId, 1);
  },
  moveTask(state, taskToMove) {
    console.table(taskToMove);
    const task = state.tasks[taskToMove.startPosition];
    console.table(state.tasks);
    task.list = taskToMove.targetList;
    console.log(task);
    state.tasks.splice(taskToMove.startPosition, 1);
    state.tasks.splice(taskToMove.newPosition, 0, task);
  },
  organiseTaskList(state, taskList) {
    state.tasks = [...taskList];
  },
  setOpacity(state, taskSelected) {
    const taskId = state.tasks.findIndex((task) => task.id === taskSelected.task.id);
    state.tasks[taskId].storeStyle.opacity = taskSelected.value;
  },
};
