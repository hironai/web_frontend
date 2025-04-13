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

export const login_API = async (body: Record<string, any>): Promise<ApiResponse> => {
  try {
    const config: CustomAxiosRequestConfig = {
      url: MODULE_URL.auth + REQUEST_URL.login,
      method: "POST",
      data: body,
      headers: { "Content-Type": CONTENT_TYPE.application_Json },
      withCredentials: true,
    };
    const response: AxiosResponse = await axiosInterceptor(config);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const signup_API = async (body: Record<string, any>): Promise<ApiResponse> => {
  try {
    const config: CustomAxiosRequestConfig = {
      url: MODULE_URL.auth + REQUEST_URL.signup,
      method: "POST",
      data: body,
      headers: { "Content-Type": CONTENT_TYPE.application_Json },
    };
    const response: AxiosResponse = await axiosInterceptor(config);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const verifyOTP_API = async (body: Record<string, any>): Promise<ApiResponse> => {
  try {
    const config: CustomAxiosRequestConfig = {
      url: MODULE_URL.auth + REQUEST_URL.verify,
      method: "POST",
      data: body,
      headers: { "Content-Type": CONTENT_TYPE.application_Json },
      withCredentials: true,
    };
    const response: AxiosResponse = await axiosInterceptor(config);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const resendOTP_API = async (body: Record<string, any>): Promise<ApiResponse> => {
  try {
    const config: CustomAxiosRequestConfig = {
      url: MODULE_URL.auth + REQUEST_URL.sendotp,
      method: "POST",
      data: body,
      headers: { "Content-Type": CONTENT_TYPE.application_Json },
    };
    const response: AxiosResponse = await axiosInterceptor(config);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const resetPassword_API = async (data:any[]): Promise<ApiResponse> => {
  try {
    const config: CustomAxiosRequestConfig = {
      url: MODULE_URL.auth + REQUEST_URL.resetPassword,
      method: "PUT",
      data: {...data},
      headers: { "Content-Type": CONTENT_TYPE.application_Json },
      withCredentials: true,
    };
    const response: AxiosResponse = await axiosInterceptor(config);
    return response;
  } catch (error: any) {
    return error.response;
  }
};


export const setResetPassword_API = async (data:any[]): Promise<ApiResponse> => {
  try {
    const config: CustomAxiosRequestConfig = {
      url: MODULE_URL.auth + REQUEST_URL.setResetPassword,
      method: "POSt",
      data: {...data},
      headers: { "Content-Type": CONTENT_TYPE.application_Json },
      withCredentials: true,
    };
    const response: AxiosResponse = await axiosInterceptor(config);
    return response;
  } catch (error: any) {
    return error.response;
  }
};


export const logoutUser_API = async (): Promise<ApiResponse> => {
  try {
    const config: CustomAxiosRequestConfig = {
      url: MODULE_URL.auth + REQUEST_URL.logout,
      method: "POST",
      headers: { "Content-Type": CONTENT_TYPE.application_Json },
      withCredentials: true,
    };
    const response: AxiosResponse = await axiosInterceptor(config);
    return response;
  } catch (error: any) {
    return error.response;
  }
};


export const deleteAccount_API = async (): Promise<ApiResponse> => {
  try {
    const config: CustomAxiosRequestConfig = {
      url: MODULE_URL.auth + REQUEST_URL.delete,
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


export const getProfile_API = async ( userName?: string ): Promise<ApiResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (userName) queryParams.append("userName", userName);

    const queryString = queryParams.toString();
    const url = `${MODULE_URL.profile}${queryString ? `?${queryString}` : ""}`;

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