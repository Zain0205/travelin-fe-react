import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "./components/LoginForm"
import login from "@/assets/images/login.jpg"

function Login() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Travelin
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full md:max-w-1/2">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src={login}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] "
        />
      </div>
    </div>)
}

export default Login
