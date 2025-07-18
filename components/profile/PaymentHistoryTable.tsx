import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Payment, PaymentState } from "@prisma/client";

interface PaymentHistoryTableProps {
  payments: Payment[];
}

export default function PaymentHistoryTable({ payments }: PaymentHistoryTableProps) {
  const getBadgeVariant = (state: PaymentState) => {
    switch (state) {
      case "SUCCESS":
        return "default";
      case "PENDING":
        return "secondary";
      case "FAILED":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>State</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>{payment.id}</TableCell>
            <TableCell>
              <Badge variant={getBadgeVariant(payment.state)}>
                {payment.state}
              </Badge>
            </TableCell>
            <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
