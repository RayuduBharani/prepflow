import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { LogIn } from "lucide-react";

const LoginAlert = async ({userId} : {userId? : string}) => {
  if (userId) {
    return null;
  }
  return (
    <Alert className="mb-4 items-center"> {/* Added variant for visual emphasis */}
    <LogIn className="h-4 w-4" />
      <AlertTitle className="text-muted-foreground text-sm">Login Required!</AlertTitle>
      <AlertDescription className="text-muted-foreground text-xs">
      You need to log in to access your saved progress.
      </AlertDescription>
    </Alert>
  );
};

export default LoginAlert;