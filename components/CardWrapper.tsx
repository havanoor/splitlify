import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { Form, json, Link, useLoaderData, useNavigate } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { generateAuthUrl } from "~/lib/googleLogin";

type CardProps = {
  children: React.ReactNode;
  header: string;
  footerLabel: string;
  footerHref: string;
  googleLogin?: string;
};

export default function CardWrapper({
  children,
  header = "Set an Header",
  footerHref,
  footerLabel,
  googleLogin,
}: CardProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gray-50/50">
      <Card className="w-full max-w-md bg-card/90 backdrop-blur-xl border border-border shadow-xl rounded-3xl overflow-hidden mt-8 md:mt-0">
        <div className="flex flex-col w-full items-center justify-center pt-8 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <span className="text-primary font-bold text-2xl">s</span>
          </div>
          <h1 className="font-bold text-2xl text-foreground tracking-tight">{header}</h1>
          <p className="text-muted-foreground text-sm mt-2">Welcome back to splitlify</p>
        </div>
        <CardContent className="px-8 pb-8">
          <div className="flex flex-col gap-y-6">
            {children}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-input" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <a href={googleLogin} className="w-full">
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 rounded-xl border-input bg-card text-foreground/80 hover:bg-muted hover:text-foreground font-medium transition-all shadow-sm"
              >
                <FcGoogle className="h-5 w-5 mr-3" />
                Google
              </Button>
            </a>
          </div>
        </CardContent>
        <CardFooter className="px-8 pb-8 pt-0 flex justify-center border-t border-border/50 bg-gray-50/30">
          <Link
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors mt-6"
            to={footerHref}
          >
            {footerLabel}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
