import { postRequest } from "@/libs/services/moduleService";
import { useEffect, useState } from "react";

interface Props {
  submitOpen: boolean;
  setSubmitOpen: (value: boolean) => void;
}

interface FormData {
  teacherEmail: string;
  studentEmail: string;
  module: string;
  reason: string;
}

export const SubmitRequest = ({ submitOpen, setSubmitOpen }: Props) => {
  const categories = [
    "High Performance Computing",
    "Project and Professionalism",
    "Complex System",
  ];
  useEffect(() => {
    if (submitOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [submitOpen]);

  const [formData, setFormData] = useState({
    teacherEmail: "",
    studentEmail: "",
    module: "",
    reason: "",
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleCategoryChange = (category: string) => {
    if (formData.module === category) {
      setFormData({
        ...formData,
        module: "",
      });
      return;
    }
    setFormData({
      ...formData,
      module: category,
    });
  };
  const handleClear = () => {
    setFormData({
      teacherEmail: "",
      studentEmail: "",
      reason: "",
      module: "",
    });
    setSubmitOpen(false);
  };
  const handleSubmit = async (formData: FormData) => {
    if (!formData.teacherEmail || !formData.studentEmail || !formData.module) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await postRequest(formData);
      alert("Request submitted successfully!");
      handleClear();
    } catch (error) {
      alert("Failed to submit request. Please try again.");
    }
  };
  return (
    <>
      <div
        className={`fixed top-0 right-0 w-full md:w-[34.4%] h-screen transition-transform duration-500 z-50 bg-[#77C144] ${submitOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <h1 className="text-white mt-9.75 ml-9 text-[19px] font-medium">
          Request Resources
        </h1>
        <div className="mt-7.75 bg-white rounded-2xl h-full">
          <div>
            <h4 className="pt-10.5 ml-7 text-[13.5px] text-black/70 tracking-tighter">
              To <span className="text-red-400">*</span>
            </h4>
            <input
              type="email"
              name="teacherEmail"
              className="ml-6.75 mt-1.5 text-black placeholder:text-black/30 border border-gray-300 focus:outline-none w-[88.5%] px-4 py-2 rounded-full text-[13px]"
              placeholder="Teacher's Email"
              value={formData.teacherEmail}
              onChange={handleChange}
              required
            ></input>
          </div>
          <div>
            <h4 className="pt-3.75 ml-7 text-[14px] text-black/70 tracking-tighter">
              Your College Provided Email
            </h4>
            <input
              type="email"
              name="studentEmail"
              className="ml-6.75 mt-1.5 text-black placeholder:text-black/30 border border-gray-300 focus:outline-none w-[88.5%] px-4 py-3 rounded-full text-[13px]"
              placeholder="heraldcollege.edu.np"
              value={formData.studentEmail}
              onChange={handleChange}
            ></input>
            <div>
              <h4 className="pt-3.75 ml-7 text-[14px] text-black/70 tracking-tighter">
                Module <span className="text-red-400">*</span>
              </h4>
              <div className="ml-6.75 flex flex-wrap gap-1.5 gap-y-0">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className={`mt-1.5 placeholder:text-black/30 border border-gray-300 focus:outline-none px-4 py-2 rounded-3xl text-[13px] text-black/30 cursor-pointer transition-colors duration-300 ${formData.module === category ? "bg-primary text-white" : ""}`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="pt-4 ml-7 text-[14px] text-black/70 tracking-tighter">
                Reason for Resources
              </h4>
              <textarea
                name="reason"
                className="ml-6.75 mt-1.5 text-black placeholder:text-black/30 border border-gray-300 focus:outline-none w-[88.5%] h-19.75 px-4 py-2.5 rounded-2xl text-[12.5px] resize-none"
                placeholder="Please provide a reason for your request"
                value={formData.reason}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="flex justify-start mt-3 ml-6.75 gap-2">
              <button
                className="border border-primary text-black/60 py-2 px-5.5 rounded-full text-[13.5px] tracking-tight font-semibold bg-white focus:outline-none hover:text-white hover:bg-primary transition-colors duration-500 cursor-pointer"
                onClick={() => {
                  handleSubmit(formData);
                }}
              >
                Submit Request
              </button>
              <button
                className="bg-[#DF6B6B] py-2 px-5 rounded-full text-[13.5px] tracking-tight font-semibold focus:outline-none text-white hover:bg-red-500 transition-colors duration-500 cursor-pointer"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
      {submitOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSubmitOpen(false)}
        ></div>
      )}
    </>
  );
};
