function Sidebar({
  projectCount,
  projects,
  selectedProject,
  onSelectProject,
}) {
  const scrollToProjects = () => {
    document
      .getElementById("projects-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const openProjectSection = (sectionId) => {
    const project =
      selectedProject || projects?.[0];

    if (project && !selectedProject) {
      onSelectProject(project);
    }

    setTimeout(() => {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const isProjectSelected = Boolean(selectedProject);

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-24 space-y-4">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Workspace
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              Project navigation
            </p>
          </div>

          <nav className="space-y-1 p-3">
            <button
              type="button"
              onClick={scrollToProjects}
              className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left transition ${
                !isProjectSelected
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    !isProjectSelected
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="7"
                      height="7"
                      rx="1.5"
                    />
                    <rect
                      x="14"
                      y="3"
                      width="7"
                      height="7"
                      rx="1.5"
                    />
                    <rect
                      x="3"
                      y="14"
                      width="7"
                      height="7"
                      rx="1.5"
                    />
                    <rect
                      x="14"
                      y="14"
                      width="7"
                      height="7"
                      rx="1.5"
                    />
                  </svg>
                </span>

                <span className="text-sm font-semibold">
                  Projects
                </span>
              </span>

              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                {projectCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                openProjectSection("project-tasks")
              }
              disabled={!projects?.length}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition ${
                !projects?.length
                  ? "cursor-not-allowed text-slate-300"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
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
                    d="M9 5h6M9 9h6M9 13h4M6.5 3.5h11A1.5 1.5 0 0 1 19 5v14a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19V5a1.5 1.5 0 0 1 1.5-1.5Z"
                  />
                </svg>
              </span>

              <span className="text-sm font-semibold">
                Tasks
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                openProjectSection("project-members")
              }
              disabled={!projects?.length}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left transition ${
                !projects?.length
                  ? "cursor-not-allowed text-slate-300"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
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
              </span>

              <span className="text-sm font-semibold">
                Team members
              </span>
            </button>
          </nav>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v4M12 17v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M3 12h4M17 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"
              />
            </svg>
          </div>

          <h3 className="mt-4 text-sm font-bold text-slate-900">
            Stay organized
          </h3>

          <p className="mt-1.5 text-xs leading-5 text-slate-500">
            Keep projects, tasks, and team activity in one
            workspace.
          </p>

          {selectedProject && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Current project
              </p>

              <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                {selectedProject.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;