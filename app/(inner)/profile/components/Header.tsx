import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  name: string;
  email: string;
}

export default function Header({ name, email }: HeaderProps) {
  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src="/placeholder-user.jpg" alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-muted-foreground">{email}</p>
      </div>
    </div>
  );
}