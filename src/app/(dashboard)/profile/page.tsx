import { getCurrentUser } from "@/lib/auth/get-current-user";

import { ProfileCard } from "@/components/profile/profile-card";
import { ChangePasswordCard } from "@/components/profile/change-password-card";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>

        <p className="text-sm text-muted-foreground">
          Manage your profile and account security.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileCard user={user} />

        <ChangePasswordCard />
      </div>
    </div>
  );
}
