import type { Meta, StoryObj } from '@storybook/react';

import { Label } from '@web/ui/components/atoms/typography/label';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@web/ui/components/atoms/inputs/select';

const meta = {
  title: 'Components/Atoms/Inputs/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disable the select',
    },
    value: {
      control: 'text',
      description: 'Selected value',
    },
    onValueChange: {
      action: 'value changed',
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
        <SelectItem value="grape">Grape</SelectItem>
        <SelectItem value="watermelon">Watermelon</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <Select defaultValue="banana">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
        <SelectItem value="grape">Grape</SelectItem>
        <SelectItem value="watermelon">Watermelon</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled defaultValue="apple">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
          <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
          <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
          <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
          <SelectItem value="cet">Central European Time (CET)</SelectItem>
          <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="ist">India Standard Time (IST)</SelectItem>
          <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
          <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const LanguageSelector: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="language" className="required">
        Audio Language
      </Label>
      <Select>
        <SelectTrigger id="language" className="w-[280px]">
          <SelectValue placeholder="Select audio language..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Common Languages</SelectLabel>
            <SelectItem value="en">
              <span className="flex items-center gap-2">
                <span>🇺🇸</span>
                <span>English</span>
              </span>
            </SelectItem>
            <SelectItem value="es">
              <span className="flex items-center gap-2">
                <span>🇪🇸</span>
                <span>Spanish</span>
              </span>
            </SelectItem>
            <SelectItem value="fr">
              <span className="flex items-center gap-2">
                <span>🇫🇷</span>
                <span>French</span>
              </span>
            </SelectItem>
            <SelectItem value="de">
              <span className="flex items-center gap-2">
                <span>🇩🇪</span>
                <span>German</span>
              </span>
            </SelectItem>
            <SelectItem value="zh">
              <span className="flex items-center gap-2">
                <span>🇨🇳</span>
                <span>Chinese</span>
              </span>
            </SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Other Languages</SelectLabel>
            <SelectItem value="ja">
              <span className="flex items-center gap-2">
                <span>🇯🇵</span>
                <span>Japanese</span>
              </span>
            </SelectItem>
            <SelectItem value="ko">
              <span className="flex items-center gap-2">
                <span>🇰🇷</span>
                <span>Korean</span>
              </span>
            </SelectItem>
            <SelectItem value="pt">
              <span className="flex items-center gap-2">
                <span>🇵🇹</span>
                <span>Portuguese</span>
              </span>
            </SelectItem>
            <SelectItem value="ru">
              <span className="flex items-center gap-2">
                <span>🇷🇺</span>
                <span>Russian</span>
              </span>
            </SelectItem>
            <SelectItem value="it">
              <span className="flex items-center gap-2">
                <span>🇮🇹</span>
                <span>Italian</span>
              </span>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const SizeVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Small Size</Label>
        <Select>
          <SelectTrigger size="sm" className="w-[180px]">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectItem value="2">Option 2</SelectItem>
            <SelectItem value="3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Default Size</Label>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectItem value="2">Option 2</SelectItem>
            <SelectItem value="3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div className="bg-surface w-96 space-y-6 rounded-lg border p-6">
      <h5>User Preferences</h5>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select defaultValue="system">
            <SelectTrigger id="theme">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language-pref">Language</Label>
          <Select defaultValue="en">
            <SelectTrigger id="language-pref">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="ja">日本語</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date-format">Date Format</Label>
          <Select defaultValue="mdy">
            <SelectTrigger id="date-format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
              <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
              <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[300px]">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="us">United States of America</SelectItem>
        <SelectItem value="uk">United Kingdom of Great Britain and Northern Ireland</SelectItem>
        <SelectItem value="ca">Canada</SelectItem>
        <SelectItem value="au">Australia</SelectItem>
        <SelectItem value="nz">New Zealand</SelectItem>
        <SelectItem value="de">Germany</SelectItem>
        <SelectItem value="fr">France</SelectItem>
        <SelectItem value="es">Spain</SelectItem>
        <SelectItem value="it">Italy</SelectItem>
        <SelectItem value="jp">Japan</SelectItem>
        <SelectItem value="cn">China</SelectItem>
        <SelectItem value="in">India</SelectItem>
        <SelectItem value="br">Brazil</SelectItem>
        <SelectItem value="mx">Mexico</SelectItem>
        <SelectItem value="ar">Argentina</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select a status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active">
          <span className="flex items-center gap-2">
            <span className="bg-success h-2 w-2 rounded-full"></span>
            <span>Active</span>
          </span>
        </SelectItem>
        <SelectItem value="paused">
          <span className="flex items-center gap-2">
            <span className="bg-warning h-2 w-2 rounded-full"></span>
            <span>Paused</span>
          </span>
        </SelectItem>
        <SelectItem value="inactive">
          <span className="flex items-center gap-2">
            <span className="bg-muted h-2 w-2 rounded-full"></span>
            <span>Inactive</span>
          </span>
        </SelectItem>
        <SelectItem value="error">
          <span className="flex items-center gap-2">
            <span className="bg-destructive h-2 w-2 rounded-full"></span>
            <span>Error</span>
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  ),
};
