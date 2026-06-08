import { SignUp } from "@clerk/nextjs"

export default function SignupPage() {
    return (
        <main 
            className="flex min-h-screen w-full items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/Bg Wall.jpeg')" }}
        >
            <SignUp
                routing="hash"
                fallbackRedirectUrl="/dashboard"
                signInUrl="/login"
            />
        </main>
    )
}
