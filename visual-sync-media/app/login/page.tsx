import { SignIn } from "@clerk/nextjs"

export default function LoginPage() {
    return (
        <main 
            className="flex min-h-screen w-full items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/Bg Wall.jpeg')" }}
        >
            <SignIn
                routing="hash"
                forceRedirectUrl="/dashboard"
                signUpUrl="/signup"
            />
        </main>
    )
}
