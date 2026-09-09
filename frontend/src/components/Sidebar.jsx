function Sidebar({
  projectCount,
  projects,
  selectedProject,
  onSelectProject,
}) {
  const scrollToProjects = () => {
    const projectsSection = document.getElementById(
      "projects-section"
    );

    if (projectsSection) {
      projectsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const openProjectSection = async (sectionId) => {
    let project = selectedProject;

    if (!project && projects.length > 0) {
      project = projects[0];

      await onSelectProject(project);

      setTimeout(() => {
        const section = document.getElementById(sectionId);

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    } else if (project) {
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      scrollToProjects();
    }
  };

  const handleTasksClick = () => {
    openProjectSection("project-tasks");
  };

  const handleMembersClick = () => {
    openProjectSection("project-members");
  };

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col">
        <div className="p-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {/* Projects */}
            <button
              type="button"
              onClick={scrollToProjects}
              className="flex w-full items-center justify-between rounded-xl bg-indigo-50 px-3 py-2.5 text-left text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100">
                  ▦
                </span>

                <span>Projects</span>
              </div>

              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs">
                {projectCount}
              </span>
            </button>

            {/* Tasks */}
            <button
              type="button"
              onClick={handleTasksClick}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                selectedProject
                  ? "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
                ✓
              </span>

              <span>Tasks</span>
            </button>

            {/* Team Members */}
            <button
              type="button"
              onClick={handleMembersClick}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
                ●
              </span>

              <span>Team members</span>
            </button>
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-100 p-5">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">
              Stay organized
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Create projects, assign tasks, and track your team's
              progress.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;