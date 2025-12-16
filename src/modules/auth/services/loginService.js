import { nodeApi } from "../../../core/service/apiService"; // reuse axios instances + interceptors

const loginApi = {
    recruiterLogin: (email, password) => nodeApi.post("/recruiter-auth/recruiter-login", { email, password }),
    getRecruiterDetails: (email) =>
        nodeApi.post(
            `/getdetails/users?email=${email}`,
            {},
        ),
    resendVerification: (user_id) => nodeApi.post("/recruiter-auth/recruiter-resend-verification", { user_id }),
    forgotPassword: (email) =>
        nodeApi.post(`/candidate-auth/candidate-forgot-password?email=${email}`),

};

export default loginApi;
