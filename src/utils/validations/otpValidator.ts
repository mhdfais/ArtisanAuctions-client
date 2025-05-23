import * as yup from "yup";

export const OtpInitialValues = {
  otp: "",
};

export const otpValidationSchema = yup.object({
  otp: yup
    .string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});
