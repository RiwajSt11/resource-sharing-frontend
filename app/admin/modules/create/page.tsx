"use client";

import { createModule } from "@/libs/services/moduleService";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ModuleForm {
  name: string;
  code: string;
  course: string;
  course_code: string;
  description: string;
  semester: "1" | "2" | "3" | "4" | "5" | "6";
  parent_id: string;
  level: "4" | "5" | "6";
  status: "previous" | "current";
  image_url: string;
  time_label: string;
  hero_image_url: string;
  instructor_email: string;
  welcome_text: string;
  overview_text: string;
  learning_outcomes: string[];
  people_photos: string[];
}

const initialForm: ModuleForm = {
  name: "",
  code: "",
  course: "",
  course_code: "",
  description: "",
  semester: "1",
  parent_id: "",
  level: "4",
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

const semestersByLevel: Record<string, string[]> = {
  "4": ["1", "2"],
  "5": ["3", "4"],
  "6": ["5", "6"],
};

export default function CreateModulePage() {
  const router = useRouter();
  const [form, setForm] = useState<ModuleForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [peoplePhotosFiles, setPeoplePhotosFiles] = useState<File[]>([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "level") {
      const semesters = semestersByLevel[value] || ["1", "2"];
      setForm((f) => ({
        ...f,
        level: value as ModuleForm["level"],
        semester: (semesters.includes(f.semester) ? f.semester : semesters[0]) as ModuleForm["semester"],
      }));
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleArrayChange = (
    field: "learning_outcomes" | "people_photos",
    index: number,
    value: string,
  ) => {
    setForm((f) => {
      const arr = [...f[field]];
      arr[index] = value;
      return { ...f, [field]: arr };
    });
  };

  const addItem = (field: "learning_outcomes" | "people_photos") =>
    setForm((f) => ({ ...f, [field]: [...f[field], ""] }));

  const removeItem = (
    field: "learning_outcomes" | "people_photos",
    index: number,
  ) =>
    setForm((f) => {
      const arr = [...f[field]];
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
      if (form.parent_id === "") fd.delete("parent_id");
      if (imageFile) fd.append("image_url", imageFile);
      if (heroImageFile) fd.append("hero_image_url", heroImageFile);
      if (peoplePhotosFiles.length > 0) {
        peoplePhotosFiles.forEach((file) => fd.append("people_photos", file));
      }

      await createModule(fd);
      setSuccess(true);
      setForm(initialForm);
      setImageFile(null);
      setHeroImageFile(null);
      setPeoplePhotosFiles([]);
      router.push("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create module.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Create Module</h1>
        <p className="text-sm text-gray-500 mt-1">
          Add a new module to the system.
        </p>
      </div>

      {error && (
        <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-4 py-3">
          Module created successfully.
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
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Introduction to Computing"
              />
            </Field>
            <Field label="Code *">
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                required
                placeholder="CS101"
              />
            </Field>
            <Field label="Course">
              <input
                name="course"
                value={form.course}
                onChange={handleChange}
                placeholder="Course name"
              />
            </Field>
            <Field label="Course Code">
              <input
                name="course_code"
                value={form.course_code}
                onChange={handleChange}
                placeholder="BSC-CS"
              />
            </Field>
            <Field label="Level *">
              <select name="level" value={form.level} onChange={handleChange}>
                {(["4", "5", "6"] as const).map((l) => (
                  <option key={l} value={l}>
                    Level {l}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Semester">
              <select
                name="semester"
                value={form.semester}
                onChange={handleChange}
              >
                {(semestersByLevel[form.level] || ["1", "2"]).map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
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
              <input
                name="time_label"
                value={form.time_label}
                onChange={handleChange}
                placeholder="12 weeks"
              />
            </Field>
            <Field label="Instructor Email" className="col-span-2">
              <input
                name="instructor_email"
                value={form.instructor_email}
                onChange={handleChange}
                placeholder="instructor@university.edu"
              />
            </Field>
            <Field label="Parent Module ID" className="col-span-2">
              <input
                name="parent_id"
                value={form.parent_id}
                onChange={handleChange}
                placeholder="UUID (optional)"
              />
            </Field>
          </div>
        </section>

        <Divider />

        {/* Description */}
        <section>
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
            Description
          </h2>
          <Field label="Description">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Short module description..."
            />
          </Field>
        </section>

        <Divider />

        {/* Content */}
        <section>
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
            Content
          </h2>
          <div className="space-y-4">
            <Field label="Welcome Text">
              <textarea
                name="welcome_text"
                value={form.welcome_text}
                onChange={handleChange}
                rows={3}
                placeholder="Welcome message..."
              />
            </Field>
            <Field label="Overview Text">
              <textarea
                name="overview_text"
                value={form.overview_text}
                onChange={handleChange}
                rows={4}
                placeholder="Full module overview..."
              />
            </Field>
          </div>
        </section>

        <Divider />

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
                  <input
                    name="image_url"
                    value={form.image_url}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
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
                  <input
                    name="hero_image_url"
                    value={form.hero_image_url}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
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

        <Divider />

        {/* Learning Outcomes */}
        <section>
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
            Learning Outcomes
          </h2>
          <div className="space-y-2">
            {form.learning_outcomes.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
                  value={item}
                  onChange={(e) =>
                    handleArrayChange("learning_outcomes", i, e.target.value)
                  }
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
              className="text-sm text-gray-500 hover:text-gray-700 mt-1"
            >
              + Add outcome
            </button>
          </div>
        </section>

        <Divider />

        {/* People Photos */}
        <section>
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
            People Photos
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              {(form.people_photos ?? [""]).map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
                    value={item}
                    onChange={(e) =>
                      handleArrayChange("people_photos", i, e.target.value)
                    }
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
                className="text-sm text-gray-500 hover:text-gray-700 mt-1"
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

        <Divider />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setForm(initialForm)}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Creating..." : "Create Module"}
          </button>
        </div>
      </form>
    </div>
  );
}

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
      {/* Clone child to inject shared input classes */}
      {(() => {
        const child = children as React.ReactElement<
          React.HTMLProps<HTMLElement>
        >;
        const tag = child.type as string;
        const base =
          "w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 bg-white";
        const extra = tag === "textarea" ? " resize-none" : "";
        return {
          ...child,
          props: { ...child.props, className: base + extra },
        };
      })()}
    </div>
  );
}

function Divider() {
  return <hr className="border-gray-100" />;
}
