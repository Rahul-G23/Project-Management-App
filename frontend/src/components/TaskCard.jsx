function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const statusStyles = {
    TODO:
      "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
    IN_PROGRESS:
      "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100",
    COMPLETED:
      "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100",
  };

  const statusLabels = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
  };

  const priorityStyles = {
    LOW:
      "bg-slate-50 text-slate-500 ring-1 ring-inset ring-slate-200",
    MEDIUM:
      "bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-100",
    HIGH:
      "bg-red-50 text-red-600 ring-1 ring-inset ring-red-100",
  };

  const priorityLabels = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
  };

  const assignedName =
    task.assignedTo?.name ||
    task.assignedTo?.email ||
    "Unassigned";

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const handleStatusChange = (event) => {
    if (onStatusChange) {
      onStatusChange(task, event.target.value);
    }
  };

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  statusStyles[task.status] ||
                  statusStyles.TODO
                }`}
              >
                {statusLabels[task.status] || "To Do"}
              </span>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  priorityStyles[task.priority] ||
                  priorityStyles.MEDIUM
                }`}
              >
                {priorityLabels[task.priority] || "Medium"}
              </span>
            </div>

            <h3 className="text-base font-bold tracking-tight text-slate-900">
              {task.title}
            </h3>

            <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-500">
              {task.description ||
                "No task description provided."}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500/10"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => onDelete(task)}
              className="rounded-lg border border-red-100 bg-white px-3 py-2 text-xs font-medium text-red-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-4 focus:ring-red-500/10"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600">
                {task.assignedTo?.name
                  ? task.assignedTo.name
                      .charAt(0)
                      .toUpperCase()
                  : "?"}
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Assigned to
                </p>

                <p className="truncate text-sm font-medium text-slate-700">
                  {assignedName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-500">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                >
                  <circle cx="12" cy="12" r="8.5" />
                  <path
                    strokeLinecap="round"
                    d="M12 7v5l3 2"
                  />
                </svg>
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Due date
                </p>

                <p className="truncate text-sm font-medium text-slate-700">
                  {formattedDueDate || "No due date"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 7h16M4 12h16M4 17h10"
                  />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Status
                </p>

                {onStatusChange ? (
                  <select
                    value={task.status || "TODO"}
                    onChange={handleStatusChange}
                    className="mt-0.5 w-full max-w-[150px] cursor-pointer border-0 bg-transparent p-0 text-sm font-semibold text-slate-700 outline-none focus:ring-0"
                  >
                    <option value="TODO">
                      To Do
                    </option>

                    <option value="IN_PROGRESS">
                      In Progress
                    </option>

                    <option value="COMPLETED">
                      Completed
                    </option>
                  </select>
                ) : (
                  <p className="truncate text-sm font-medium text-slate-700">
                    {statusLabels[task.status] ||
                      "To Do"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default TaskCard;