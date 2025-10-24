import { zodResolver } from '@hookform/resolvers/zod';
import { SKILL_CATEGORIES } from '@conduit8/core';
import { Button } from '@web/ui/components/atoms/buttons/button';
import { Input } from '@web/ui/components/atoms/inputs/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@web/ui/components/atoms/inputs/select';
import { Textarea } from '@web/ui/components/atoms/inputs/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@web/ui/components/data/forms/form';
import { Loader2, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { TagsInput } from './tags-input';
import { submitSkillFormSchema } from './submit-skill-form.schema';

import type { SubmitSkillFormValues } from './submit-skill-form.schema';

interface SubmitSkillFormProps {
  onSubmit: (values: SubmitSkillFormValues) => void;
  isLoading?: boolean;
}

/**
 * Form for submitting a new skill
 * Collects all required metadata and the skill ZIP file
 */
export function SubmitSkillForm({ onSubmit, isLoading = false }: SubmitSkillFormProps) {
  const form = useForm<SubmitSkillFormValues>({
    resolver: zodResolver(submitSkillFormSchema),
    defaultValues: {
      displayName: '',
      description: '',
      category: undefined,
      allowedTools: [],
      examples: [],
      zipFile: undefined,
    },
    mode: 'onSubmit',
  });

  const handleSubmit = (values: SubmitSkillFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Display Name */}
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="My Awesome Skill"
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                A human-readable name for your skill (3-100 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe what your skill does and how it helps users..."
                  disabled={isLoading}
                  rows={4}
                />
              </FormControl>
              <FormDescription>
                A clear description of your skill&apos;s functionality (20-500 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SKILL_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the category that best fits your skill
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Allowed Tools */}
        <FormField
          control={form.control}
          name="allowedTools"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allowed Tools</FormLabel>
              <FormControl>
                <TagsInput
                  {...field}
                  placeholder="Type a tool name and press Enter (e.g., Bash, Read, Write)"
                  disabled={isLoading}
                  maxTags={20}
                />
              </FormControl>
              <FormDescription>
                List the tools your skill uses. Press Enter after each tool.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Examples */}
        <FormField
          control={form.control}
          name="examples"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Examples</FormLabel>
              <FormControl>
                <TagsInput
                  {...field}
                  placeholder="Type an example use case and press Enter"
                  disabled={isLoading}
                  maxTags={10}
                />
              </FormControl>
              <FormDescription>
                Provide example use cases or prompts for your skill (1-10 examples)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ZIP File Upload */}
        <FormField
          control={form.control}
          name="zipFile"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Skill Package (ZIP)</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    {...field}
                    type="file"
                    accept=".zip"
                    disabled={isLoading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                      }
                    }}
                    className="cursor-pointer"
                  />
                  <Upload className="size-5 text-muted-foreground" />
                </div>
              </FormControl>
              <FormDescription>
                Upload a ZIP file containing your skill (max 10MB)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading && <Loader2 className="animate-spin" />}
            {isLoading ? 'Submitting...' : 'Submit Skill'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
