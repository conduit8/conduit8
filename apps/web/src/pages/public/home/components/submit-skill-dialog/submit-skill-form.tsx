import { SKILL_CATEGORIES } from '@conduit8/core';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BriefcaseIcon,
  ChartBarIcon,
  CircleNotchIcon,
  CodeIcon,
  FileArchiveIcon,
  FileTextIcon,
  MegaphoneIcon,
  PaintBrushIcon,
  PencilIcon,
  UploadSimpleIcon,
  XIcon,
} from '@phosphor-icons/react';
import { Button } from '@web/ui/components/atoms/buttons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@web/ui/components/atoms/inputs';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@web/ui/components/data/forms/form';

import type { SubmitSkillFormValues } from './submit-skill-form.schema';

import { useSkillPackageParser } from '../../hooks/use-skill-package-parser';
import { submitSkillFormSchema } from './submit-skill-form.schema';

interface SubmitSkillFormProps {
  onSubmit: (values: SubmitSkillFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

/**
 * Accepted skill package formats
 * Business logic: Skill packages must be ZIP files
 */
const ACCEPTED_SKILL_PACKAGE_FORMATS = {
  'application/zip': ['.zip'],
} as const;

const CATEGORY_LABELS: Record<(typeof SKILL_CATEGORIES)[number], string> = {
  development: 'Development',
  content: 'Content',
  documents: 'Documents',
  data: 'Data',
  design: 'Design',
  marketing: 'Marketing',
  business: 'Business',
};

const CATEGORY_DESCRIPTIONS: Record<(typeof SKILL_CATEGORIES)[number], string> = {
  development: 'Backend, Frontend, DevOps, Security, Testing',
  content: 'Marketing Copy, Internal Comms, Research, Brand',
  documents: 'Office, Forms, Presentations',
  data: 'Analysis, Visualization, ETL',
  design: 'Graphic Design, Generative Art, UI/UX, Media',
  marketing: 'SEO, Conversion, Sales',
  business: 'Strategy, Finance, Operations',
};

const CATEGORY_ICONS: Record<(typeof SKILL_CATEGORIES)[number], typeof CodeIcon> = {
  development: CodeIcon,
  content: PencilIcon,
  documents: FileTextIcon,
  data: ChartBarIcon,
  design: PaintBrushIcon,
  marketing: MegaphoneIcon,
  business: BriefcaseIcon,
};

export function SubmitSkillForm({ onSubmit, onCancel, isSubmitting = false }: SubmitSkillFormProps) {
  const { skillPackage, isParsing, error: parseError, parseFile, reset } = useSkillPackageParser();

  const form = useForm<SubmitSkillFormValues>({
    resolver: zodResolver(submitSkillFormSchema),
    defaultValues: {
      zipFile: undefined,
      category: undefined,
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file)
        return;

      const result = await parseFile(file);
      if (result.success) {
        form.setValue('zipFile', file);
        form.clearErrors('zipFile');
      }
      else {
        form.setError('zipFile', { message: result.error });
      }
    },
    [parseFile, form],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_SKILL_PACKAGE_FORMATS,
    maxFiles: 1,
    disabled: isParsing || isSubmitting,
  });

  const handleRemoveZip = () => {
    reset();
    form.resetField('zipFile');
  };

  const handleFormSubmit = (values: SubmitSkillFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* ZIP Upload */}
        <FormField
          control={form.control}
          name="zipFile"
          render={() => (
            <FormItem>
              <FormLabel className="font-semibold">Skill Package</FormLabel>
              <FormControl>
                {!skillPackage
                  ? (
                    <div
                      {...getRootProps()}
                      className={`
                        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                        min-h-36 flex flex-col items-center justify-center
                        ${isDragActive ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'}
                        ${isParsing || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <input {...getInputProps()} />
                      <UploadSimpleIcon className="mx-auto mb-3 text-muted-foreground size-8" />
                      {isDragActive
                        ? (
                          <p className="text-sm">Drop ZIP file here</p>
                        )
                        : (
                          <>
                            <p className="text-sm font-medium mb-1">
                              Drag and drop your skill ZIP file
                            </p>
                            <p className="text-xs text-muted-foreground">
                              or click to browse (max 50MB)
                            </p>
                          </>
                        )}
                    </div>
                  )
                  : (
                    <div className="border rounded-lg p-4 space-y-4">
                      {/* File info */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileArchiveIcon className="size-5 text-accent shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">{skillPackage.getFile().name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(skillPackage.getTotalSize() / 1024 / 1024).toFixed(2)}
                              {' '}
                              MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveZip}
                          disabled={isParsing || isSubmitting}
                        >
                          <XIcon className="size-4" />
                        </Button>
                      </div>

                      {/* Loading state */}
                      {isParsing && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CircleNotchIcon className="size-4 animate-spin" />
                          <span>Parsing ZIP file...</span>
                        </div>
                      )}

                      {/* Parse error */}
                      {parseError && (
                        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                          {parseError}
                        </div>
                      )}

                      {/* Parsed preview */}
                      {skillPackage && (
                        <div className="space-y-3">
                          {/* Skill info */}
                          <div className="bg-muted/30 rounded-md p-3 space-y-2">
                            <div>
                              <p className="text-xs text-muted-foreground">Name</p>
                              <p className="text-sm font-medium">{skillPackage.getFrontmatter().name}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Description</p>
                              <p className="text-sm">{skillPackage.getFrontmatter().description}</p>
                            </div>
                            {skillPackage.getExcerpt() && (
                              <div>
                                <p className="text-xs text-muted-foreground">Content Preview</p>
                                <p className="text-xs text-muted-foreground italic">
                                  {skillPackage.getExcerpt()}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* File list */}
                          {skillPackage.getFiles().length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-medium">
                                Files (
                                {skillPackage.getFiles().length}
                                )
                              </p>
                              <div className="bg-muted/30 rounded-md p-2 space-y-1 text-xs font-mono max-h-32 overflow-y-auto">
                                {skillPackage.getFiles().slice(0, 10).map(file => (
                                  <div key={file.name} className="truncate">
                                    {file.name}
                                  </div>
                                ))}
                                {skillPackage.getFiles().length > 10 && (
                                  <p className="text-muted-foreground italic">
                                    ...and
                                    {' '}
                                    {skillPackage.getFiles().length - 10}
                                    {' '}
                                    more
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category - only show after successful ZIP upload */}
        {skillPackage && (
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category">
                        {field.value && (
                          <div className="flex items-center gap-2">
                            {(() => {
                              const Icon = CATEGORY_ICONS[field.value as typeof SKILL_CATEGORIES[number]];
                              return <Icon className="size-4 text-muted-foreground" />;
                            })()}
                            <span>{CATEGORY_LABELS[field.value as typeof SKILL_CATEGORIES[number]]}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full">
                    {SKILL_CATEGORIES.map((category) => {
                      const Icon = CATEGORY_ICONS[category];
                      return (
                        <SelectItem
                          key={category}
                          value={category}
                          className="w-full text-start"
                        >
                          <div className="flex flex-col gap-1 w-full py-0.5">
                            <div className="flex items-center gap-2">
                              <Icon className="size-4 text-muted-foreground" />
                              <span>{CATEGORY_LABELS[category]}</span>
                            </div>
                            <div className="text-xs text-muted-foreground pl-6">
                              {CATEGORY_DESCRIPTIONS[category]}
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="accent"
            disabled={!skillPackage || isSubmitting || isParsing}
          >
            {isSubmitting && <CircleNotchIcon className="animate-spin" />}
            {isSubmitting ? 'Submitting...' : 'Submit Skill'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
