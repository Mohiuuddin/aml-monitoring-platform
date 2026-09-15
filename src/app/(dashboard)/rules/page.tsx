import { AmlRulesTable } from "@/components/rules/aml-rules-table";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getAmlRules } from "@/lib/rules/get-aml-rules";
import { redirect } from "next/navigation";

export default async function RulesPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const rules = await getAmlRules();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">AML Rules</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View the rules currently used by the AML monitoring engine.
        </p>
      </div>

      <AmlRulesTable rules={rules} />
    </div>
  );
}
