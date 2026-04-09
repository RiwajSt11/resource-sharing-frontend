import api from "../axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getModules = async () => {
  try {
    const res = await fetch(`${BASE_URL}/modules`, {
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch modules");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching modules:", error);
  }
};

const getModuleByCode = async (code: string) => {
  try {
    const response = await fetch(`${BASE_URL}/modules/by-code/${code}`);
    if (!response.ok) {
      throw new Error("Failed to fetch module by code");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching module by code:", error);
  }
};

const postRequest = async (requestData: {
  teacherEmail: string;
  studentEmail: string;
  module: string;
  reason: string;
}) => {
  const payload = {
    requestTo: requestData.teacherEmail,
    collegeEmail: requestData.studentEmail,
    module: requestData.module,
    reason: requestData.reason,
  };

  try {
    const response = await api.post("/module-resources/request", payload);
    return response.data;
  } catch (error) {
    console.error("Error submitting request:", error);
    throw error;
  }
};

export { getModules, getModuleByCode, postRequest };
