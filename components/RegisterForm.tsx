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
    console.log("Debounce Username", debounceUsername);

    const isValidUsername = async () => {
      validUsername.load(`/valid-username/${debounceUsername}`);
      console.log("Valid Username", validUsername.data);
      if (validUsername.data === false) {
        setUsername("");
        setError("userName", {
          type: "manual",
          message: `Username: ${debounceUsername} is already taken`,
        });
      } else {
        clearErrors("userName");
        setUsername(`Username: ${debounceUsername} is valid`);
      }
    };

    if (debounceUsername != "") {
      isValidUsername();
    }
  }, [debounceUsername]);

  return (
    <CardWrapper
      header="Register"
      footerLabel="Already have an account? Login"
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
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={control}
            name="lastName"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem className="col-span-2">
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={control}
            name="confirmPassword"
            render={({ field }) => {
              return (
                <FormItem className="col-span-2">
                  <FormLabel>Confirm Password *</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem className="col-span-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={control}
            name="userName"
            render={({ field }) => {
              return (
                <FormItem className="col-span-2">
                  <FormLabel>Username *</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <p className="text-sm text-green-800">{username}</p>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          {formError && (
            <div className="flex gap-2 w-full p-2 rounded-md  bg-destructive/15 items-center text-destructive text-sm">
              <IoWarningOutline className="w-5 h-5" />
              <p>{formError}</p>
            </div>
          )}
          <Button type="submit" className="col-span-2">
            {loading ? (
              <>
                <LoaderIcon />
                Lets Go ...
              </>
            ) : (
              "Register"
            )}
          </Button>
        </Form>
      </FormProvider>
    </CardWrapper>
  );
};
