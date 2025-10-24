import { Badge } from '@web/ui/components/atoms/indicators/badge';
import { Input } from '@web/ui/components/atoms/inputs/input';
import { cn } from '@web/lib/utils';
import { X } from 'lucide-react';
import { forwardRef, useState } from 'react';

interface TagsInputProps extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

/**
 * TagsInput component
 * Allows users to add/remove tags by typing and pressing Enter
 */
export const TagsInput = forwardRef<HTMLInputElement, TagsInputProps>(
  ({ value = [], onChange, placeholder, maxTags, className, ...props }, ref) => {
    const [inputValue, setInputValue] = useState('');

    const addTag = (tag: string) => {
      const trimmedTag = tag.trim();
      if (trimmedTag && !value.includes(trimmedTag)) {
        if (!maxTags || value.length < maxTags) {
          onChange([...value, trimmedTag]);
          setInputValue('');
        }
      }
    };

    const removeTag = (tagToRemove: string) => {
      onChange(value.filter((tag) => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTag(inputValue);
      }
      else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
        removeTag(value[value.length - 1]);
      }
    };

    const handleBlur = () => {
      if (inputValue) {
        addTag(inputValue);
      }
    };

    return (
      <div className="space-y-2">
        <Input
          ref={ref}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={className}
          {...props}
        />
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((tag) => (
              <Badge key={tag} variant="outline" className="gap-1 pr-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 rounded-full hover:bg-muted/50 p-0.5 transition-colors"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        {maxTags && (
          <p className="text-xs text-muted-foreground">
            {value.length} / {maxTags} tags
          </p>
        )}
      </div>
    );
  },
);

TagsInput.displayName = 'TagsInput';
