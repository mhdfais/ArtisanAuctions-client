
import LoginForm from "@/components/user/LoginForm";

const Login = () => {
  return (
    <div className="h-screen flex flex-col bg-[#F9F6F1]">
      <main className="flex-grow flex items-center justify-center py-2 sm:py-4 md:py-6 px-4">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
          <LoginForm />
        </div>
      </main>
    </div>
  );
};

export default Login;
