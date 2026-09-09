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
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState("");

  const getMemberId = (member) => {
    if (!member) {
      return "";
    }

    return member._id || member.id || "";
  };

  const getInitial = (member) => {
    return member?.name
      ? member.name.charAt(0).toUpperCase()
      : "?";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      await onAddMember(trimmedEmail);
      setEmail("");
    } catch {
      // Dashboard handles and displays the error.
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (member) => {
    const memberId = getMemberId(member);

    if (!memberId || removingId) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove ${member.name || "this member"} from the project?`
    );

    if (!confirmed) {
      return;
    }

    setRemovingId(memberId);

    try {
      await onRemoveMember(memberId);
    } catch {
      // Dashboard handles and displays the error.
    } finally {
      setRemovingId("");
    }
  };

  const owner = members.find(
    (member) => member.isOwner === true
  );

  return (
    <section
      id="project-members"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
    >
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Team members
              </h3>

              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                {members.length}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Manage the people collaborating on this project.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Access
            </p>

            <p className="mt-0.5 text-sm font-semibold text-slate-700">
              {canManageMembers ? "Owner access" : "Member access"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        {canManageMembers && (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4"
          >
            <div className="mb-3">
              <p className="text-sm font-semibold text-slate-800">
                Add a team member
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Enter the email address of an existing account.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="member@example.com"
                required
                disabled={submitting || loading}
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
              />

              <button
                type="submit"
                disabled={
                  submitting ||
                  loading ||
                  !email.trim()
                }
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Adding..." : "Add member"}
              </button>
            </div>
          </form>
        )}

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-600">
              {error}
            </p>
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

            <p className="mt-3 text-sm font-medium text-slate-500">
              Loading team members...
            </p>
          </div>
        ) : members.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-lg text-slate-400 shadow-sm">
              ●
            </div>

            <h4 className="mt-3 font-semibold text-slate-800">
              No team members
            </h4>

            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              Add team members to collaborate on this project.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => {
              const memberId = getMemberId(member);
              const isOwner =
                member.isOwner === true ||
                (owner &&
                  getMemberId(owner) === memberId);

              const isRemoving = removingId === memberId;

              return (
                <div
                  key={memberId}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                      {getInitial(member)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {member.name || "Unknown member"}
                        </p>

                        {isOwner && (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-100">
                            Owner
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {member.email || "No email available"}
                      </p>
                    </div>
                  </div>

                  {canManageMembers && !isOwner && (
                    <button
                      type="button"
                      onClick={() => handleRemove(member)}
                      disabled={isRemoving || Boolean(removingId)}
                      className="w-full rounded-xl border border-red-100 bg-white px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-4 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                      {isRemoving ? "Removing..." : "Remove"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!canManageMembers && members.length > 0 && (
          <p className="text-xs leading-5 text-slate-400">
            Only the project owner can add or remove team members.
          </p>
        )}
      </div>
    </section>
  );
}

export default MembersPanel;