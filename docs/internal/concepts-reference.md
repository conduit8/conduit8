# Quick Reference: Claude Code Skills, Plugins, and x402

## Claude Code Skills

### Definition
Model-invoked capabilities that Claude automatically uses based on context matching.

### Key Characteristics
- **Autonomous**: Claude decides when to activate (not user-invoked)
- **Discoverable**: Via description field matching user requests
- **Modular**: Single responsibility, focused capabilities
- **Progressive**: Claude loads supporting files as needed

### Structure
```
skill-name/
├── SKILL.md          # Required: YAML + instructions
├── reference.md      # Optional: Additional docs
├── scripts/          # Optional: Helper code
└── templates/        # Optional: File templates
```

### SKILL.md Template
```yaml
---
name: Skill Name
description: >
  What it does and when to use it.
  Be specific: mention file types, use cases, triggers.
allowed-tools: Read, Write, Bash, Grep
---

# Instructions for Claude

When this skill is activated, follow these steps:

1. Step one
2. Step two
3. Return results in this format

## Supporting Files

Use scripts/helper.py for data processing.
Use templates/output.txt as template.
```

### Storage Locations
| Location | Path | Scope |
|----------|------|-------|
| Personal | `~/.claude/skills/` | All projects (user) |
| Project | `.claude/skills/` | Team (via git) |
| Plugin | Plugin bundle | Marketplace distributed |

### Best Practices
- **Specific descriptions**: "Extract text from PDFs" > "helps with documents"
- **Clear triggers**: Mention file types, keywords, actions
- **Tool restrictions**: Limit to necessary tools only
- **Single responsibility**: One skill = one capability
- **Test discovery**: Verify activation with team members

### Example: PDF Processing Skill
```yaml
---
name: PDF Processor
description: >
  Extract text, merge, split PDF files.
  Use when user mentions PDFs, document extraction, or file merging.
allowed-tools: Read, Bash, Glob
---

# PDF Processing Instructions

When processing PDFs:

1. Check file format with `file` command
2. Use `pdftotext` for extraction
3. Use `pdftk` for merge/split
4. Return structured output

## Error Handling
- Invalid PDF: Return clear error message
- Missing dependencies: Request installation
- Large files: Warn about processing time
```

## Claude Code Plugins

### Definition
Distributable packages that extend Claude Code with multiple capabilities.

### Components
```
.claude-plugin/
├── plugin.json       # Manifest (required)
├── commands/         # Slash commands
├── agents/           # Specialized subagents
├── skills/           # Agent Skills
├── hooks/            # Event handlers
└── mcp/              # MCP server configs
```

### plugin.json Template
```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "Plugin description",
  "homepage": "https://...",
  "components": {
    "commands": ["command-name"],
    "agents": ["agent-name"],
    "skills": ["skill-name"],
    "hooks": ["hook-name"],
    "mcpServers": ["server-name"]
  }
}
```

### Plugin vs. Skill
| Feature | Skill | Plugin |
|---------|-------|--------|
| Invocation | Model-invoked | Varies by component |
| Scope | Single capability | Multiple components |
| Distribution | File-based | Marketplace |
| Dependencies | Tool restrictions | Can bundle MCP servers |
| Versioning | Manual | Semantic versioning |
| Updates | Manual replacement | Plugin manager |

### What Plugins Can Include

**1. Custom Slash Commands**
```
commands/review-code.md
---
description: Review code for security issues
---
Analyze @$1 for security vulnerabilities:
- SQL injection
- XSS risks
- Authentication flaws
```

**2. Specialized Agents (Subagents)**
```json
agents/security-reviewer.json
{
  "name": "security-reviewer",
  "description": "Security code review specialist",
  "allowedTools": ["Read", "Grep", "Glob"],
  "systemPrompt": "You are a security expert..."
}
```

**3. Agent Skills**
- Same format as standalone skills
- Bundled in `skills/` directory
- Auto-available when plugin installed

**4. Hooks (Event Handlers)**
```json
hooks/pre-commit.json
{
  "event": "pre-commit",
  "script": "scripts/lint.sh",
  "blocking": true
}
```

**5. MCP Servers**
```json
mcp/notion.json
{
  "name": "notion",
  "transport": "http",
  "url": "https://mcp.notion.com/mcp",
  "auth": "oauth2"
}
```

### Distribution

**Installation:**
```bash
# From marketplace
claude plugin install security-toolkit

# From URL
claude plugin install https://example.com/plugin.tar.gz

# From local directory
claude plugin install ./my-plugin
```

**Publishing:**
```bash
# Validate plugin
claude plugin validate

# Package for distribution
claude plugin pack

# Publish to marketplace
claude plugin publish
```

## x402 Payment Protocol

### Core Concept
HTTP-native micropayments using `402 Payment Required` status code for instant stablecoin settlements.

### Key Features
- **Zero platform fees** (facilitator dependent)
- **2-second settlement** (USDC on Base)
- **$0.001 minimum** payment
- **Chain agnostic** (supports multiple blockchains)
- **One-line integration** for sellers

### Payment Flow

```
┌────────┐                    ┌────────┐                    ┌────────────┐
│ Client │                    │ Server │                    │Facilitator │
└───┬────┘                    └───┬────┘                    └─────┬──────┘
    │                             │                               │
    │ 1. GET /resource            │                               │
    ├────────────────────────────>│                               │
    │                             │                               │
    │ 2. 402 Payment Required     │                               │
    │    + payment options        │                               │
    │<────────────────────────────┤                               │
    │                             │                               │
    │ 3. Construct payment        │                               │
    │    payload                  │                               │
    │                             │                               │
    │ 4. GET /resource            │                               │
    │    X-PAYMENT: {...}         │                               │
    ├────────────────────────────>│                               │
    │                             │                               │
    │                             │ 5. Validate payment           │
    │                             ├──────────────────────────────>│
    │                             │                               │
    │                             │ 6. Validation result          │
    │                             │<──────────────────────────────┤
    │                             │                               │
    │                             │ 7. Settle payment (onchain)   │
    │                             ├──────────────────────────────>│
    │                             │                               │
    │                             │ 8. Settlement result          │
    │                             │<──────────────────────────────┤
    │                             │                               │
    │ 9. 200 OK + resource        │                               │
    │    X-PAYMENT-RESPONSE       │                               │
    │<────────────────────────────┤                               │
    │                             │                               │
```

### HTTP Headers

**402 Response:**
```http
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "x402Version": 1,
  "accepts": [
    {
      "scheme": "eip155",
      "network": "base",
      "maxAmountRequired": "1000",
      "resource": "/api/skill/processor",
      "description": "Skill execution",
      "payTo": "0xABCD...",
      "maxTimeoutSeconds": 300,
      "asset": "USDC"
    }
  ]
}
```

**Payment Request:**
```http
GET /api/skill/processor
X-PAYMENT: {
  "x402Version": 1,
  "scheme": "eip155",
  "network": "base",
  "signature": "0x1234...",
  "from": "0x5678...",
  "nonce": "1234567890",
  "timestamp": 1234567890
}
Content-Type: application/json
```

**Success Response:**
```http
HTTP/1.1 200 OK
X-PAYMENT-RESPONSE: {
  "status": "settled",
  "txHash": "0xABCD...",
  "amount": "1000",
  "timestamp": 1234567890
}
Content-Type: application/json

{
  "result": "Skill execution output"
}
```

### Implementation (Seller)

**Coinbase CDP Integration:**
```typescript
import { X402 } from '@coinbase/x402-sdk';

const x402 = new X402({
  facilitatorUrl: 'https://x402.coinbase.com',
  payTo: process.env.WALLET_ADDRESS,
  network: 'base',
  asset: 'USDC'
});

app.get('/api/skill/:id', async (req, res) => {
  const payment = req.headers['x-payment'];

  if (!payment) {
    return res.status(402).json({
      x402Version: 1,
      accepts: [{
        scheme: 'eip155',
        network: 'base',
        maxAmountRequired: '1000', // $0.001
        resource: req.path,
        payTo: process.env.WALLET_ADDRESS,
        asset: 'USDC'
      }]
    });
  }

  // Validate and settle payment
  const result = await x402.validateAndSettle(payment);

  if (!result.valid) {
    return res.status(402).json({
      error: 'Invalid payment'
    });
  }

  // Execute skill
  const output = await executeSkill(req.params.id, req.body);

  res.setHeader('X-PAYMENT-RESPONSE', JSON.stringify({
    status: 'settled',
    txHash: result.txHash,
    amount: result.amount
  }));

  res.json({ result: output });
});
```

### Implementation (Buyer/Client)

**Manual Payment:**
```typescript
import { X402Client } from '@coinbase/x402-sdk';

const client = new X402Client({
  privateKey: process.env.PRIVATE_KEY,
  facilitatorUrl: 'https://x402.coinbase.com'
});

// First request (no payment)
const response1 = await fetch('https://api.example.com/skill/pdf');

if (response1.status === 402) {
  const paymentOptions = await response1.json();

  // Construct payment
  const payment = await client.createPayment(
    paymentOptions.accepts[0]
  );

  // Retry with payment
  const response2 = await fetch('https://api.example.com/skill/pdf', {
    headers: {
      'X-PAYMENT': JSON.stringify(payment)
    }
  });

  const result = await response2.json();
  console.log(result);
}
```

**Automatic Payment (SDK):**
```typescript
import { X402AutoClient } from '@coinbase/x402-sdk';

const client = new X402AutoClient({
  privateKey: process.env.PRIVATE_KEY,
  facilitatorUrl: 'https://x402.coinbase.com',
  autoRetry: true // Automatically handle 402 responses
});

// SDK handles payment flow automatically
const result = await client.get('https://api.example.com/skill/pdf');
console.log(result);
```

### Cost Examples

| Use Case | Request Cost | 1K Requests | 1M Requests |
|----------|-------------|-------------|-------------|
| Simple API call | $0.001 | $1 | $1,000 |
| Data processing | $0.01 | $10 | $10,000 |
| AI inference | $0.10 | $100 | $100,000 |
| Video processing | $1.00 | $1,000 | $1,000,000 |

**Platform Comparison:**
- **Stripe**: $0.30 + 2.9% (min ~$0.33)
- **PayPal**: $0.49 + 3.4% (min ~$0.52)
- **x402**: $0.001 (0% fees, $0.001 min)

### Facilitators

**Coinbase CDP (Recommended):**
- Network: Base (Ethereum L2)
- Asset: USDC
- Fees: 0%
- Settlement: ~2 seconds
- Requirements: CDP account

**Other Facilitators:**
- Chain-agnostic standard
- Community can build facilitators
- Different chains/assets
- Potentially different fee structures

### Security Considerations

**Prevent Replay Attacks:**
- Include nonce (unique per request)
- Include timestamp (expiration window)
- Server tracks used nonces

**Signature Validation:**
- Verify signature matches `from` address
- Check signature covers all payment data
- Validate against scheme requirements

**Amount Validation:**
- Check amount ≥ maxAmountRequired
- Verify asset matches expected
- Confirm network matches

**Settlement Confirmation:**
- Wait for onchain confirmation
- Handle failed settlements
- Implement refund mechanism

## Integration Example: Skills Marketplace

### Skill Endpoint with x402

```typescript
// Cloudflare Worker
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const skillId = url.pathname.split('/')[3];

    // Check for payment
    const payment = request.headers.get('X-PAYMENT');

    if (!payment) {
      return new Response(JSON.stringify({
        x402Version: 1,
        accepts: [{
          scheme: 'eip155',
          network: 'base',
          maxAmountRequired: '10000', // $0.01
          resource: url.pathname,
          description: `Execute ${skillId} skill`,
          payTo: env.WALLET_ADDRESS,
          asset: 'USDC'
        }]
      }), {
        status: 402,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate payment via facilitator
    const paymentValid = await validatePayment(
      payment,
      env.FACILITATOR_URL
    );

    if (!paymentValid.valid) {
      return new Response(JSON.stringify({
        error: 'Invalid payment'
      }), { status: 402 });
    }

    // Get skill from R2
    const skill = await env.SKILLS_BUCKET.get(skillId);
    if (!skill) {
      return new Response('Skill not found', { status: 404 });
    }

    // Execute skill in sandbox
    const result = await executeSkill(skill, await request.json());

    // Track usage for creator payout
    await env.USAGE_DB.put({
      skillId,
      amount: paymentValid.amount,
      txHash: paymentValid.txHash,
      timestamp: Date.now()
    });

    return new Response(JSON.stringify({
      success: true,
      data: result
    }), {
      headers: {
        'Content-Type': 'application/json',
        'X-PAYMENT-RESPONSE': JSON.stringify({
          status: 'settled',
          txHash: paymentValid.txHash,
          amount: paymentValid.amount
        })
      }
    });
  }
};
```

### Claude Code Integration

**Custom Skill for Marketplace:**
```yaml
---
name: Marketplace Skill Executor
description: >
  Execute skills from the marketplace.
  Use when user requests functionality from marketplace skills.
allowed-tools: Bash
---

# Marketplace Skill Execution

When user requests a marketplace skill:

1. Check available skills: GET /api/skills
2. Select matching skill based on description
3. Execute via endpoint: POST /api/skills/{id}/execute
4. Handle x402 payment automatically
5. Return results to user

## Auto-payment Setup

Export MARKETPLACE_KEY environment variable with x402 private key.

## Example

User: "Extract text from this PDF"
1. Search marketplace for "PDF extract" skill
2. Execute via x402 payment
3. Return extracted text
```

**Usage:**
```
User: Can you process this PDF and extract the text?

Claude: I'll use the marketplace PDF processor skill.

[Automatically executes marketplace skill via x402]

Here's the extracted text:
...
```

## Summary Table

| Feature | Skills | Plugins | x402 |
|---------|--------|---------|------|
| **Purpose** | Add capability | Bundle capabilities | Enable payments |
| **Invocation** | Model-invoked | Varies | HTTP protocol |
| **Distribution** | File-based | Marketplace | Open standard |
| **Scope** | Single task | Multiple components | Payment only |
| **Integration** | Claude Code | Claude Code | Any HTTP API |
| **Versioning** | Manual | Semantic | Protocol version |
| **Monetization** | N/A | Via marketplace | Native (micropayments) |
| **Discovery** | Description | Registry | N/A |
| **Dependencies** | Tools | MCP servers, tools | Facilitator |

## Key Takeaways

**Skills:**
- Autonomous activation based on context
- Focus on single, well-defined capability
- Description is critical for discovery
- Can restrict tool access for security

**Plugins:**
- Package multiple components together
- Distributed via marketplaces
- Include commands, agents, skills, hooks, MCP
- Semantic versioning for updates

**x402:**
- HTTP-native micropayment protocol
- $0.001 minimum, 2-second settlement
- Chain/token agnostic open standard
- Enables pay-per-use for APIs/skills

**Marketplace Opportunity:**
- Combine skills + plugins + x402
- HTTP endpoints for skill execution
- Micropayment monetization for creators
- Global distribution via edge network
- 80/20 revenue split
- Instant payouts via x402
