import * as yup from "yup";

export const loginInitialValues = {
  email: "",
  password: "",
};

export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Invalid password")
    .required("Email is required"),
  password: yup
    .string()
    .trim()
    .min(6, "Min 6 characters required")
    .required("Password is required"),
});
