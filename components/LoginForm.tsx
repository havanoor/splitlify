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
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-semibold text-gray-700">Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your username"
                    required
                    className="h-12 rounded-xl border-gray-200 focus-visible:ring-[#79AC78] focus-visible:border-transparent transition-all"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-semibold text-gray-700">Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your password"
                    type="password"
                    required
                    className="h-12 rounded-xl border-gray-200 focus-visible:ring-[#79AC78] focus-visible:border-transparent transition-all"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#79AC78] hover:bg-[#639362] text-white font-semibold transition-all shadow-sm mt-4"
          >
            {formState.isSubmitting ? (
              <div className="flex items-center gap-2">
                <LoaderIcon />
                <span>Logging In...</span>
              </div>
            ) : (
              "Login"
            )}
          </Button>
        </Form>
      </FormProvider>
    </CardWrapper>
  );
};
