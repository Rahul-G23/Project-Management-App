function ProjectCard({
  project,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}) {
  const statusStyles = {
    ACTIVE:
      "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100",
    COMPLETED:
      "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100",
    ARCHIVED:
      "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
  };

  const statusLabels = {
    ACTIVE: "Active",
    COMPLETED: "Completed",
    ARCHIVED: "Archived",
  };

  const memberCount = Array.isArray(project.members)
    ? project.members.length
    : 0;

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        isSelected
          ? "border-indigo-300 ring-2 ring-indigo-100"
          : "border-slate-200"
      }`}
    >
      {isSelected && (
        <div className="absolute inset-x-0 top-0 h-1 bg-indigo-600" />
      )}

      <div className="flex min-h-[210px] flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-600">
                {project.name?.charAt(0).toUpperCase() || "P"}
              </span>

              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Project
              </span>
            </div>

            <h3 className="truncate text-lg font-bold tracking-tight text-slate-900">
              {project.name}
            </h3>

            <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-500">
              {project.description ||
                "No project description provided."}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
              statusStyles[project.status] ||
              statusStyles.ACTIVE
            }`}
          >
            {statusLabels[project.status] || "Active"}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
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
                d="M16 21v-1.5a4.5 4.5 0 0 0-4.5-4.5h-3A4.5 4.5 0 0 0 4 19.5V21"
              />
              <circle
                cx="10"
                cy="7"
                r="3"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 11a3 3 0 1 0-1.2-5.75M19.5 21v-1.5a4.5 4.5 0 0 0-3.25-4.32"
              />
            </svg>

            <span>
              {memberCount}{" "}
              {memberCount === 1 ? "member" : "members"}
            </span>
          </div>

          {project.dueDate && (
            <div className="flex items-center gap-1.5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="17"
                  rx="2"
                />
                <path
                  strokeLinecap="round"
                  d="M16 2v4M8 2v4M3 10h18"
                />
              </svg>

              <span>
                {new Date(project.dueDate).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-5">
          <div className="mb-4 border-t border-slate-100" />

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto]">
            <button
              type="button"
              onClick={() => onSelect(project)}
              className="rounded-lg bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
            >
              {isSelected
                ? "Workspace open"
                : "View workspace"}
            </button>

            <button
              type="button"
              onClick={() => onEdit(project)}
              className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500/10"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => onDelete(project)}
              className="rounded-lg border border-red-100 bg-white px-3.5 py-2.5 text-sm font-medium text-red-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-4 focus:ring-red-500/10"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;