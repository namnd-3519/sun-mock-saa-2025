export function LoginFooter({ copyright }: { copyright: string }) {
  return (
    <footer className="flex items-center justify-center border-t border-brand-divider px-4 py-10 md:px-10 lg:px-[90px]">
      <p className="text-center font-alt text-base leading-6 font-bold text-white">
        {copyright}
      </p>
    </footer>
  );
}
