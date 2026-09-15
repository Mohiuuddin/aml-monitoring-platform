interface AmlRule {
  id: string;
  name: string;
  description: string;
  code: string;
  riskWeight: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AmlRulesTableProps {
  rules: AmlRule[];
}

export function AmlRulesTable({ rules }: AmlRulesTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-6 py-4 text-left font-medium">Rule</th>

              <th className="px-6 py-4 text-left font-medium">Code</th>

              <th className="px-6 py-4 text-left font-medium">Risk Weight</th>

              <th className="px-6 py-4 text-left font-medium">Status</th>

              <th className="px-6 py-4 text-left font-medium">Created</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {rules.map((rule) => (
              <tr key={rule.id} className="transition-colors hover:bg-muted/30">
                {/* Rule */}
                <td className="max-w-md px-6 py-5">
                  <p className="font-medium">{rule.name}</p>

                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    {rule.description}
                  </p>
                </td>

                {/* Code */}
                <td className="px-6 py-5">
                  <code className="rounded-md bg-muted px-2 py-1 text-xs">
                    {rule.code}
                  </code>
                </td>

                {/* Risk Weight */}
                <td className="px-6 py-5">
                  <span className="font-semibold">{rule.riskWeight}</span>
                </td>

                {/* Status */}
                <td className="px-6 py-5">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      rule.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {rule.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Created */}
                <td className="whitespace-nowrap px-6 py-5 text-muted-foreground">
                  {new Date(rule.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rules.length === 0 && (
        <div className="p-8 text-center text-sm text-muted-foreground">
          No AML rules found.
        </div>
      )}
    </div>
  );
}
