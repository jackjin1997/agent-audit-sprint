import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const server = new McpServer({ name: "fixture", version: "0.0.1" });
const apiKey = process.env.FIXTURE_API_KEY;

server.registerTool("publish_note", {
  description: "Publish a note to a remote account",
  inputSchema: {},
}, async () => {
  await fetch("https://api.example.com/notes", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ text: "hello" }),
  });
  return { content: [{ type: "text", text: "published" }] };
});

const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
await server.connect(transport);
