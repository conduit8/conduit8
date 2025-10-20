
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      'a11cb59c-67b5-4bea-bfcc-83c4590cc578',
      'mcp-builder',
      'mcp-builder',
      'Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Use when building MCP servers to integrate external APIs or services, whether in Python (FastMCP) or Node/TypeScript (MCP SDK).',
      NULL,
      'skills/mcp-builder.zip',
      'images/mcp-builder.png',
      '[]',
      NULL,
      'anthropic',
      'verified',
      'import',
      'https://github.com/anthropics/skills/tree/main/mcp-builder',
      1760953784,
      1760953784
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('a11cb59c-67b5-4bea-bfcc-83c4590cc578', 0);
  