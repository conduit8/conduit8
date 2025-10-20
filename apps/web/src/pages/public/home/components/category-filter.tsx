import { CaretDownIcon } from '@phosphor-icons/react';
import { Button } from '@web/ui/components/atoms/buttons';
import { useState } from 'react';

import { Checkbox } from '@web/ui/components/atoms/inputs/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@web/ui/components/overlays/popover';

interface CategoryFilterProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
}

const CATEGORIES = [
  { id: 'documents', label: 'Documents' },
  { id: 'creative', label: 'Creative' },
  { id: 'development', label: 'Development' },
  { id: 'testing', label: 'Testing' },
  { id: 'data', label: 'Data' },
  { id: 'media', label: 'Media' },
  { id: 'devops', label: 'DevOps' },
];

export function CategoryFilter({ selectedCategories, onCategoryChange }: CategoryFilterProps) {
  const [open, setOpen] = useState(false);

  const handleToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter(id => id !== categoryId));
    }
    else {
      onCategoryChange([...selectedCategories, categoryId]);
    }
  };

  const handleSelectAll = () => {
    onCategoryChange([]);
  };

  const getDisplayText = () => {
    if (selectedCategories.length === 0) {
      return 'All';
    }
    if (selectedCategories.length === 1) {
      const category = CATEGORIES.find(c => c.id === selectedCategories[0]);
      return category?.label || 'All';
    }
    const firstCategory = CATEGORIES.find(c => c.id === selectedCategories[0]);
    return `${firstCategory?.label}, +${selectedCategories.length - 1}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-[140px] justify-between"
        >
          <span className="truncate">{getDisplayText()}</span>
          <CaretDownIcon size={16} className="ml-2 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[200px] p-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Checkbox
              id="all"
              checked={selectedCategories.length === 0}
              onCheckedChange={handleSelectAll}
            />
            <label
              htmlFor="all"
              className="text-sm cursor-pointer select-none"
            >
              All Categories
            </label>
          </div>
          {CATEGORIES.map(category => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleToggle(category.id)}
              />
              <label
                htmlFor={category.id}
                className="text-sm cursor-pointer select-none"
              >
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
