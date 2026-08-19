// import axios from "axios";

// export interface SendOtpResponse {
//   success: boolean;
//   message: string;
//   data?: unknown;
// }

// export interface VerifyOtpResponse {
//   success: boolean;
//   message: string;
//   user?: {
//     mobile: string;
//   };
// }

// export const sendOtp = async (
//   mobile: string
// ): Promise<SendOtpResponse> => {
//   const response = await axios.post<SendOtpResponse>(
//     "/api/auth/send-otp",
//     {
//       mobile,
//     }
//   );

//   return response.data;
// };

// export const verifyOtp = async (
//   mobile: string,
//   otp: string
// ): Promise<VerifyOtpResponse> => {
//   const response = await axios.post<VerifyOtpResponse>(
//     "/api/auth/verify-otp",
//     {
//       mobile,
//       otp,
//     }
//   );

//   return response.data;
// };