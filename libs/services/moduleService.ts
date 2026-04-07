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

const getModuleByCode = async (code: string) => {
  try {
    const response = await api.get(`/modules/by-code/${code}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching module by code:", error);
  }
};

const getWeekData = async(code:string)=>{
  try{
    const response =  await api.get(`/modules/${code}/weeks`);
    return response.data;
  } catch (error) {
    console.error("Error fetching week data:", error);
  }
}

export { getModules, getModuleByCode,getWeekData };
