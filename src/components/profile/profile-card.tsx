import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ProfileImage } from "@/components/profile/profile-image";

interface ProfileUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "ANALYST";
  image?: string | null;
  createdAt: Date;
}

interface ProfileCardProps {
  user: ProfileUser;
}

export function ProfileCard({ user }: ProfileCardProps) {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Profile image */}
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-28 w-28">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />

            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>

          <ProfileImage />
        </div>

        <Separator />

        {/* Profile details */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{user.name}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-medium">{user.role}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Member Since</p>
            <p className="font-medium">{user.createdAt.toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
