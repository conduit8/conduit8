INSERT OR IGNORE INTO skills (
  id, slug, name, description, category, zip_key, image_key,
  examples, curator_note, author, author_kind,
  source_type, source_url, created_at, updated_at
) VALUES (
  '5db1f6d1-bd85-40a1-a784-a7fe271c404a',
  'mcp-builder',
  'mcp-builder',
  'Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Use when building MCP servers to integrate external APIs or services, whether in Python (FastMCP) or Node/TypeScript (MCP SDK).',
  'Development',
  'skills/mcp-builder.zip',
  'images/mcp-builder.png',
  '["Build an MCP server for GitHub API integration","Create a Python MCP server for Notion","Develop a TypeScript MCP server with comprehensive evaluations"]',
  NULL,
  'anthropic',
  'verified',
  'import',
  'https://github.com/anthropics/skills/tree/main/mcp-builder',
  1760970200,
  1760970200
);

INSERT OR IGNORE INTO skill_stats (skill_id, download_count)
VALUES ('5db1f6d1-bd85-40a1-a784-a7fe271c404a', 0);
