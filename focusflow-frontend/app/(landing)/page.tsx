import { COLORS } from "../lib/styles";
import SignupLoginBtn from "../(app)/_components/buttons/signup-login-btn";

export default function LandingPage() {
  return (
    <div className="max-w-xl w-full text-center space-y-6">
      <h1 className="text-4xl md:text-5xl font-bold text-white">FocusFlow</h1>
      <p className={`${COLORS.textSecondary} text-base md:text-lg`}>
        A calm productivity dashboard for freelancers and solopreneurs.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
        <SignupLoginBtn href="/login" label="Login" />
        <SignupLoginBtn href="/signup" label="Signup" />
      </div>
    </div>
  );
}
