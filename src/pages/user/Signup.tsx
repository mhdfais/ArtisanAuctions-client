
import SignupForm from "@/components/user/SignupForm";

const Signup = () => {
  return (
    <div className="h-screen flex flex-col bg-[#F9F6F1]">
      <main className="flex-grow flex items-center justify-center py-2 sm:py-4 md:py-6 px-4">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
          <SignupForm />
        </div>
      </main>
    </div>
  );
};

export default Signup;
