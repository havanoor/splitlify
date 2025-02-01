import { useState } from "react";
import { LoginSchema } from "~/schemas";
import {
  Form,
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

export const LoginForm = ({ url }: { url: string }) => {
  const [formError, setFormError] = useState("");
  const [loading, isLoading] = useState(false);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof LoginSchema>) => {
    isLoading(true);
    const data = await login(values);
    if (data?.error) {
      setFormError(data.error);
    }
    isLoading(false);
  };

  return (
    <CardWrapper
      header="Login"
      footerLabel="Don't have an account? Register"
      footerHref="/authentication/register"
      googleLogin={url}
      cardWidth={450}
    >
      <Form {...form}>
        <form method="POST" className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="username" />
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
                  <Input {...field} placeholder="password" type="password" />
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
        </form>
      </Form>
    </CardWrapper>
  );
};
