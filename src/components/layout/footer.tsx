export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="flex min-h-14 items-center justify-between px-6 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} AML Monitoring Platform</p>

        <p>Rule-Based Transaction Monitoring</p>
      </div>
    </footer>
  );
}
