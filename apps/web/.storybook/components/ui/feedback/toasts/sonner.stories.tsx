import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@web/ui/components/atoms/buttons/button';
import { Toaster } from '@web/ui/components/feedback/toasts/sonner';
import { toast } from 'sonner';

const meta: Meta<typeof Toaster> = {
  title: 'Components/UI/Feedback/Toasts/Sonner',
  component: Toaster,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllToastTypes: Story = {
  render: () => (
    <>
      <Toaster position="top-right" />
      <div className="flex flex-col gap-6 p-8">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Basic Toasts</h3>
          <div className="flex gap-2">
            <Button onClick={() => toast('Default toast message')} variant="outline">
              Default
            </Button>
            <Button
              onClick={() =>
                toast('Default with description', {
                  description: 'This is a subtitle for more context',
                })}
              variant="outline"
            >
              With Description
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Status Toasts</h3>
          <div className="flex gap-2">
            <Button
              onClick={() =>
                toast.success('File uploaded', {
                  description: 'Your file has been uploaded successfully',
                })}
              variant="outline"
            >
              Success
            </Button>
            <Button
              onClick={() =>
                toast.error('Upload failed', {
                  description: 'File size exceeds 100MB limit',
                })}
              variant="outline"
            >
              Error
            </Button>
            <Button
              onClick={() =>
                toast.warning('Low storage', {
                  description: 'You have only 10% storage remaining',
                })}
              variant="outline"
            >
              Warning
            </Button>
            <Button
              onClick={() =>
                toast.info('New features available', {
                  description: 'Check out our latest updates in settings',
                })}
              variant="outline"
            >
              Info
            </Button>
            <Button
              onClick={() =>
                toast.loading('Processing...', {
                  description: 'Please wait while we process your request',
                })}
              variant="outline"
            >
              Loading
            </Button>
            <Button
              onClick={() =>
                toast('Default toast', {
                  description: 'This is a default toast message',
                })}
              variant="outline"
            >
              Default
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Interactive Toasts</h3>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                const promise = new Promise(resolve => setTimeout(resolve, 2000));
                toast.promise(promise, {
                  loading: 'Uploading file...',
                  success: {
                    title: 'Upload complete',
                    description: 'File processed successfully',
                  },
                  error: {
                    title: 'Upload failed',
                    description: 'Please try again',
                  },
                });
              }}
              variant="outline"
            >
              Promise
            </Button>
            <Button
              onClick={() =>
                toast('Event has been created', {
                  description: 'Monday, January 3rd at 6:00pm',
                  action: {
                    label: 'Undo',
                    onClick: () => console.log('Undo'),
                  },
                })}
              variant="outline"
            >
              With Action
            </Button>
            <Button
              onClick={() =>
                toast.custom(t => (
                  <div className="rounded-lg bg-surface p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-accent" />
                      <div>
                        <p className="font-medium">Custom Toast</p>
                        <p className="text-sm">This is a custom rendered toast</p>
                      </div>
                    </div>
                  </div>
                ))}
              variant="outline"
            >
              Custom
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Duration & Dismissible</h3>
          <div className="flex gap-2">
            <Button
              onClick={() =>
                toast('Persistent toast', {
                  duration: Infinity,
                  description: 'This toast will not auto-dismiss',
                })}
              variant="outline"
            >
              Persistent
            </Button>
            <Button
              onClick={() =>
                toast('Quick toast', {
                  duration: 1000,
                  description: 'Disappears in 1 second',
                })}
              variant="outline"
            >
              Quick (1s)
            </Button>
            <Button
              onClick={() =>
                toast('Non-dismissible', {
                  cancel: {
                    label: 'Cancel',
                    onClick: () => console.log('Cancelled'),
                  },
                  description: 'Must click cancel to dismiss',
                })}
              variant="outline"
            >
              With Cancel
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Multiple & Loading States</h3>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                toast('First notification');
                toast('Second notification');
                toast('Third notification');
              }}
              variant="outline"
            >
              Multiple
            </Button>
            <Button
              onClick={() => {
                const toastId = toast.loading('Loading...');
                setTimeout(() => {
                  toast.success('Loaded', {
                    id: toastId,
                  });
                }, 2000);
              }}
              variant="outline"
            >
              Loading → Success
            </Button>
            <Button onClick={() => toast.dismiss()} variant="outline">
              Dismiss All
            </Button>
          </div>
        </div>
      </div>
    </>
  ),
};

export const Positions: Story = {
  render: () => {
    const positions = [
      'top-left',
      'top-center',
      'top-right',
      'bottom-left',
      'bottom-center',
      'bottom-right',
    ] as const;

    return (
      <div className="flex flex-col gap-4 p-8">
        <h3 className="text-sm font-medium">Toast Positions</h3>
        <div className="grid grid-cols-3 gap-2">
          {positions.map(position => (
            <Button
              key={position}
              onClick={() => {
                toast.dismiss();
                toast.success(`Toast at ${position}`, {
                  position,
                });
              }}
              variant="outline"
              size="sm"
            >
              {position}
            </Button>
          ))}
        </div>
        <Toaster />
      </div>
    );
  },
};

export const RichContent: Story = {
  render: () => (
    <>
      <Toaster richColors closeButton />
      <div className="flex flex-col gap-4 p-8">
        <h3 className="text-sm font-medium">Rich Colors & Close Button</h3>
        <div className="flex gap-2">
          <Button
            onClick={() =>
              toast.success('Success with rich colors', {
                description: 'Notice the enhanced color styling',
              })}
            variant="outline"
          >
            Rich Success
          </Button>
          <Button
            onClick={() =>
              toast.error('Error with rich colors', {
                description: 'Rich error styling with close button',
              })}
            variant="outline"
          >
            Rich Error
          </Button>
        </div>
      </div>
    </>
  ),
};
