import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useFetcher } from "@remix-run/react";
import { useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { UsernameSchema } from "~/schemas";
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
import { Card } from "./ui/card";
import { useDebounce } from "~/customHooks/Debounce";
import { useEffect, useState } from "react";

export const UsernameForm = () => {
  const form = useRemixForm<z.infer<typeof UsernameSchema>>({
    resolver: zodResolver(UsernameSchema),
    defaultValues: {
      username: "",
    },
  });
  const { handleSubmit, control, watch, setError, clearErrors } = form;
  const debounceUsername = useDebounce(watch("username"));
  const validUsername = useFetcher();
  const [username, setUsername] = useState("");

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
      clearErrors("username");
    } else if (validUsername.data === false) {
      setUsername("");
      setError("username", {
        type: "manual",
        message: `Username: ${debounceUsername} is already taken`,
      });
    } else if (validUsername.data == true) {
      setUsername(`Username: ${debounceUsername} is valid`);
      clearErrors("username");
    }
  }, [validUsername.data, validUsername.state]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gray-50/50">
      <FormProvider {...(form as any)}>
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-gray-100 shadow-xl rounded-3xl overflow-hidden mt-8 md:mt-0 p-8">
          <div className="flex flex-col w-full items-center justify-center pb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#79AC78]/10 flex items-center justify-center mb-4">
              <span className="text-[#79AC78] font-bold text-2xl">s</span>
            </div>
            <h1 className="font-bold text-2xl text-gray-900 tracking-tight">Choose a Username</h1>
            <p className="text-gray-500 text-sm mt-2 text-center">Pick a unique handle to get started</p>
          </div>
          <Form onSubmit={handleSubmit} method="POST">
            <FormField
              control={control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-semibold text-gray-700">Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. split_master"
                      className="h-12 rounded-xl border-gray-200 focus-visible:ring-[#79AC78] focus-visible:border-transparent transition-all"
                    />
                  </FormControl>
                  {username && <p className={`text-xs ${validUsername.data === true ? 'text-[#79AC78]' : validUsername.state === 'loading' ? 'text-blue-500' : 'text-red-500'}`}>{username}</p>}
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#79AC78] hover:bg-[#639362] text-white font-semibold transition-all shadow-sm mt-6"
            >
              Continue
            </Button>
          </Form>
        </Card>
      </FormProvider>
    </div>
  );
};
