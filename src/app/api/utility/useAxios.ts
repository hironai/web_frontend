import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosHeaders } from "axios";
import { CONTENT_TYPE, HOST_URL, Main_URL } from "../constants";

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  contentType?: string;
}

const contentType = (req: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  let token = `Bearer ${localStorage.getItem("token")}`;
  
  if (!req.headers) {
    req.headers = new AxiosHeaders();
  }
  
  req.headers.set("Authorization", token);

  if (req.headers.get("Content-Type") === CONTENT_TYPE.formData && req.data) {
    let json = req.data;
    let keys = Object.keys(json);
    let formData = new FormData();
    keys.forEach((key) => {
      formData.append(key, json[key]);
    });
    req.data = formData;
  }
  return req;
};

export const useAxios = (): AxiosInstance => {
  const baseURL = Main_URL.url;
  const axiosInterceptor = axios.create({ baseURL });

  axiosInterceptor.interceptors.request.use(
    (req: InternalAxiosRequestConfig) => {
      console.log(req);
      return contentType(req);
    }
  );

  axiosInterceptor.interceptors.response.use(
    function (response: AxiosResponse) {
      console.log(response, "respAxios");
      return response;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  return axiosInterceptor;
};