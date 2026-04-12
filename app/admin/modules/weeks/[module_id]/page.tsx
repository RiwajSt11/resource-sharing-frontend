"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { createWeek } from "@/libs/services/moduleService";

interface Resource {
  name: string;
  link: string;
}

interface WeekForm {
  code: string;
  number: string;
  title: string;
  contents: string[];
  resources: Resource[];
}

const initialForm: WeekForm = {
  code: "",
  number: "",
  title: "",
  contents: [""],
  resources: [{ name: "", link: "" }],
};

export default function CreateWeekPage() {
  const { module_id } = useParams<{ module_id: string }>();
  const [form, setForm] = useState<WeekForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleContentChange = (index: number, value: string) => {
    setForm((f) => {
      const contents = [...f.contents];
      contents[index] = value;
      return { ...f, contents };
    });
  };

  const addContent = () =>
    setForm((f) => ({ ...f, contents: [...f.contents, ""] }));

  const removeContent = (index: number) =>
    setForm((f) => {
      const contents = [...f.contents];
      contents.splice(index, 1);
      return { ...f, contents: contents.length ? contents : [""] };
    });

  const handleResourceChange = (index: number, field: keyof Resource, value: string) => {
    setForm((f) => {
      const resources = [...f.resources];
      resources[index] = { ...resources[index], [field]: value };
      return { ...f, resources };
    });
  };

  const addResource = () =>
    setForm((f) => ({ ...f, resources: [...f.resources, { name: "", link: "" }] }));

  const removeResource = (index: number) =>
    setForm((f) => {
      const resources = [...f.resources];
      resources.splice(index, 1);
      return { ...f, resources: resources.length ? resources : [{ name: "", link: "" }] };
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!form.code || !form.number || !form.title) {
      setError("Code, number, and title are required.");
      return;
    }

    setLoading(true);
    try {
      await createWeek(module_id, {
        ...form,
        number: parseInt(form.number),
        contents: form.contents.filter(Boolean),
        resources: form.resources.filter((r) => r.name && r.link),
      });
      setSuccess(true);
      setForm(initialForm);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create week.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 bg-white";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-xs text-gray-400 mb-1">Module / Weeks</p>
        <h1 className="text-xl font-semibold text-gray-900">Add Week</h1>
        <p className="text-sm text-gray-500 mt-1">
          Module:{" "}
          <span className="font-mono text-gray-700">{module_id}</span>
        </p>
      </div>

      {error && (
        <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-4 py-3">
          Week created successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Core */}
        <section>
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
            Core Info
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Week Number *</label>
              <input
                type="number"
                name="number"
                value={form.number}
                onChange={handleChange}
                min={1}
                placeholder="1"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Code *</label>
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="WEEK-01"
                className={inputCls}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Introduction to Variables"
                className={inputCls}
              />
            </div>
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* Contents */}
        <section>
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
            Contents
          </h2>
          <div className="space-y-2">
            {form.contents.map((item, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={item}
                  onChange={(e) => handleContentChange(i, e.target.value)}
                  placeholder={`Topic ${i + 1}`}
                  className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 bg-white"
                />
                <button
                  type="button"
                  onClick={() => removeContent(i)}
                  className="text-gray-400 hover:text-gray-600 px-2 text-lg leading-none"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addContent}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              + Add content
            </button>
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* Resources */}
        <section>
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
            Resources
          </h2>
          <div className="space-y-2">
            {form.resources.map((res, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={res.name}
                  onChange={(e) => handleResourceChange(i, "name", e.target.value)}
                  placeholder="Name"
                  className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 bg-white"
                />
                <input
                  value={res.link}
                  onChange={(e) => handleResourceChange(i, "link", e.target.value)}
                  placeholder="https://..."
                  className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 bg-white"
                />
                <button
                  type="button"
                  onClick={() => removeResource(i)}
                  className="text-gray-400 hover:text-gray-600 px-2 text-lg leading-none"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addResource}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              + Add resource
            </button>
          </div>
        </section>

        <hr className="border-gray-100" />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setForm(initialForm)}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Week"}
          </button>
        </div>
      </form>
    </div>
  );
}