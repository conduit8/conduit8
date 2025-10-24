import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@web/ui/components/atoms/buttons/button';
import { Input } from '@web/ui/components/atoms/inputs/input';
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
import { Badge } from '@web/ui/components/atoms/indicators/badge';
import { FileText, Loader2, Upload, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

import { TagsInput } from './tags-input';
import { submitSkillFormSchema, ALLOWED_FILE_EXTENSIONS } from './submit-skill-form.schema.v2';
import { validateSkillMd, parseSkillFrontmatter } from '../../utils/create-skill-zip';

import type { SubmitSkillFormValues } from './submit-skill-form.schema.v2';

interface SubmitSkillFormProps {
  onSubmit: (values: SubmitSkillFormValues) => void;
  isLoading?: boolean;
  defaultAuthor?: string;
}

/**
 * Form for submitting a new skill
 * User provides SKILL.md content, optional files, and metadata
 */
export function SubmitSkillFormV2({ onSubmit, isLoading = false, defaultAuthor = '' }: SubmitSkillFormProps) {
  const [skillMdValidation, setSkillMdValidation] = useState<{
    valid: boolean;
    errors: string[];
  } | null>(null);

  const form = useForm<SubmitSkillFormValues>({
    resolver: zodResolver(submitSkillFormSchema),
    defaultValues: {
      skillMdContent: '',
      additionalFiles: [],
      author: defaultAuthor,
      sourceUrl: '',
      examples: [],
    },
    mode: 'onChange',
  });

  const handleSubmit = (values: SubmitSkillFormValues) => {
    // Final validation
    const validation = validateSkillMd(values.skillMdContent);
    if (!validation.valid) {
      setSkillMdValidation(validation);
      return;
    }

    onSubmit(values);
  };

  const handleSkillMdChange = (content: string) => {
    form.setValue('skillMdContent', content);

    // Validate frontmatter
    if (content.trim()) {
      const validation = validateSkillMd(content);
      setSkillMdValidation(validation);
    }
    else {
      setSkillMdValidation(null);
    }
  };

  const handleSkillMdFileUpload = async (file: File) => {
    const content = await file.text();
    handleSkillMdChange(content);
  };

  const handleRemoveAdditionalFile = (index: number) => {
    const currentFiles = form.getValues('additionalFiles');
    const newFiles = currentFiles.filter((_, i) => i !== index);
    form.setValue('additionalFiles', newFiles);
  };

  const skillMdContent = form.watch('skillMdContent');
  const additionalFiles = form.watch('additionalFiles');

  // Parse frontmatter for preview
  let frontmatterPreview: ReturnType<typeof parseSkillFrontmatter> | null = null;
  if (skillMdContent && skillMdValidation?.valid) {
    try {
      frontmatterPreview = parseSkillFrontmatter(skillMdContent);
    }
    catch {
      // Ignore parse errors
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* SKILL.md Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">SKILL.md</h3>
            <label htmlFor="skill-md-file-upload">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isLoading}
                onClick={() => document.getElementById('skill-md-file-upload')?.click()}
              >
                <Upload className="size-4" />
                Upload SKILL.md
              </Button>
              <input
                id="skill-md-file-upload"
                type="file"
                accept=".md"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleSkillMdFileUpload(file);
                }}
              />
            </label>
          </div>

          <FormField
            control={form.control}
            name="skillMdContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={`---\nname: my-awesome-skill\ndescription: A helpful skill that does amazing things\nlicense: MIT\nallowed-tools: Bash Read Write\n---\n\n# My Awesome Skill\n\n## Instructions\nProvide clear step-by-step guidance...\n\n## Examples\n- Example 1\n- Example 2`}
                    disabled={isLoading}
                    rows={12}
                    className="font-mono text-sm"
                    onChange={(e) => handleSkillMdChange(e.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  Write or paste your SKILL.md content. Must include YAML frontmatter with name, description, license, and allowed-tools.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Validation Feedback */}
          {skillMdValidation && (
            <div className={`flex items-start gap-2 rounded-md border p-3 ${
              skillMdValidation.valid
                ? 'bg-success/10 border-success/20 text-success'
                : 'bg-destructive/10 border-destructive/20 text-destructive'
            }`}>
              {skillMdValidation.valid ? (
                <CheckCircle2 className="size-5 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="size-5 mt-0.5 shrink-0" />
              )}
              <div className="space-y-1 text-sm">
                {skillMdValidation.valid ? (
                  <p className="font-medium">Valid SKILL.md frontmatter</p>
                ) : (
                  <>
                    <p className="font-medium">Invalid frontmatter:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      {skillMdValidation.errors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Frontmatter Preview */}
          {frontmatterPreview && (
            <div className="rounded-md border bg-muted/30 p-4 space-y-2">
              <p className="text-sm font-medium">Frontmatter Preview:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <span className="ml-2 font-mono">{frontmatterPreview.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">License:</span>
                  <span className="ml-2 font-mono">{frontmatterPreview.license}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Tools:</span>
                  <span className="ml-2 font-mono">{frontmatterPreview.allowedTools}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Files */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Additional Files (Optional)</h3>
              <p className="text-sm text-muted-foreground">Scripts, templates, or resources</p>
            </div>
            <label htmlFor="additional-files-upload">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isLoading || additionalFiles.length >= 20}
              >
                <Upload className="size-4" />
                Add Files
              </Button>
              <input
                id="additional-files-upload"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  const currentFiles = form.getValues('additionalFiles');
                  const newFiles = [...currentFiles, ...files].slice(0, 20);
                  form.setValue('additionalFiles', newFiles);
                }}
              />
            </label>
          </div>

          {/* Helpful info about allowed file types */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Allowed file types:</p>
            <p>
              Code (.js, .py, .sh, .ts, etc.), Docs (.md, .txt, .pdf),
              Config (.json, .yaml, .toml), Templates (.mustache, .hbs),
              Images (.png, .jpg, .svg)
            </p>
          </div>

          {additionalFiles.length > 0 && (
            <div className="space-y-2">
              {additionalFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-muted-foreground" />
                    <span className="text-sm font-mono">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAdditionalFile(index)}
                    disabled={isLoading}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Metadata</h3>

          {/* Author */}
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your name" disabled={isLoading} />
                </FormControl>
                <FormDescription>Your name or organization</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Source URL */}
          <FormField
            control={form.control}
            name="sourceUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source URL (Optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="url"
                    placeholder="https://github.com/username/repo"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Link to source repository or documentation
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
                  Provide example use cases or prompts (1-10 examples)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={isLoading || !skillMdValidation?.valid}
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
