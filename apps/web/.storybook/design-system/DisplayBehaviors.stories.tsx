import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Guides/CSS Display Behaviors',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj;

export const DisplayTypes: Story = {
  render: () => (
    <div className="space-y-8 p-4">
      <div>
        <h2 className="mb-4 text-2xl font-bold">CSS Display Property Behaviors</h2>
        <p className="mb-6 text-muted-foreground">
          Understanding how different display values affect element layout and width
        </p>
      </div>

      <div className="space-y-6">
        {/* Block */}
        <section>
          <h3 className="mb-2 font-semibold">Block</h3>
          <div className="rounded border-2 border-dashed border-gray-300 p-2">
            <div className="block bg-blue-200 p-2 text-center">
              Block: Takes full width
            </div>
            <div className="block bg-blue-300 p-2 text-center">
              Each block starts on new line
            </div>
          </div>
        </section>

        {/* Inline */}
        <section>
          <h3 className="mb-2 font-semibold">Inline</h3>
          <div className="rounded border-2 border-dashed border-gray-300 p-2">
            <span className="inline bg-green-200 p-2">Inline: Content width</span>
            <span className="inline bg-green-300 p-2">Sits on same line</span>
            <span className="inline bg-green-400 p-2">Can't set width/height</span>
          </div>
        </section>

        {/* Inline-block */}
        <section>
          <h3 className="mb-2 font-semibold">Inline-block</h3>
          <div className="rounded border-2 border-dashed border-gray-300 p-2">
            <div className="inline-block bg-yellow-200 p-2">Inline-block</div>
            <div className="inline-block bg-yellow-300 p-2">Same line</div>
            <div className="inline-block bg-yellow-400 p-2 w-32 text-center">Can set width</div>
          </div>
        </section>

        {/* Flex */}
        <section>
          <h3 className="mb-2 font-semibold">Flex</h3>
          <div className="rounded border-2 border-dashed border-gray-300 p-2">
            <div className="flex bg-purple-200 p-2">
              Flex: Full width container (block-level)
            </div>
            <div className="flex bg-purple-300 p-2 mt-2">
              <span>Child 1</span>
              <span className="ml-auto">Child 2 (pushed right)</span>
            </div>
          </div>
        </section>

        {/* Inline-flex */}
        <section>
          <h3 className="mb-2 font-semibold">Inline-flex</h3>
          <div className="rounded border-2 border-dashed border-gray-300 p-2">
            <div className="inline-flex bg-orange-200 p-2 gap-2">
              <span>Inline-flex:</span>
              <span>Content width</span>
            </div>
            <div className="inline-flex bg-orange-300 p-2 gap-2 ml-2">
              <span>Another</span>
              <span>inline-flex</span>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section>
          <h3 className="mb-2 font-semibold">Side-by-side Comparison</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded border-2 border-dashed border-gray-300 p-2">
              <p className="mb-2 text-sm font-semibold">Flex (full width)</p>
              <div className="flex bg-purple-200 p-2 justify-between">
                <span>Left</span>
                <span>Right</span>
              </div>
            </div>
            <div className="rounded border-2 border-dashed border-gray-300 p-2">
              <p className="mb-2 text-sm font-semibold">Inline-flex (content width)</p>
              <div className="inline-flex bg-orange-200 p-2 gap-4">
                <span>Left</span>
                <span>Right</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Key Takeaways */}
      <div className="mt-8 rounded bg-muted p-4">
        <h3 className="mb-2 font-semibold">Key Takeaways</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li><strong>Block:</strong> Full width, new line</li>
          <li><strong>Inline:</strong> Content width, same line, no width/height</li>
          <li><strong>Inline-block:</strong> Content width, same line, can set width/height</li>
          <li><strong>Flex:</strong> Full width flex container (block-level)</li>
          <li><strong>Inline-flex:</strong> Content width flex container (inline-level)</li>
        </ul>
      </div>
    </div>
  ),
};

export const LogoDisplayBehavior: Story = {
  render: () => (
    <div className="space-y-8 p-4">
      <div>
        <h2 className="mb-4 text-2xl font-bold">Why Logo Uses inline-flex</h2>
        <p className="mb-6 text-muted-foreground">
          Understanding how inline-flex affects the Logo component layout
        </p>
      </div>

      <div className="space-y-6">
        {/* With flex (wrong) */}
        <section>
          <h3 className="mb-2 font-semibold text-red-600">❌ With flex (takes full width)</h3>
          <div className="rounded border-2 border-dashed border-red-300 p-4">
            <div className="flex items-center gap-2 bg-red-50 p-2">
              <div className="h-7 w-7 rounded bg-foreground"></div>
              <span className="font-bold">Kollektiv</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Logo takes entire width, pushes other nav items down
            </p>
          </div>
        </section>

        {/* With inline-flex (correct) */}
        <section>
          <h3 className="mb-2 font-semibold text-green-600">✅ With inline-flex (content width)</h3>
          <div className="rounded border-2 border-dashed border-green-300 p-4">
            <div className="inline-flex items-center gap-2 bg-green-50 p-2">
              <div className="h-7 w-7 rounded bg-foreground"></div>
              <span className="font-bold">Kollektiv</span>
            </div>
            <span className="ml-4 text-sm">Other nav items can sit alongside</span>
            <p className="mt-2 text-sm text-muted-foreground">
              Logo only takes the width it needs, allows horizontal navigation layout
            </p>
          </div>
        </section>

        {/* Real world example */}
        <section>
          <h3 className="mb-2 font-semibold">Real Navigation Example</h3>
          <div className="rounded border-2 border-dashed border-gray-300 p-4">
            <nav className="flex items-center justify-between">
              {/* Logo with inline-flex */}
              <div className="inline-flex items-center gap-2">
                <div className="h-7 w-7 rounded bg-foreground"></div>
                <span className="font-bold">Kollektiv</span>
              </div>

              {/* Nav items */}
              <div className="flex items-center gap-4">
                <a href="#" className="text-sm">Dashboard</a>
                <a href="#" className="text-sm">Settings</a>
                <button className="rounded bg-accent px-4 py-2 text-sm">Get Started</button>
              </div>
            </nav>
            <p className="mt-2 text-sm text-muted-foreground">
              The inline-flex logo sits nicely in the navigation layout
            </p>
          </div>
        </section>
      </div>
    </div>
  ),
};