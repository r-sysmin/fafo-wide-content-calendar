export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-page flex-col items-center gap-1 px-6 text-center lg:px-8">
        <span className="font-heading text-base font-semibold tracking-tight text-foreground">
          Content Calendar
        </span>
        <p className="text-xs text-muted-foreground">© {year}</p>
      </div>
    </footer>
  );
}
