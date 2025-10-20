import { CaretDownIcon } from '@phosphor-icons/react';
import { useState } from 'react';

import { Button } from '../atoms/buttons';
import { Checkbox } from '../atoms/inputs/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterPopoverProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options: FilterOption[];
  multi?: boolean;
  width?: string;
}

export function FilterPopover({
  value,
  onChange,
  options,
  multi = false,
  width = 'w-[140px]',
}: FilterPopoverProps) {
  const [open, setOpen] = useState(false);

  const isSelected = (optionValue: string) => {
    return multi
      ? (value as string[]).includes(optionValue)
      : value === optionValue;
  };

  const handleSelect = (optionValue: string) => {
    if (multi) {
      const current = value as string[];
      const updated = current.includes(optionValue)
        ? current.filter(v => v !== optionValue)
        : [...current, optionValue];
      onChange(updated);
    }
    else {
      onChange(optionValue);
      setOpen(false);
    }
  };

  const getLabel = () => {
    if (multi) {
      const selected = value as string[];
      if (selected.length === 0)
        return 'All';
      if (selected.length === 1) {
        return options.find(o => o.value === selected[0])?.label || 'All';
      }
      const first = options.find(o => o.value === selected[0])?.label;
      return `${first}, +${selected.length - 1}`;
    }
    return options.find(o => o.value === value)?.label || 'All';
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={`${width} justify-between`}>
          <span className="truncate">{getLabel()}</span>
          <CaretDownIcon size={16} className="ml-2 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[200px] p-3">
        <div className="space-y-2">
          {multi && (
            <>
              <div className="flex items-center gap-2 pb-2 border-b">
                <Checkbox
                  id="all"
                  checked={(value as string[]).length === 0}
                  onCheckedChange={() => onChange([])}
                />
                <label htmlFor="all" className="text-sm cursor-pointer">
                  All
                </label>
              </div>
            </>
          )}
          {options.map(option => (
            <div key={option.value} className="flex items-center gap-2">
              {multi
                ? (
                    <>
                      <Checkbox
                        id={option.value}
                        checked={isSelected(option.value)}
                        onCheckedChange={() => handleSelect(option.value)}
                      />
                      <label htmlFor={option.value} className="text-sm cursor-pointer">
                        {option.label}
                      </label>
                    </>
                  )
                : (
                    <button
                      onClick={() => handleSelect(option.value)}
                      className={`w-full text-left px-2 py-1.5 text-sm rounded ${
                        isSelected(option.value)
                          ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {option.label}
                    </button>
                  )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
