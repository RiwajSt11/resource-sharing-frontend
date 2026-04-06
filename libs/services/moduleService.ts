import api from "../axios";

const getModules = async () => {
  try {
    const response = await api.get("/modules");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching modules:", error);
  }
};

export default getModules
