import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { useDebounce } from "../app/customHooks/Debounce";
import { SignUpSchema } from "../app/schemas";
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

export const RegisterForm = ({ url }: { url: string }) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const form = useRemixForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: undefined,
      email: undefined,
      password: "",
      confirmPassword: "",
      userName: "",
    },
  });
  const { handleSubmit, control, watch, setError, clearErrors } = form;

  const debounceUsername = useDebounce(watch("userName"));
  const validUsername = useFetcher();

  useEffect(() => {
    const isValidUsername = async () => {
      validUsername.load(`/valid-username/${debounceUsername}`);
    };

    if (debounceUsername != "") {
      isValidUsername();
    }
  }, [debounceUsername]);

  useEffect(() => {
    if (validUsername.state === "loading") {
      setUsername(`Checking Username: ${debounceUsername}`);
      clearErrors("userName");
    } else if (validUsername.data === false) {
      setUsername("");
      setError("userName", {
        type: "manual",
        message: `Username: ${debounceUsername} is already taken`,
      });
    } else if (validUsername.data == true) {
      setUsername(`Username: ${debounceUsername} is valid`);
      clearErrors("userName");
    }
  }, [validUsername.data, validUsername.state]);

  return (
    <CardWrapper
      header="Create an account"
      footerLabel="Already have an account? Log in instead"
      footerHref="/login"
      googleLogin={url}
    >
      <FormProvider {...(form as any)}>
        <Form
          onSubmit={handleSubmit}
          method="POST"
          className="grid gap-4 grid-cols-2"
        >
          <FormField
            control={control}
            name="firstName"
            render={({ field }) => {
              return (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-semibold text-foreground/80">First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. John"
                      {...field}
                      className="h-12 rounded-xl border-input focus-visible:ring-primary focus-visible:border-transparent transition-all"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              );
            }}
          />

          <FormField
            control={control}
            name="lastName"
            render={({ field }) => {
              return (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-semibold text-foreground/80">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Doe"
                      {...field}
                      className="h-12 rounded-xl border-input focus-visible:ring-primary focus-visible:border-transparent transition-all"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              );
            }}
          />
          <FormField
            control={control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem className="col-span-2 space-y-1.5">
                  <FormLabel className="text-sm font-semibold text-foreground/80">Password *</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Create a strong password"
                      {...field}
                      className="h-12 rounded-xl border-input focus-visible:ring-primary focus-visible:border-transparent transition-all"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              );
            }}
          />
          <FormField
            control={control}
            name="confirmPassword"
            render={({ field }) => {
              return (
                <FormItem className="col-span-2 space-y-1.5">
                  <FormLabel className="text-sm font-semibold text-foreground/80">Confirm Password *</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Repeat your password"
                      {...field}
                      className="h-12 rounded-xl border-input focus-visible:ring-primary focus-visible:border-transparent transition-all"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              );
            }}
          />
          <FormField
            control={control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem className="col-span-2 space-y-1.5">
                  <FormLabel className="text-sm font-semibold text-foreground/80">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      {...field}
                      className="h-12 rounded-xl border-input focus-visible:ring-primary focus-visible:border-transparent transition-all"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              );
            }}
          />
          <FormField
            control={control}
            name="userName"
            render={({ field }) => {
              return (
                <FormItem className="col-span-2 space-y-1.5">
                  <FormLabel className="text-sm font-semibold text-foreground/80">Username *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Choose a unique handle"
                      {...field}
                      className="h-12 rounded-xl border-input focus-visible:ring-primary focus-visible:border-transparent transition-all"
                    />
                  </FormControl>
                  {username && <p className={`text-xs ${validUsername.data === true ? 'text-primary' : validUsername.state === 'loading' ? 'text-info' : 'text-destructive'}`}>{username}</p>}
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              );
            }}
          />
          {formError && (
            <div className="col-span-2 flex gap-2 w-full p-3 rounded-xl bg-destructive/10 border border-destructive/20 items-center justify-center text-destructive text-sm font-medium mt-2">
              <IoWarningOutline className="w-5 h-5 flex-shrink-0" />
              <p>{formError}</p>
            </div>
          )}
          <Button type="submit" className="col-span-2 w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all shadow-sm mt-4">
            {loading ? (
              <div className="flex items-center gap-2">
                <LoaderIcon />
                <span>Creating account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </Form>
      </FormProvider>
    </CardWrapper>
  );
};
