import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CustomerDetailsProps {
  customer: {
    customerNumber: string;
    name: string;
    email: string | null;
    phone: string | null;
    country: string;
    riskLevel: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export function CustomerDetails({ customer }: CustomerDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Customer ID</p>
            <p className="font-medium">{customer.customerNumber}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{customer.name}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{customer.email ?? "-"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-medium">{customer.phone ?? "-"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Country</p>
            <p className="font-medium">{customer.country}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Risk Level</p>
            <Badge variant="outline">{customer.riskLevel}</Badge>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge
              variant={customer.status === "ACTIVE" ? "default" : "secondary"}
            >
              {customer.status}
            </Badge>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Member Since</p>
            <p className="font-medium">
              {customer.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
