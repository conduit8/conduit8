import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { Button } from '@web/ui/components/atoms/buttons';

interface EmptyStateProps {
  onResetFilters: () => void;
}

export function EmptyState({ onResetFilters }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] text-center">
      <div className="flex flex-col items-center gap-4">
        <MagnifyingGlassIcon size={48} weight="duotone" className="text-muted-foreground" />
        <div className="flex flex-col gap-2">
          <p className="font-semibold">No skills found matching your search</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
        </div>
        <Button variant="outline" onClick={onResetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
