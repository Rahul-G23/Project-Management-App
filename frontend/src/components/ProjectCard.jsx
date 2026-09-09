function ProjectCard({
  project,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}) {
  const statusStyles = {
    ACTIVE: "bg-indigo-50 text-indigo-700",
    COMPLETED: "bg-emerald-50 text-emerald-700",
    ARCHIVED: "bg-slate-100 text-slate-600",
  };

  return (
    <div
      className={`group rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        isSelected
          ? "border-indigo-300 ring-2 ring-indigo-100"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-slate-900">
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
          {project.status}
        </span>
      </div>

      <div className="my-5 border-t border-slate-100" />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelect(project)}
          className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
        >
          View workspace
        </button>

        <button
          type="button"
          onClick={() => onEdit(project)}
          className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(project)}
          className="rounded-lg border border-red-100 bg-white px-3.5 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;