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

// export const getTemplate_API = async (): Promise<ApiResponse> => {
//   try {
//     const config: CustomAxiosRequestConfig = {
//       url: MODULE_URL.templates,
//       method: "GET",
//     //   data: body,
//       headers: { "Content-Type": CONTENT_TYPE.application_Json },
//       withCredentials: true,
//     };
//     const response: AxiosResponse = await axiosInterceptor(config);
//     return response;
//   } catch (error: any) {
//     return error.response;
//   }
// };

export const getTemplate_API = async (
  slug?: string,
  profile?: string
): Promise<ApiResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (slug) queryParams.append("slug", slug);
    if (profile) queryParams.append("profile", profile);

    const queryString = queryParams.toString();
    const url = `${MODULE_URL.templates}${queryString ? `?${queryString}` : ""}`;

    const config: CustomAxiosRequestConfig = {
      url,
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
