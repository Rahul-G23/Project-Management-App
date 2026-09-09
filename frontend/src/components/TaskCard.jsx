function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const priorityStyles = {
    LOW: "bg-slate-100 text-slate-600",
    MEDIUM: "bg-amber-50 text-amber-700",
    HIGH: "bg-red-50 text-red-700",
  };

  const statusStyles = {
    TODO: "bg-slate-100 text-slate-600",
    IN_PROGRESS: "bg-indigo-50 text-indigo-700",
    COMPLETED: "bg-emerald-50 text-emerald-700",
  };

  const formatDate = (date) => {
    if (!date) {
      return "No due date";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              {task.title}
            </h3>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                priorityStyles[task.priority] ||
                priorityStyles.MEDIUM
              }`}
            >
              {task.priority || "MEDIUM"} priority
            </span>
          </div>

          <p className="mt-2 text-sm leading-5 text-slate-500">
            {task.description ||
              "No task description provided."}
          </p>
        </div>

        <span
          className={`shrink-0 self-start rounded-full px-2.5 py-1 text-xs font-semibold ${
            statusStyles[task.status] ||
            statusStyles.TODO
          }`}
        >
          {task.status || "TODO"}
        </span>
      </div>

      <div className="my-5 border-t border-slate-100" />

      <div className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Assigned to
          </p>

          <p className="mt-1 font-medium text-slate-700">
            {task.assignedTo?.name || "Unassigned"}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Due date
          </p>

          <p className="mt-1 font-medium text-slate-700">
            {formatDate(task.dueDate)}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <label
            htmlFor={`task-status-${task._id}`}
            className="sr-only"
          >
            Change task status
          </label>

          <select
            id={`task-status-${task._id}`}
            value={task.status || "TODO"}
            onChange={(event) =>
              onStatusChange(task, event.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          >
            <option value="TODO">To do</option>
            <option value="IN_PROGRESS">
              In progress
            </option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(task)}
            className="rounded-lg border border-red-100 bg-white px-3.5 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;