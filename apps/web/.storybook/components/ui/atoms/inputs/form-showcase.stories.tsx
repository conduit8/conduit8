import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@web/components/ui/atoms/buttons/button';
import { Label } from '@web/components/ui/atoms/typography/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@web/components/ui/layout/containers/card';
import { useRef } from 'react';

import { Checkbox } from './checkbox';
import { RadioGroup, RadioGroupItem } from './radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select';
import { Switch } from './switch';

const meta = {
  title: 'Components/Atoms/Inputs/Form Showcase',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteFormShowcase: Story = {
  render: () => {
    const switchRef1 = useRef(null);
    const switchRef2 = useRef(null);
    const switchRef3 = useRef(null);

    return (
      <div className="max-w-4xl space-y-8">
        {/* Typography Examples */}
        <Card>
          <CardHeader>
            <CardTitle>
              <h4>Typography System</h4>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h1>h1 - Hero Title (60px)</h1>
              <h2>h2 - Page Title (35px)</h2>
              <h3>h3 - Section Header (28px)</h3>
              <h4>h4 - Card Title (24px)</h4>
              <h5>h5 - Component Header (20px)</h5>
              <h6>h6 - Small Section (18px)</h6>
              <p>
                p - Body text (16px) - This is the standard paragraph text used throughout the
                application.
              </p>
              <small>small - Caption text (12px) - Used for timestamps and metadata</small>
            </div>

            <div className="space-y-2">
              <p>
                <strong>Strong text</strong> for emphasis
              </p>
              <p>
                <em>Italic text</em> for subtle emphasis
              </p>
              <p>
                <code>Inline code</code> for technical content
              </p>
              <p>
                <a href="#">Link text</a> with hover effects
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Color System */}
        <Card>
          <CardHeader>
            <CardTitle>
              <h4>Color System</h4>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary Colors */}
            <div>
              <h6>Primary Colors</h6>
              <div className="mt-3 grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="bg-primary h-16 rounded"></div>
                  <small>Primary</small>
                </div>
                <div className="space-y-2">
                  <div className="bg-secondary h-16 rounded"></div>
                  <small>Secondary</small>
                </div>
                <div className="space-y-2">
                  <div className="bg-accent h-16 rounded"></div>
                  <small>Accent</small>
                </div>
                <div className="space-y-2">
                  <div className="bg-muted h-16 rounded"></div>
                  <small>Muted</small>
                </div>
              </div>
            </div>

            {/* Semantic Colors */}
            <div>
              <h6>Semantic Colors</h6>
              <div className="mt-3 grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="bg-success h-16 rounded"></div>
                  <small>Success</small>
                </div>
                <div className="space-y-2">
                  <div className="bg-destructive h-16 rounded"></div>
                  <small>Destructive</small>
                </div>
                <div className="space-y-2">
                  <div className="bg-warning h-16 rounded"></div>
                  <small>Warning</small>
                </div>
                <div className="space-y-2">
                  <div className="bg-info h-16 rounded"></div>
                  <small>Info</small>
                </div>
              </div>
            </div>

            {/* Surface Colors */}
            <div>
              <h6>Surface Colors</h6>
              <div className="mt-3 grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="bg-background h-16 rounded border"></div>
                  <small>Background</small>
                </div>
                <div className="space-y-2">
                  <div className="bg-surface h-16 rounded border"></div>
                  <small>Surface</small>
                </div>
                <div className="space-y-2">
                  <div className="bg-card h-16 rounded border"></div>
                  <small>Card</small>
                </div>
                <div className="space-y-2">
                  <div className="bg-popover h-16 rounded border"></div>
                  <small>Popover</small>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complete Form Example */}
        <Card>
          <CardHeader>
            <CardTitle>
              <h4>Complete Form Example</h4>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              {/* Select Field */}
              <div className="space-y-2">
                <Label htmlFor="country" className="required">
                  Country
                </Label>
                <Select defaultValue="us">
                  <SelectTrigger id="country">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>North America</SelectLabel>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="mx">Mexico</SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Europe</SelectLabel>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Radio Group */}
              <div className="space-y-2">
                <Label>Subscription Plan</Label>
                <RadioGroup defaultValue="pro">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="free" id="plan-free" className="mt-0.5" />
                      <div className="flex-1">
                        <Label htmlFor="plan-free" className="cursor-pointer">
                          Free Plan
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          Basic features with limited usage
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="pro" id="plan-pro" className="mt-0.5" />
                      <div className="flex-1">
                        <Label htmlFor="plan-pro" className="cursor-pointer">
                          Pro Plan
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          Advanced features with higher limits
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="enterprise" id="plan-enterprise" className="mt-0.5" />
                      <div className="flex-1">
                        <Label htmlFor="plan-enterprise" className="cursor-pointer">
                          Enterprise Plan
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          Custom solutions for large teams
                        </p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Checkboxes */}
              <div className="space-y-2">
                <Label>Features</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox id="feature-analytics" defaultChecked />
                    <Label htmlFor="feature-analytics" className="cursor-pointer">
                      Advanced Analytics
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox id="feature-api" defaultChecked />
                    <Label htmlFor="feature-api" className="cursor-pointer">
                      API Access
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox id="feature-support" />
                    <Label htmlFor="feature-support" className="cursor-pointer">
                      Priority Support
                    </Label>
                  </div>
                </div>
              </div>

              {/* Switches */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Email Notifications</Label>
                    <p className="text-muted-foreground text-sm">Receive updates via email</p>
                  </div>
                  <Switch id="notifications" ref={switchRef1} defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="public">Public Profile</Label>
                    <p className="text-muted-foreground text-sm">
                      Make your profile visible to others
                    </p>
                  </div>
                  <Switch id="public" ref={switchRef2} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="beta">Beta Features</Label>
                    <p className="text-muted-foreground text-sm">Try new features before release</p>
                  </div>
                  <Switch id="beta" ref={switchRef3} />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="border-t pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox id="terms" required />
                  <div className="space-y-1">
                    <Label htmlFor="terms" className="required cursor-pointer">
                      I agree to the terms and conditions
                    </Label>
                    <p className="text-muted-foreground text-sm">
                      By checking this box, you agree to our{' '}
                      <a href="#" className="underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="underline">
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
                <Button type="submit" variant="accent">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Button Variants */}
        <Card>
          <CardHeader>
            <CardTitle>
              <h4>Button Variants</h4>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="accent">Accent</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button disabled>Disabled</Button>
              <Button variant="accent" disabled>
                Accent Disabled
              </Button>
              <Button variant="destructive" disabled>
                Destructive Disabled
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Form States */}
        <Card>
          <CardHeader>
            <CardTitle>
              <h4>Form Element States</h4>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error States */}
            <div>
              <h6 className="mb-3">Error States</h6>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="error-select" className="text-destructive">
                    Select with Error
                  </Label>
                  <Select>
                    <SelectTrigger
                      id="error-select"
                      className="border-destructive"
                      aria-invalid="true"
                    >
                      <SelectValue placeholder="Please select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Option 1</SelectItem>
                      <SelectItem value="2">Option 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-destructive text-sm">This field is required</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="error-checkbox"
                    className="border-destructive"
                    aria-invalid="true"
                  />
                  <Label htmlFor="error-checkbox" className="text-destructive cursor-pointer">
                    Required checkbox
                  </Label>
                </div>
              </div>
            </div>

            {/* Disabled States */}
            <div>
              <h6 className="mb-3">Disabled States</h6>
              <div className="space-y-4">
                <Select disabled defaultValue="1">
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Disabled Select</SelectItem>
                  </SelectContent>
                </Select>

                <RadioGroup disabled defaultValue="1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="disabled-radio" />
                    <Label htmlFor="disabled-radio" className="opacity-50">
                      Disabled Radio
                    </Label>
                  </div>
                </RadioGroup>

                <div className="flex items-center space-x-2">
                  <Checkbox id="disabled-checkbox" disabled checked />
                  <Label htmlFor="disabled-checkbox" className="opacity-50">
                    Disabled Checkbox
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
};
