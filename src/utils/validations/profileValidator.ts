import * as yup from 'yup'



 export const profileValidationSchema = yup.object({
    name: yup.string().required("Name is required"),
    phone: yup.string().required("Phone number is required"),
    bio: yup.string(),
    profileImage: yup.mixed()
      .nullable()
      .test("fileSize", "File too large", (value) =>
        value instanceof File ? value.size <= 2 * 1024 * 1024 : true
      )
      .test("fileType", "Unsupported file type", (value) =>
        value instanceof File
          ? ["image/jpeg", "image/png", "image/gif"].includes(value.type)
          : true
      ),
  });