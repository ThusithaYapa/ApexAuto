export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
      {children}
    </div>
  );
}
