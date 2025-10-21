import { CaretDownIcon } from '@phosphor-icons/react';
import { useState } from 'react';

import { Button } from '../atoms/buttons';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';

interface FilterOption {
  readonly value: string;
  readonly label: string;
}

interface FilterDropdownProps {
  label: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options: readonly FilterOption[];
  multi?: boolean;
  width?: string;
}

export function FilterDropdown({
  label,
  value,
  onChange,
  options,
  multi = false,
  width = 'w-[140px]',
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);

  const isSelected = (optionValue: string) => {
    return multi ? (value as string[]).includes(optionValue) : value === optionValue;
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

  const getButtonLabel = () => {
    if (multi) {
      const selected = value as string[];
      if (selected.length === 0)
        return label;
      if (selected.length === 1) {
        return options.find(o => o.value === selected[0])?.label || label;
      }
      const first = options.find(o => o.value === selected[0])?.label;
      return `${first}, +${selected.length - 1}`;
    }
    return options.find(o => o.value === value)?.label || label;
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={`${width} justify-between`}>
          <span className="truncate">{getButtonLabel()}</span>
          <CaretDownIcon size={16} className="ml-2 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        {multi
          ? (
              <>
                <DropdownMenuCheckboxItem
                  checked={(value as string[]).length === 0}
                  onCheckedChange={() => onChange([])}
                >
                  All
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                {options.map(option => (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={isSelected(option.value)}
                    onCheckedChange={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </>
            )
          : (
              <DropdownMenuRadioGroup value={value as string} onValueChange={onChange}>
                {options.map(option => (
                  <DropdownMenuRadioItem key={option.value} value={option.value}>
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
