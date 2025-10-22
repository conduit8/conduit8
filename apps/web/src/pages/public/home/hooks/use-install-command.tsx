import { useState } from 'react';
import { toast } from 'sonner';

export function useInstallCommand(slug: string) {
  const [isCopied, setIsCopied] = useState(false);
  const installCommand = `npx conduit8 install skill ${slug}`;

  const handleInstallClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    navigator.clipboard.writeText(installCommand);
    setIsCopied(true);
    toast.success('Install command copied', {
      description: (
        <span className="font-semibold font-mono">{installCommand}</span>
      ),
    });

    // Reset copied state after 2 seconds
    setTimeout(() => setIsCopied(false), 2000);
  };

  return {
    isCopied,
    handleInstallClick,
  };
}
