export default {
  addTasks(state, tasks) {
    tasks.forEach((task) => {
      console.log(state);
      const taskInList = state.tasks
        ? state.tasks.find((element) => parseInt(element.sourceId, 10) === parseInt(task.id, 10))
        : undefined;

      if (!taskInList) {
        console.log(task);
        state.tasks.push({
          id: state.tasks.length,
          description: task.content,
          order: state.tasks.length,
          priority: task.priority,
          time: 0,
          isCurrent: false,
          completed: state.completed,
          source: 'Todoist',
          sourceId: task.id,
          scheduled: false,
          currentTime: task.currentTime ? task.currentTime : 0,
        });
      } else if (task.completed !== taskInList.completed) {
        taskInList.completed = task.completed;
        taskInList.scheduled = false;
      }
    });
  },
  completeTask(state, taskToRemove) {
    // console.log(state.tasks, taskToRemove);
    const taskId = state.tasks.findIndex((task) => task.id === taskToRemove.id);
    state.tasks.splice(taskId, 1);
  },
  organiseTaskList(state, taskList) {
    console.log(taskList);
    state.tasks = [...taskList];
  },
};
