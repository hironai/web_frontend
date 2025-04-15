export class HOST_URL {
  // static url = "http://localhost:5000";
  static url = "https://api.hironai.com";
  // static url = "https://internal.hironai.com";
}

export class BASE_URL {
  static url = "/api";
}

export class Main_URL {
  static url = HOST_URL.url + BASE_URL.url;
}

export class MODULE_URL {
  static auth = "/auth";
  static templates = "/templates";
  static dashboard = "/dashboard";
  static search = "/search";
  static profile = "/profile";
  static feedback = "/feedback";
}

export class REQUEST_URL {
  static login = "/sign-in";
  static signup = "/sign-up";
  static verify = "/verify-account";
  static sendotp = "/send-otp";
  static setPassword = "/set-password";
  static resetPassword = "/reset-password"
  static setResetPassword = "/set-password"
  static delete = "/delete";
  static logout = "/logout";
  static history = "/history";
  static employees = "/employees";
  static employees_invite = "/employees/resend-invite";
  static employees_onboard = "/employees/onboard";
  static shortlist = "/shortlist";
}

export class CONTENT_TYPE {
  static application_Json = "application/json";
  static formData = "formdata";
}

export class SEVERITY {
  static success = "success";
  static info = "info";
  static warning = "warning";
  static error = "error";
}