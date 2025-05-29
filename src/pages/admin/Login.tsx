
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import * as yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import useToast from "@/hooks/useToast";
import { login } from "@/services/adminService";
import { useDispatch } from "react-redux";
import { setAdmin } from "@/redux/store/adminAuthSlice";

const AdminLogin = () => {
  const dispatch=useDispatch()
  const navigate = useNavigate();
  const{error,success}=useToast()

  const handleLogin = async (values:{email:string,password:string}) => {
    try {
      const res=await login(values.email,values.password)
      if(res.status===200){
        const{user}=res.data
        dispatch(setAdmin(user))
        navigate('/admin/dashboard')
        success('Success','Login Successfull')
      }
    } catch (err) {
      error('Error','Invalid credentials')
    }
  };

  const validationSchema = yup.object({
    email: yup
      .string()
      .trim()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-xl">AA</span>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">
            Admin Portal
          </CardTitle>
          <p className="text-slate-600">Access your admin dashboard</p>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleLogin(values);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-slate-700">
                    Email
                  </Label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="admin@artisanauctions.com"
                    className="mt-1 border-slate-300 focus:border-amber-500 focus:ring-amber-500 w-full rounded-md border px-3 py-2"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-slate-700">
                    Password
                  </Label>
                  <Field
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="mt-1 border-slate-300 focus:border-amber-500 focus:ring-amber-500 w-full rounded-md border px-3 py-2"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  className="mb-5 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
