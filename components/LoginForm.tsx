import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@remix-run/react";
import { useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { LoginSchema } from "~/schemas";
import CardWrapper from "./CardWrapper";
import LoaderIcon from "./LoaderIcon";
import { Button } from "./ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider,
} from "./ui/form";
import { Input } from "./ui/input";

export const LoginForm = ({ url }: { url: string }) => {
  const form = useRemixForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { handleSubmit, control, watch, setError, clearErrors, formState } =
    form;
  return (
    <CardWrapper
      header="Login"
      footerLabel="Don't have an account? Register"
      footerHref="/register"
      googleLogin={url}
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

          <Button type="submit" className="w-full">
            {formState.isSubmitting ? (
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
