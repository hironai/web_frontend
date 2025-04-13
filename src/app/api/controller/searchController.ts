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


export const searchCandidate_API = async (data:any): Promise<ApiResponse> => {
  try {
    const config: CustomAxiosRequestConfig = {
      url: `${MODULE_URL.search}`,
      method: "POST",
      data: { ...data },
      headers: { "Content-Type": CONTENT_TYPE.application_Json },
      withCredentials: true,
    };

    const response: AxiosResponse = await axiosInterceptor(config);
    return response;
  } catch (error: any) {
    return error.response;
  }
};
