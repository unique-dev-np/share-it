import { z } from "zod";

export type SignUpFormDataType = z.infer<typeof SignUpFormDataValidator>;
export type SignInFormDataType = z.infer<typeof SignInFormDataValidator>;

export const SignUpFormDataValidator = z
  .object({
    name: z.string().min(4).max(20),
    email: z.string().email(),
    password: z.string().min(4),
    confirmPassword: z.string().min(4),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export const SignInFormDataValidator = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export const CreateBucketFormValidator = z.object({
  name: z.string().min(4).max(25),
  size: z.string().min(1, "Size is required"),
  life: z.string().min(1, "Life is required"),
  password: z.string().optional(),
});
