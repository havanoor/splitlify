import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@remix-run/react";
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

export const UsernameForm = () => {
  const form = useRemixForm<z.infer<typeof UsernameSchema>>({
    resolver: zodResolver(UsernameSchema),
    defaultValues: {
      username: "",
    },
  });
  const { handleSubmit, control, watch, setError, clearErrors } = form;

  return (
    <FormProvider {...(form as any)}>
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
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Add Username</Button>
      </Form>
    </FormProvider>
  );
};
