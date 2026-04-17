"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/libs/axios";
import { Module } from "@/types/Module";
import { Week } from "@/types/Week";
import {
  getModuleById,
  getWeeksByModuleId,
  createWeek,
  updateWeek as updateWeekService,
  deleteWeek as deleteWeekService,
} from "@/libs/services/moduleService";

/* ─── Module form helpers ─── */

const emptyForm: Module = {
  name: "",
  code: "",
  course: "",
  course_code: "",
  description: "",
  semester: 1,
  level: 4,
  status: "previous",
  image_url: "",
  time_label: "",
  hero_image_url: "",
  instructor_email: "",
  welcome_text: "",
  overview_text: "",
  learning_outcomes: [""],
  people_photos: [""],
};

const toForm = (data: any): Module => ({
  name: data.name ?? "",
  code: data.code ?? "",
  course: data.course ?? "",
  course_code: data.course_code ?? "",
  description: data.description ?? "",
  semester: data.semester ?? 1,
  level: data.level ?? 4,
  status: data.status ?? "previous",
  image_url: data.image_url ?? "",
  time_label: data.time_label ?? "",
  hero_image_url: data.hero_image_url ?? "",
  instructor_email: data.instructor_email ?? "",
  welcome_text: data.welcome_text ?? "",
  overview_text: data.overview_text ?? "",
  learning_outcomes: data.learning_outcomes?.length ? data.learning_outcomes : [""],
  people_photos: data.people_photos?.length ? data.people_photos : [""],
});

const semestersByLevel: Record<string, string[]> = {
  "4": ["1", "2"],
  "5": ["3", "4"],
  "6": ["5", "6"],
};

/* ─── Week form helpers ─── */

interface WeekForm {
  code: string;
  number: string;
  title: string;
  contents: string[];
  resources: { name: string; link: string }[];
}

const emptyWeekForm: WeekForm = {
  code: "",
  number: "",
  title: "",
  contents: [""],
  resources: [{ name: "", link: "" }],
};

const weekToForm = (w: Week): WeekForm => ({
  code: w.code ?? "",
  number: String(w.number ?? ""),
  title: w.title ?? "",
  contents: w.contents?.length ? [...w.contents] : [""],
  resources: w.resources?.length
    ? w.resources.map((r) => ({ name: r.name, link: r.link }))
    : [{ name: "", link: "" }],
});

/* ─── Main component ─── */

export default function EditModulePage() {
  const { module_id } = useParams();
  const router = useRouter();

  // Module state
  const [form, setForm] = useState<Module>(emptyForm);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [peoplePhotosFiles, setPeoplePhotosFiles] = useState<File[]>([]);

  // Weeks state
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [weeksFetching, setWeeksFetching] = useState(true);
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);
  const [editingWeek, setEditingWeek] = useState<string | null>(null);
  const [weekForm, setWeekForm] = useState<WeekForm>(emptyWeekForm);
  const [weekLoading, setWeekLoading] = useState(false);
  const [weekError, setWeekError] = useState<string | null>(null);
  const [weekSuccess, setWeekSuccess] = useState<string | null>(null);
  const [showNewWeek, setShowNewWeek] = useState(false);
  const [newWeekForm, setNewWeekForm] = useState<WeekForm>(emptyWeekForm);
  const [confirmDeleteWeek, setConfirmDeleteWeek] = useState<string | null>(null);

  /* ─── Fetch module ─── */
  useEffect(() => {
    const load = async () => {
      setFetching(true);
      setError(null);
      try {
        const res = await getModuleById(module_id as string);
        setForm(toForm(res.data));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load module.");
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [module_id]);

  /* ─── Fetch weeks ─── */
  const loadWeeks = async () => {
    setWeeksFetching(true);
    try {
      const res = await getWeeksByModuleId(module_id as string);
      setWeeks(res?.data ?? []);
    } catch {
      setWeeks([]);
    } finally {
      setWeeksFetching(false);
    }
  };

  useEffect(() => {
    loadWeeks();
  }, [module_id]);

  /* ─── Module form handlers ─── */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "level") {
      const levelValue = parseInt(value);
      const semesters = semestersByLevel[value] || ["1", "2"];
      setForm((f) => ({
        ...f,
        level: levelValue,
        semester: semesters.includes(String(f.semester)) ? f.semester : parseInt(semesters[0]),
      }));
    } else {
      setForm((f) => ({
        ...f,
        [name]: name === "semester" ? parseInt(value) : value,
      }));
    }
  };

  const handleArrayChange = (
    field: "learning_outcomes" | "people_photos",
    index: number,
    value: string
  ) => {
    setForm((f) => {
      const arr = [...(f[field] ?? [""])];
      arr[index] = value;
      return { ...f, [field]: arr };
    });
  };

  const addItem = (field: "learning_outcomes" | "people_photos") =>
    setForm((f) => ({ ...f, [field]: [...(f[field] ?? [""]), ""] }));

  const removeItem = (field: "learning_outcomes" | "people_photos", index: number) =>
    setForm((f) => {
      const arr = [...(f[field] ?? [""])];
      arr.splice(index, 1);
      return { ...f, [field]: arr.length ? arr : [""] };
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!form.name || !form.code) {
      setError("Name and code are required.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === "learning_outcomes" || key === "people_photos") {
          (val as string[]).filter(Boolean).forEach((v) => fd.append(key, v));
        } else if (val !== null && val !== undefined && val !== "") {
          fd.append(key, String(val));
        }
      });
      if (imageFile) fd.append("image_url", imageFile);
      if (heroImageFile) fd.append("hero_image_url", heroImageFile);
      if (peoplePhotosFiles.length > 0) {
        peoplePhotosFiles.forEach((file) => fd.append("people_photos", file));
      }

      await api.patch(`/modules/by-id/${module_id}`, fd);
      setSuccess(true);
      // clear files after successful upload
      setImageFile(null);
      setHeroImageFile(null);
      setPeoplePhotosFiles([]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update module.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── Week form handlers ─── */

  const handleWeekFormChange = (
    setter: React.Dispatch<React.SetStateAction<WeekForm>>,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setter((f) => ({ ...f, [name]: value }));
  };

  const handleWeekContentChange = (
    setter: React.Dispatch<React.SetStateAction<WeekForm>>,
    index: number,
    value: string
  ) => {
    setter((f) => {
      const contents = [...f.contents];
      contents[index] = value;
      return { ...f, contents };
    });
  };

  const addWeekContent = (setter: React.Dispatch<React.SetStateAction<WeekForm>>) =>
    setter((f) => ({ ...f, contents: [...f.contents, ""] }));

  const removeWeekContent = (
    setter: React.Dispatch<React.SetStateAction<WeekForm>>,
    index: number
  ) =>
    setter((f) => {
      const contents = [...f.contents];
      contents.splice(index, 1);
      return { ...f, contents: contents.length ? contents : [""] };
    });

  const handleWeekResourceChange = (
    setter: React.Dispatch<React.SetStateAction<WeekForm>>,
    index: number,
    field: "name" | "link",
    value: string
  ) => {
    setter((f) => {
      const resources = [...f.resources];
      resources[index] = { ...resources[index], [field]: value };
      return { ...f, resources };
    });
  };

  const addWeekResource = (setter: React.Dispatch<React.SetStateAction<WeekForm>>) =>
    setter((f) => ({ ...f, resources: [...f.resources, { name: "", link: "" }] }));

  const removeWeekResource = (
    setter: React.Dispatch<React.SetStateAction<WeekForm>>,
    index: number
  ) =>
    setter((f) => {
      const resources = [...f.resources];
      resources.splice(index, 1);
      return { ...f, resources: resources.length ? resources : [{ name: "", link: "" }] };
    });

  /* ─── Week CRUD ─── */

  const startEditWeek = (w: Week) => {
    setEditingWeek(w._id ?? null);
    setWeekForm(weekToForm(w));
    setExpandedWeek(w._id ?? null);
    setWeekError(null);
    setWeekSuccess(null);
  };

  const cancelEditWeek = () => {
    setEditingWeek(null);
    setWeekForm(emptyWeekForm);
    setWeekError(null);
  };

  const saveWeek = async (weekId: string) => {
    if (!weekForm.code || !weekForm.number || !weekForm.title) {
      setWeekError("Code, number, and title are required.");
      return;
    }
    setWeekLoading(true);
    setWeekError(null);
    setWeekSuccess(null);
    try {
      await updateWeekService(module_id as string, weekId, {
        ...weekForm,
        number: parseInt(weekForm.number),
        contents: weekForm.contents.filter(Boolean),
        resources: weekForm.resources.filter((r) => r.name && r.link),
      });
      setWeekSuccess("Week updated.");
      setEditingWeek(null);
      await loadWeeks();
    } catch (err: unknown) {
      setWeekError(err instanceof Error ? err.message : "Failed to update week.");
    } finally {
      setWeekLoading(false);
    }
  };

  const handleDeleteWeek = async (weekId: string) => {
    setWeekLoading(true);
    setWeekError(null);
    try {
      await deleteWeekService(module_id as string, weekId);
      setWeekSuccess("Week deleted.");
      setConfirmDeleteWeek(null);
      await loadWeeks();
    } catch (err: unknown) {
      setWeekError(err instanceof Error ? err.message : "Failed to delete week.");
    } finally {
      setWeekLoading(false);
    }
  };

  const handleCreateWeek = async () => {
    if (!newWeekForm.code || !newWeekForm.number || !newWeekForm.title) {
      setWeekError("Code, number, and title are required.");
      return;
    }
    setWeekLoading(true);
    setWeekError(null);
    setWeekSuccess(null);
    try {
      await createWeek(module_id as string, {
        ...newWeekForm,
        number: parseInt(newWeekForm.number),
        contents: newWeekForm.contents.filter(Boolean),
        resources: newWeekForm.resources.filter((r) => r.name && r.link),
      });
      setWeekSuccess("Week created.");
      setShowNewWeek(false);
      setNewWeekForm(emptyWeekForm);
      await loadWeeks();
    } catch (err: unknown) {
      setWeekError(err instanceof Error ? err.message : "Failed to create week.");
    } finally {
      setWeekLoading(false);
    }
  };

  /* ─── Shared styles ─── */

  const inputCls =
    "w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 bg-white";

  /* ─── Loading state ─── */

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-sm text-gray-400">
        Loading module...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <button
          onClick={() => router.push("/admin")}
          className="text-xs text-gray-400 hover:text-gray-600 mb-4 inline-block cursor-pointer"
        >
          ← Back to modules
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Edit Module</h1>
        <p className="text-sm text-gray-500 mt-1 font-mono">{module_id}</p>
      </div>

      {error && (
        <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-4 py-3">
          Module updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Core Info */}
        <section>
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
            Core Info
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name *">
              <input name="name" value={form.name} onChange={handleChange} required placeholder="Introduction to Computing" />
            </Field>
            <Field label="Code *">
              <input name="code" value={form.code} onChange={handleChange} required placeholder="CS101" />
            </Field>
            <Field label="Course">
              <input name="course" value={form.course} onChange={handleChange} placeholder="Course name" />
            </Field>
            <Field label="Course Code">
              <input name="course_code" value={form.course_code} onChange={handleChange} placeholder="BSC-CS" />
            </Field>
            <Field label="Level *">
              <select name="level" value={String(form.level)} onChange={handleChange}>
                {[4, 5, 6].map((l) => (
                  <option key={l} value={l}>Level {l}</option>
                ))}
              </select>
            </Field>
            <Field label="Semester">
              <select name="semester" value={String(form.semester)} onChange={handleChange}>
                {(semestersByLevel[String(form.level)] || ["1", "2"]).map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="previous">Previous</option>
                <option value="current">Current</option>
              </select>
            </Field>
            <Field label="Time Label">
              <input name="time_label" value={form.time_label} onChange={handleChange} placeholder="12 weeks" />
            </Field>
            <Field label="Instructor Email" className="col-span-2">
              <input name="instructor_email" value={form.instructor_email} onChange={handleChange} placeholder="instructor@university.edu" />
            </Field>
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* Description */}
        <section>
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
            Description
          </h2>
          <Field label="Description">
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Short module description..." />
          </Field>
        </section>

        <hr className="border-gray-100" />

        {/* Content */}
        <section>
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
            Content
          </h2>
          <div className="space-y-4">
            <Field label="Welcome Text">
              <textarea name="welcome_text" value={form.welcome_text} onChange={handleChange} rows={3} placeholder="Welcome message..." />
            </Field>
            <Field label="Overview Text">
              <textarea name="overview_text" value={form.overview_text} onChange={handleChange} rows={4} placeholder="Full module overview..." />
            </Field>
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* Media */}
        <section>
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
            Media
          </h2>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Column */}
              <div className="space-y-3">
                <Field label="Main Image URL (or upload below)">
                  <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://..." />
                </Field>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 text-center relative hover:bg-gray-100 hover:border-gray-400 transition-colors group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title="Upload Main Image"
                  />
                  <div className="pointer-events-none">
                    <p className="text-sm font-medium text-gray-700">Upload Main Image</p>
                    <p className="text-xs text-gray-400 mt-1">Drag & Drop or Click to browse</p>
                    {imageFile && (
                      <p className="text-xs font-semibold text-emerald-600 mt-3 bg-emerald-50 py-1 rounded inline-block px-3">
                        {imageFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Hero Image Column */}
              <div className="space-y-3">
                <Field label="Hero Image URL (or upload below)">
                  <input name="hero_image_url" value={form.hero_image_url} onChange={handleChange} placeholder="https://..." />
                </Field>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 text-center relative hover:bg-gray-100 hover:border-gray-400 transition-colors group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title="Upload Hero Image"
                  />
                  <div className="pointer-events-none">
                    <p className="text-sm font-medium text-gray-700">Upload Hero Image</p>
                    <p className="text-xs text-gray-400 mt-1">Drag & Drop or Click to browse</p>
                    {heroImageFile && (
                      <p className="text-xs font-semibold text-emerald-600 mt-3 bg-emerald-50 py-1 rounded inline-block px-3">
                        {heroImageFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* Learning Outcomes */}
        <section>
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
            Learning Outcomes
          </h2>
          <div className="space-y-2">
            {(form.learning_outcomes ?? [""]).map((item, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  className={`flex-1 ${inputCls}`}
                  value={item}
                  onChange={(e) => handleArrayChange("learning_outcomes", i, e.target.value)}
                  placeholder={`Outcome ${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeItem("learning_outcomes", i)}
                  className="text-gray-400 hover:text-gray-600 px-2 text-lg leading-none"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addItem("learning_outcomes")}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              + Add outcome
            </button>
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* People Photos */}
        <section>
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
            People Photos
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              {(form.people_photos ?? [""]).map((item, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    className={`flex-1 ${inputCls}`}
                    value={item}
                    onChange={(e) => handleArrayChange("people_photos", i, e.target.value)}
                    placeholder={`Photo URL ${i + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem("people_photos", i)}
                    className="text-gray-400 hover:text-gray-600 px-2 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addItem("people_photos")}
                className="text-sm text-gray-500 hover:text-gray-700 mt-1 cursor-pointer"
              >
                + Add photo URL
              </button>
            </div>

            {/* People Photos File Upload Box */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 text-center relative hover:bg-gray-100 hover:border-gray-400 transition-colors group">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setPeoplePhotosFiles(Array.from(e.target.files || []))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                title="Upload People Photos"
              />
              <div className="pointer-events-none">
                <p className="text-sm font-medium text-gray-700">Upload Team / People Photos</p>
                <p className="text-xs text-gray-400 mt-1">Select multiple files from your computer</p>
                {peoplePhotosFiles.length > 0 && (
                  <div className="mt-3">
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 py-1 px-3 rounded inline-block">
                      Selected {peoplePhotosFiles.length} file{peoplePhotosFiles.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <hr className="border-gray-100" />

        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* ═══ Weeks Section ═══ */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Weeks</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {weeks.length} week{weeks.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowNewWeek(!showNewWeek);
              setNewWeekForm(emptyWeekForm);
              setWeekError(null);
              setWeekSuccess(null);
            }}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-700 cursor-pointer"
          >
            {showNewWeek ? "Cancel" : "+ Add Week"}
          </button>
        </div>

        {weekError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">
            {weekError}
          </div>
        )}
        {weekSuccess && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-4 py-3">
            {weekSuccess}
          </div>
        )}

        {/* New Week Form */}
        {showNewWeek && (
          <div className="mb-6 border border-gray-200 rounded-lg p-5 bg-gray-50/50">
            <h3 className="text-sm font-medium text-gray-700 mb-4">New Week</h3>
            <WeekFormFields
              form={newWeekForm}
              setter={setNewWeekForm}
              inputCls={inputCls}
              onContentChange={handleWeekContentChange}
              onAddContent={addWeekContent}
              onRemoveContent={removeWeekContent}
              onResourceChange={handleWeekResourceChange}
              onAddResource={addWeekResource}
              onRemoveResource={removeWeekResource}
              onFieldChange={handleWeekFormChange}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => { setShowNewWeek(false); setWeekError(null); }}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateWeek}
                disabled={weekLoading}
                className="px-5 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
              >
                {weekLoading ? "Creating..." : "Create Week"}
              </button>
            </div>
          </div>
        )}

        {/* Weeks List */}
        {weeksFetching ? (
          <div className="text-sm text-gray-400 py-8 text-center">Loading weeks...</div>
        ) : weeks.length === 0 ? (
          <div className="text-sm text-gray-400 py-8 text-center border border-dashed border-gray-200 rounded">
            No weeks yet.
          </div>
        ) : (
          <div className="space-y-2">
            {weeks.map((w) => {
              const isExpanded = expandedWeek === w._id;
              const isEditing = editingWeek === w._id;

              return (
                <div
                  key={w._id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Week Header Row */}
                  <div
                    className="flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      if (isEditing) return;
                      setExpandedWeek(isExpanded ? null : (w._id ?? null));
                      setWeekError(null);
                      setWeekSuccess(null);
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono text-gray-400 shrink-0">
                        W{w.number}
                      </span>
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {w.title}
                      </span>
                      <span className="text-xs text-gray-400 shrink-0">
                        {w.contents?.length ?? 0} topics · {w.resources?.length ?? 0} resources
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!isEditing && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); startEditWeek(w); }}
                            className="text-xs hover:text-gray-800 px-2 py-1"
                            style={{ cursor: "pointer", color: "#6b7280" }}
                          >
                            Edit
                          </button>
                          {confirmDeleteWeek === w._id ? (
                            <span className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => handleDeleteWeek(w._id!)}
                                disabled={weekLoading}
                                className="text-xs text-white bg-red-600 hover:bg-red-700 rounded px-2 py-1 disabled:opacity-50"
                                style={{ cursor: "pointer" }}
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteWeek(null)}
                                className="text-xs border border-gray-300 rounded hover:bg-gray-100 px-2 py-1"
                                style={{ cursor: "pointer", color: "#6b7280" }}
                              >
                                Cancel
                              </button>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setConfirmDeleteWeek(w._id ?? null); }}
                              className="text-xs hover:text-red-700 px-2 py-1"
                              style={{ cursor: "pointer", color: "#ef4444" }}
                            >
                              Delete
                            </button>
                          )}
                        </>
                      )}
                      <span className={`text-gray-400 text-xs transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                        ▼
                      </span>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 px-4 py-4 bg-gray-50/30">
                      {isEditing ? (
                        <>
                          <WeekFormFields
                            form={weekForm}
                            setter={setWeekForm}
                            inputCls={inputCls}
                            onContentChange={handleWeekContentChange}
                            onAddContent={addWeekContent}
                            onRemoveContent={removeWeekContent}
                            onResourceChange={handleWeekResourceChange}
                            onAddResource={addWeekResource}
                            onRemoveResource={removeWeekResource}
                            onFieldChange={handleWeekFormChange}
                          />
                          <div className="flex justify-end gap-3 mt-4">
                            <button
                              type="button"
                              onClick={cancelEditWeek}
                              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => saveWeek(w._id!)}
                              disabled={weekLoading}
                              className="px-5 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
                            >
                              {weekLoading ? "Saving..." : "Save Week"}
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-4">
                          {/* Read-only week details */}
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Code</p>
                            <p className="text-sm text-gray-700 font-mono">{w.code}</p>
                          </div>
                          {w.contents && w.contents.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Contents</p>
                              <ul className="space-y-1">
                                {w.contents.map((c, i) => (
                                  <li key={i} className="text-sm text-gray-700 flex gap-2">
                                    <span className="text-gray-400 shrink-0">{i + 1}.</span>
                                    {c}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {w.resources && w.resources.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Resources</p>
                              <ul className="space-y-1">
                                {w.resources.map((r, i) => (
                                  <li key={i} className="text-sm flex gap-2">
                                    <span className="text-gray-700">{r.name}</span>
                                    <span className="text-gray-300">—</span>
                                    <a
                                      href={r.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline truncate"
                                    >
                                      {r.link}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Reusable Week Form Fields ─── */

function WeekFormFields({
  form,
  setter,
  inputCls,
  onContentChange,
  onAddContent,
  onRemoveContent,
  onResourceChange,
  onAddResource,
  onRemoveResource,
  onFieldChange,
}: {
  form: WeekForm;
  setter: React.Dispatch<React.SetStateAction<WeekForm>>;
  inputCls: string;
  onContentChange: (s: React.Dispatch<React.SetStateAction<WeekForm>>, i: number, v: string) => void;
  onAddContent: (s: React.Dispatch<React.SetStateAction<WeekForm>>) => void;
  onRemoveContent: (s: React.Dispatch<React.SetStateAction<WeekForm>>, i: number) => void;
  onResourceChange: (s: React.Dispatch<React.SetStateAction<WeekForm>>, i: number, f: "name" | "link", v: string) => void;
  onAddResource: (s: React.Dispatch<React.SetStateAction<WeekForm>>) => void;
  onRemoveResource: (s: React.Dispatch<React.SetStateAction<WeekForm>>, i: number) => void;
  onFieldChange: (s: React.Dispatch<React.SetStateAction<WeekForm>>, e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Core fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Week Number *</label>
          <input
            type="number"
            name="number"
            value={form.number}
            onChange={(e) => onFieldChange(setter, e)}
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
            onChange={(e) => onFieldChange(setter, e)}
            placeholder="WEEK-01"
            className={inputCls}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-gray-500 mb-1">Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={(e) => onFieldChange(setter, e)}
            placeholder="e.g. Introduction to Variables"
            className={inputCls}
          />
        </div>
      </div>

      {/* Contents */}
      <div>
        <label className="block text-xs text-gray-500 mb-2">Contents</label>
        <div className="space-y-2">
          {form.contents.map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={item}
                onChange={(e) => onContentChange(setter, i, e.target.value)}
                placeholder={`Topic ${i + 1}`}
                className={`flex-1 ${inputCls}`}
              />
              <button
                type="button"
                onClick={() => onRemoveContent(setter, i)}
                className="text-gray-400 hover:text-gray-600 px-2 text-lg leading-none"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onAddContent(setter)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            + Add content
          </button>
        </div>
      </div>

      {/* Resources */}
      <div>
        <label className="block text-xs text-gray-500 mb-2">Resources</label>
        <div className="space-y-2">
          {form.resources.map((res, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={res.name}
                onChange={(e) => onResourceChange(setter, i, "name", e.target.value)}
                placeholder="Name"
                className={`flex-1 ${inputCls}`}
              />
              <input
                value={res.link}
                onChange={(e) => onResourceChange(setter, i, "link", e.target.value)}
                placeholder="https://..."
                className={`flex-1 ${inputCls}`}
              />
              <button
                type="button"
                onClick={() => onRemoveResource(setter, i)}
                className="text-gray-400 hover:text-gray-600 px-2 text-lg leading-none"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onAddResource(setter)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            + Add resource
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Field wrapper ─── */

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactElement;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      {(() => {
        const child = children as React.ReactElement<React.HTMLProps<HTMLElement>>;
        const tag = child.type as string;
        const base =
          "w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 bg-white";
        const extra = tag === "textarea" ? " resize-none" : "";
        return { ...child, props: { ...child.props, className: base + extra } };
      })()}
    </div>
  );
}
