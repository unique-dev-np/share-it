import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader, PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";

export default function AddBalanceForm({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const { data } = useSession();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{ balance: number }>({ defaultValues: { balance: 0 } });

    const onSubmit = async ({ balance }: { balance: number }) => {
        setLoading(true);

        if (!data?.user?.email) return;

        try {
            const res = await fetch("/api/user/balance/add", {
                method: "PUT",
                // @ts-expect-error I will fix it soon
                body: JSON.stringify({ email: data.user.email, balance: parseInt(balance) }),
            });

            const serverData = await res.json();

            console.log(serverData);

            onSuccess()

            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <Input
                disabled={loading}
                placeholder="Enter amount of balance...."
                {...register("balance", {
                    required: { value: true, message: "Balance is required" },
                    min: { value: 10, message: "Minimum value required is 10." },
                    max: { value: 50, message: "Maximum balance you can add is 50." },
                })}
            />
            {errors.balance ? <p>{errors.balance.message}</p> : <></>}

            <Button
                disabled={loading}
                className="disabled:cursor-not-allowed"
                onClick={handleSubmit(onSubmit)}
            >
                {loading ? (
                    <Loader className="mr-2 animate-spin" />
                ) : (
                    <PlusIcon className="mr-2" />
                )}
                Add
            </Button>
        </div>
    );
}
