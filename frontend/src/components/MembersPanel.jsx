import { useState } from "react";

function MembersPanel({
  members = [],
  onAddMember,
  onRemoveMember,
  loading = false,
  error = "",
  canManageMembers = false,
}) {
  const [email, setEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [removingMemberId, setRemovingMemberId] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setFormError("Please enter a member email.");
      return;
    }

    setFormError("");
    setIsAdding(true);

    try {
      await onAddMember(trimmedEmail);
      setEmail("");
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to add member."
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveMember = async (member) => {
    const confirmed = window.confirm(
      `Remove ${member.name || member.email} from this project?`
    );

    if (!confirmed) {
      return;
    }

    setFormError("");
    setRemovingMemberId(member._id);

    try {
      await onRemoveMember(member);
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to remove member."
      );
    } finally {
      setRemovingMemberId("");
    }
  };

  return (
    <section
      id="project-members"
      className="rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Team members
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage the people working on this project.
            </p>
          </div>

          <span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            {members.length} {members.length === 1 ? "member" : "members"}
          </span>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-6">
        {canManageMembers && (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-slate-50 p-4"
          >
            <label
              htmlFor="memberEmail"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Add team member
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="memberEmail"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setFormError("");
                }}
                placeholder="member@example.com"
                className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />

              <button
                type="submit"
                disabled={isAdding}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
              >
                {isAdding ? "Adding..." : "Add member"}
              </button>
            </div>
          </form>
        )}

        {formError && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {formError}
          </p>
        )}

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-5">
          {loading ? (
            <div className="rounded-xl border border-slate-100 px-4 py-8 text-center">
              <p className="text-sm text-slate-500">
                Loading team members...
              </p>
            </div>
          ) : members.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-500">
                ●
              </div>

              <h3 className="mt-3 text-sm font-semibold text-slate-700">
                No team members yet
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Add someone using their registered email address.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white px-4 py-3 transition hover:border-slate-200 hover:bg-slate-50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                    {member.name
                      ? member.name.charAt(0).toUpperCase()
                      : "U"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {member.name || "Unknown member"}
                      </p>

                      {member.isOwner && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                          Owner
                        </span>
                      )}
                    </div>

                    <p className="truncate text-xs text-slate-400">
                      {member.email || "No email available"}
                    </p>
                  </div>

                  {canManageMembers && !member.isOwner && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member)}
                      disabled={removingMemberId === member._id}
                      className="shrink-0 rounded-lg border border-red-100 bg-white px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {removingMemberId === member._id
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default MembersPanel;
