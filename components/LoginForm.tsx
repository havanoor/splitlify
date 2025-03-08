import { useState } from "react";
import { LoginSchema } from "~/schemas";
import {
  FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import CardWrapper from "./CardWrapper";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { IoWarningOutline } from "react-icons/io5";
import LoaderIcon from "./LoaderIcon";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login } from "~/routes/login/login";
import { useRemixForm } from "remix-hook-form";
import { Form } from "@remix-run/react";

export const LoginForm = ({ url }: { url: string }) => {
  const [formError, setFormError] = useState("");
  const [loading, isLoading] = useState(false);
  const form = useRemixForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { handleSubmit, control, watch, setError, clearErrors } = form;
  return (
    <CardWrapper
      header="Login"
      footerLabel="Don't have an account? Register"
      footerHref="/register"
      googleLogin={url}
      cardWidth={450}
    >
      <FormProvider {...(form as any)}>
        <Form onSubmit={handleSubmit} method="POST" className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="username" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="password"
                    type="password"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {formError && (
            <div className="flex gap-2 w-full p-2 rounded-md  bg-destructive/15 items-center text-destructive text-sm">
              <IoWarningOutline className="w-5 h-5" />
              <p>{formError}</p>
            </div>
          )}

          <Button type="submit" className="w-full">
            {loading ? (
              <>
                <LoaderIcon />
                Logging In ...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </Form>
      </FormProvider>
    </CardWrapper>
  );
};
