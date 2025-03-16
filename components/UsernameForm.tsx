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
    <FormProvider {...(form as any)}>
      <Card className={"shadow-md mx-auto mt-5 p-4"}>
        <Form onSubmit={handleSubmit} method="POST">
          <FormField
            control={control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Username" />
                </FormControl>
                <p className="text-sm text-green-800">{username}</p>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-2">
            Add Username
          </Button>
        </Form>
      </Card>
    </FormProvider>
  );
};
