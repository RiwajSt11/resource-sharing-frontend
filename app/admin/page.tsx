"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteModule, getModules } from "@/libs/services/moduleService";

interface Module {
  _id: string;
  name: string;
  code: string;
  course: string;
  level: number;
  semester: string;
  status: "current" | "previous";
  instructor_email: string;
}

export default function AdminHomePage() {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const loadModules = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getModules();
      setModules(response.data);
      console.log(response.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load modules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteModule(id);
      setModules((prev) => prev.filter((m) => m._id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete module.");
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Modules</h1>
          <p className="text-sm text-gray-500 mt-1">
            {!loading &&
              `${modules.length} module${modules.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/modules/create")}
          className="px-4 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-700"
          style={{ cursor: "pointer" }}
        >
          + New Module
        </button>
      </div>

      {error && (
        <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">
          {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-sm text-gray-400 py-16 text-center">
          Loading...
        </div>
      ) : modules.length === 0 ? (
        <div className="text-sm text-gray-400 py-16 text-center border border-dashed border-gray-200 rounded">
          No modules yet.{" "}
          <button
            onClick={() => router.push("/admin/modules/create")}
            className="text-gray-700 underline underline-offset-2"
            style={{ cursor: "pointer" }}
          >
            Create one
          </button>
        </div>
      ) : (
        <div className="border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Level
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Semester
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Status
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {modules.map((mod) => (
                <tr
                  key={mod._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-900 font-medium" style={{ verticalAlign: "middle" }}>
                    {mod.name}
                    {mod.course && (
                      <span className="block text-xs text-gray-400 font-normal mt-0.5">
                        {mod.course}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-600 text-xs" style={{ verticalAlign: "middle" }}>
                    {mod.code}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell" style={{ verticalAlign: "middle" }}>
                    {mod.level}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell" style={{ verticalAlign: "middle" }}>
                    {mod.semester}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell" style={{ verticalAlign: "middle" }}>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        mod.status === "current"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {mod.status}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ verticalAlign: "middle" }}>
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() =>
                          router.push(`/admin/modules/${mod._id}/weeks`)
                        }
                        className="text-xs hover:text-gray-800 whitespace-nowrap"
                        style={{ cursor: "pointer", color: "#6b7280" }}
                      >
                        + Week
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/admin/modules/${mod._id}/edit`)
                        }
                        className="text-xs hover:text-gray-800"
                        style={{ cursor: "pointer", color: "#6b7280" }}
                      >
                        Edit
                      </button>
                      {confirmDelete === mod._id ? (
                        <span className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(mod._id)}
                            disabled={deletingId === mod._id}
                            className="text-xs disabled:opacity-50"
                            style={{ cursor: "pointer", color: "#dc2626" }}
                          >
                            {deletingId === mod._id ? "Deleting..." : "Confirm"}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="text-xs hover:text-gray-600"
                            style={{ cursor: "pointer", color: "#9ca3af" }}
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(mod._id)}
                          className="text-xs hover:text-red-700"
                          style={{ cursor: "pointer", color: "#ef4444" }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
