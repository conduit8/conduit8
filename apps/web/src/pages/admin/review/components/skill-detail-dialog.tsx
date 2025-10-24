import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@web/ui/components/overlays/dialog';
import { Button } from '@web/ui/components/atoms/buttons/button';
import { Input } from '@web/ui/components/atoms/inputs/input';
import { Textarea } from '@web/ui/components/atoms/inputs/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@web/ui/components/atoms/inputs/select';
import { Badge } from '@web/ui/components/atoms/indicators/badge';
import { Loader2, Check, X, Download, Copy } from 'lucide-react';
import { SKILL_CATEGORIES } from '@conduit8/core';
import { skillsApi } from '@web/pages/public/home/services/skills-api.v2';
import { TagsInput } from '@web/pages/public/home/components/submit-skill-dialog/tags-input';
import type { UpdateSkillMetadataPayload } from '@web/pages/public/home/services/skills-api.v2';

interface SkillDetailDialogProps {
  slug: string;
  open: boolean;
  onClose: () => void;
}

/**
 * Skill detail dialog with edit and approve/reject functionality
 */
export function SkillDetailDialog({ slug, open, onClose }: SkillDetailDialogProps) {
  const queryClient = useQueryClient();

  // Fetch skill details
  const { data: skillData, isLoading } = useQuery({
    queryKey: ['skill', slug],
    queryFn: async () => {
      const response = await skillsApi.list({ q: slug, limit: 1, offset: 0 });
      return response.data[0];
    },
    enabled: !!slug,
  });

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<UpdateSkillMetadataPayload>({});

  // Initialize edited data when skill loads
  useEffect(() => {
    if (skillData) {
      setEditedData({
        displayName: skillData.displayName,
        description: skillData.description,
        category: skillData.category,
        examples: skillData.examples,
        curatorNote: skillData.curatorNote,
      });
    }
  }, [skillData]);

  // Update metadata mutation
  const updateMutation = useMutation({
    mutationFn: (payload: UpdateSkillMetadataPayload) => skillsApi.updateMetadata(slug, payload),
    onSuccess: () => {
      toast.success('Metadata updated successfully');
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['skill', slug] });
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
    },
    onError: () => {
      toast.error('Failed to update metadata');
    },
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: () => skillsApi.approve(slug),
    onSuccess: () => {
      toast.success('Skill approved!');
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      onClose();
    },
    onError: () => {
      toast.error('Failed to approve skill');
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: () => skillsApi.reject(slug),
    onSuccess: () => {
      toast.success('Skill rejected');
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      onClose();
    },
    onError: () => {
      toast.error('Failed to reject skill');
    },
  });

  const handleSaveChanges = () => {
    updateMutation.mutate(editedData);
  };

  const handleCopyInstallCommand = () => {
    navigator.clipboard.writeText(`npx conduit8 install ${slug}`);
    toast.success('Install command copied!');
  };

  if (isLoading || !skillData) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin size-6" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const isPending = approveMutation.isPending || rejectMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Skill Review</DialogTitle>
          <DialogDescription>
            Review and manage skill submission
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Metadata</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                disabled={isPending}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                {/* Display Name */}
                <div>
                  <label className="text-sm font-medium">Display Name</label>
                  <Input
                    value={editedData.displayName}
                    onChange={(e) => setEditedData({ ...editedData, displayName: e.target.value })}
                    className="mt-1"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={editedData.description}
                    onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                    rows={3}
                    className="mt-1"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={editedData.category}
                    onValueChange={(v) => setEditedData({ ...editedData, category: v })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SKILL_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Examples */}
                <div>
                  <label className="text-sm font-medium">Examples</label>
                  <TagsInput
                    value={editedData.examples || []}
                    onChange={(tags) => setEditedData({ ...editedData, examples: tags })}
                    placeholder="Add example"
                    className="mt-1"
                  />
                </div>

                {/* Curator Note */}
                <div>
                  <label className="text-sm font-medium">Curator Note (Optional)</label>
                  <Textarea
                    value={editedData.curatorNote || ''}
                    onChange={(e) => setEditedData({ ...editedData, curatorNote: e.target.value })}
                    rows={2}
                    placeholder="Internal note about this skill..."
                    className="mt-1"
                  />
                </div>

                {/* Save Button */}
                <Button
                  onClick={handleSaveChanges}
                  disabled={isPending}
                  className="w-full"
                >
                  {updateMutation.isPending && <Loader2 className="animate-spin" />}
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Display Name:</span>
                  <p className="font-medium">{skillData.displayName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Description:</span>
                  <p>{skillData.description}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <Badge variant="neutral" className="ml-2">{skillData.category}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Author:</span>
                  <p>{skillData.author}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Source:</span>
                  <p>{skillData.sourceType} • {skillData.sourceUrl}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Examples:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {skillData.examples.map((ex, i) => (
                      <Badge key={i} variant="outline">{ex}</Badge>
                    ))}
                  </div>
                </div>
                {skillData.curatorNote && (
                  <div>
                    <span className="text-muted-foreground">Curator Note:</span>
                    <p className="text-xs italic">{skillData.curatorNote}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Install & Test */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Install & Test</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCopyInstallCommand}
                className="flex-1"
              >
                <Copy className="size-4" />
                Copy Install Command
              </Button>
              <Button
                variant="outline"
                asChild
                className="flex-1"
              >
                <a href={`/api/v1/skills/${slug}/download`} download>
                  <Download className="size-4" />
                  Download ZIP
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Command: <code className="bg-muted px-1 py-0.5 rounded">npx conduit8 install {slug}</code>
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={() => rejectMutation.mutate()}
              disabled={isPending}
              variant="destructive"
              className="flex-1"
            >
              {rejectMutation.isPending && <Loader2 className="animate-spin" />}
              <X className="size-4" />
              Reject
            </Button>
            <Button
              onClick={() => approveMutation.mutate()}
              disabled={isPending}
              variant="default"
              className="flex-1"
            >
              {approveMutation.isPending && <Loader2 className="animate-spin" />}
              <Check className="size-4" />
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
