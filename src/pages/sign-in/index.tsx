import { Link } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";
import SignInCard from "./components/sign-in-card";

export default function SignIn() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="p-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <IconArrowLeft className="size-4" />
          Back to home
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 pb-12">
        <SignInCard />
      </div>
    </div>
  );
}
