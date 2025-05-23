import * as yup from "yup";
import { SignupFormValues } from "../../types/Types";



export const signupSchema = yup.object({
  name: yup.string().trim().min(3, "Too short...").required("Name is required"),
  email: yup
    .string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),
  password: yup
    .string()
    .trim()
    .min(4, "Minimum 4 characters required")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .trim()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  terms: yup.boolean().oneOf([true], "You must agree to the Terms of Service"),
});

export const signupInitialValues: SignupFormValues  = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  terms: false,
};
