import { CheckIcon, XIcon } from '@phosphor-icons/react';
import { useState } from 'react';

import { Button } from '@web/ui/components/atoms/buttons/button';
import { Input } from '@web/ui/components/atoms/inputs/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@web/ui/components/atoms/inputs/select';

interface EditableTextFieldProps {
  value: string;
  onSave: (value: string) => void;
  isPending?: boolean;
  placeholder?: string;
  className?: string;
}

/**
 * Inline editable text field
 * Click to edit, ESC to cancel, Enter or checkmark to save
 */
export function EditableTextField({
  value,
  onSave,
  isPending,
  placeholder,
  className,
}: EditableTextFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    if (editValue.trim() && editValue !== value) {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <span
        className={`cursor-pointer hover:underline ${className || ''}`}
        onClick={() => setIsEditing(true)}
        title="Click to edit"
      >
        {value || placeholder}
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-1">
      <Input
        value={editValue}
        onChange={e => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isPending}
        autoFocus
        className="h-6 px-2 py-0 text-sm w-40"
      />
      <Button
        size="sm"
        variant="ghost"
        onClick={handleSave}
        disabled={isPending || !editValue.trim()}
        className="h-6 w-6 p-0"
      >
        <CheckIcon weight="bold" className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleCancel}
        disabled={isPending}
        className="h-6 w-6 p-0"
      >
        <XIcon weight="bold" className="h-3 w-3" />
      </Button>
    </div>
  );
}

interface EditableSelectProps {
  value: string;
  options: Array<{ value: string; label: string }>;
  onSave: (value: string) => void;
  isPending?: boolean;
  className?: string;
}

/**
 * Inline editable select field
 * Click to open dropdown, select to save immediately
 */
export function EditableSelect({
  value,
  options,
  onSave,
  isPending,
  className,
}: EditableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLabel = options.find(opt => opt.value === value)?.label || value;

  const handleValueChange = (newValue: string) => {
    if (newValue !== value) {
      onSave(newValue);
    }
    setIsOpen(false);
  };

  return (
    <Select
      value={value}
      onValueChange={handleValueChange}
      open={isOpen}
      onOpenChange={setIsOpen}
      disabled={isPending}
    >
      <SelectTrigger
        className={`h-6 px-2 py-0 text-sm w-auto border-0 bg-transparent hover:underline cursor-pointer ${className || ''}`}
      >
        <SelectValue>
          {currentLabel}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
