import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const userName = user?.name || "User";
  const userEmail = user?.email || "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-600/20">
            <span className="text-lg font-bold text-white">
              N
            </span>
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              NOVA
            </h1>

            <p className="hidden text-xs font-medium text-slate-400 sm:block">
              Project workspace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {userName}
            </p>

            {userEmail && (
              <p className="max-w-[220px] truncate text-xs text-slate-400">
                {userEmail}
              </p>
            )}
          </div>

          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 ring-4 ring-indigo-50"
            title={userName}
          >
            {userName.charAt(0).toUpperCase()}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-4 focus:ring-red-500/10"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;