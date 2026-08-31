import { CustomerForm } from "@/components/customers/customer-form";

export default function NewCustomerPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create Customer</h1>

        <p className="text-sm text-muted-foreground">
          Add a new customer to the AML monitoring system.
        </p>
      </div>

      <CustomerForm />
    </div>
  );
}
