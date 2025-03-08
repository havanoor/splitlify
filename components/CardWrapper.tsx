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
  cardWidth: number;
  googleLogin?: string;
};

export default function CardWrapper({
  children,
  header = "Set an Header",
  footerHref,
  footerLabel,
  googleLogin,
  cardWidth = 550,
}: CardProps) {
  return (
    <Card style={{ width: cardWidth }} className={"shadow-md mx-auto mt-5"}>
      <div className="flex flex-col w-full items-center gap-y-4 ">
        <h1 className="font-semibold text-2xl m-3">{header}</h1>
      </div>
      <CardContent>
        <div className="flex flex-col gap-y-4">
          {children}
          <a href={googleLogin}>
            <Button
              // onClick={() =>
              //   signIn("google", { callbackUrl: "/singleBook", redirect: true })
              // }
              variant="outline"
              size="lg"
              className="w-full"
            >
              <FcGoogle className="h-6 w-6 mr-2" />
              Sign in With Google
            </Button>
          </a>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          className="text-sm text hover:underline hover:text-green-800 w-full text-center"
          to={footerHref}
        >
          {footerLabel}
        </Link>
      </CardFooter>
    </Card>
  );
}
