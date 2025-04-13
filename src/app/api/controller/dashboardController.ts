import { CONTENT_TYPE, MODULE_URL, REQUEST_URL } from "../constants";
import { useAxios } from "../utility/useAxios";
import { AxiosRequestConfig, AxiosResponse } from "axios";

const axiosInterceptor = useAxios();

interface ApiResponse {
  data?: any;
  status: number;
  message?: string;
}

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  contentType?: string;
}


export const getDashboard_API = async (): Promise<ApiResponse> => {
  try {
    const config: CustomAxiosRequestConfig = {
      url: MODULE_URL.dashboard,
      method: "GET",
      headers: { "Content-Type": CONTENT_TYPE.application_Json },
      withCredentials: true,
    };
    const response: AxiosResponse = await axiosInterceptor(config);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const getEmployees_API = async (params: Record<string, string | number> = {}): Promise<ApiResponse> => {
  try {
    // ✅ Convert all params values to strings
    const queryParams = Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    );

    const queryString = new URLSearchParams(queryParams).toString();

    const config: CustomAxiosRequestConfig = {
      url: `${MODULE_URL.dashboard + REQUEST_URL.employees}?${queryString}`,
      method: "GET",
      headers: { "Content-Type": CONTENT_TYPE.application_Json },
      withCredentials: true,
    };

    const response: AxiosResponse = await axiosInterceptor(config);
    return response;
  } catch (error: any) {
    return error.response;
  }
};


export const inviteEmployees_API = async (employees: { email: string; name: string }[]): Promise<ApiResponse> => {
  try {
    const config: CustomAxiosRequestConfig = {
      url: MODULE_URL.dashboard + REQUEST_URL.employees_invite,
      method: "POST",
      headers: { "Content-Type": CONTENT_TYPE.application_Json },
      data: { employees },
      withCredentials: true,
    };
    const response: AxiosResponse = await axiosInterceptor(config);
    return response;
  } catch (error: any) {
    return error.response;
  }
};


export const deleteEmployee_API = async (employeeId: string): Promise<ApiResponse> => {
  try {
    const config: CustomAxiosRequestConfig = {
      url: `${MODULE_URL.dashboard + REQUEST_URL.employees}?employeeId=${encodeURIComponent(employeeId)}`,
      method: "DELETE",
      headers: { "Content-Type": CONTENT_TYPE.application_Json },
      withCredentials: true,
    };
    const response: AxiosResponse = await axiosInterceptor(config);
    return response;
  } catch (error: any) {
    return error.response;
  }
};


export const onboardEmployees_API = async (employees: { email: string; name: string }[]): Promise<ApiResponse> => {
  try {
    const config: CustomAxiosRequestConfig = {
      url: MODULE_URL.dashboard + REQUEST_URL.employees_onboard,
      method: "POST",
      headers: { "Content-Type": CONTENT_TYPE.application_Json },
      data: { employees },
      withCredentials: true,
    };
    const response: AxiosResponse = await axiosInterceptor(config);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const updateSettings_API = async (data:any[]): Promise<ApiResponse> => {
  try {
    const config: CustomAxiosRequestConfig = {
      url: MODULE_URL.dashboard,
      method: "PUT",
      headers: { "Content-Type": CONTENT_TYPE.application_Json },
      data: { ...data },
      withCredentials: true,
    };
    const response: AxiosResponse = await axiosInterceptor(config);
    return response;
  } catch (error: any) {
    return error.response;
  }
};


export const saveEmployees_API = async (candidateId: string): Promise<ApiResponse> => {
  try {
    const queryString = new URLSearchParams({candidate:candidateId}).toString();

    const config: CustomAxiosRequestConfig = {
      url: `${MODULE_URL.dashboard + REQUEST_URL.shortlist}?${queryString}`,
      method: "PUT",
      headers: { "Content-Type": CONTENT_TYPE.application_Json },
      withCredentials: true,
    };

    const response: AxiosResponse = await axiosInterceptor(config);
    return response;
  } catch (error: any) {
    return error.response;
  }
};


export const getSavedCandidate_API = async (): Promise<ApiResponse> => {
  try {
    const config: CustomAxiosRequestConfig = {
      url: `${MODULE_URL.dashboard + REQUEST_URL.shortlist}`,
      method: "GET",
      headers: { "Content-Type": CONTENT_TYPE.application_Json },
      withCredentials: true,
    };

    const response: AxiosResponse = await axiosInterceptor(config);
    return response;
  } catch (error: any) {
    return error.response;
  }
};


export const updateCandidate_API = async (data:any): Promise<ApiResponse> => {
  try {
    const config: CustomAxiosRequestConfig = {
      url: MODULE_URL.dashboard,
      method: "PUT",
      headers: { "Content-Type": CONTENT_TYPE.application_Json },
      data: { ...data },
      withCredentials: true,
    };
    const response: AxiosResponse = await axiosInterceptor(config);
    return response;
  } catch (error: any) {
    return error.response;
  }
};