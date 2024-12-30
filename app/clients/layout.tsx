export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="p-6">{children}</div>;
}