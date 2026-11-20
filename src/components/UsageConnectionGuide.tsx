import { Link } from 'react-router'
const wheel='https://www.surstor.net/downloads/surstor_usage_mcp-0.2.0-py3-none-any.whl'
const config=JSON.stringify({mcpServers:{'surstor-usage':{command:'surstor-usage-mcp',args:[],env:{SURSTOR_USAGE_TOKEN:'<upload token>'}}}},null,2)
const example={version:1,event_id:'<new UUID per model request>',occurred_at:'<actual ISO timestamp with timezone>',provider:'anthropic',model:'claude-example',integration:'my-agent',usage_source:'provider_response',usage_status:'reported',input_tokens:140,output_tokens:20,cache_read_tokens:30,cache_write_tokens:10,cost:{amount:'0.001200',currency:'USD',kind:'provider_reported',pricing_version:null}}
export default function UsageConnectionGuide() {
 return <section className="usage-panel usage-guide" aria-labelledby="agent-guide">
  <h2 id="agent-guide">Connect an AI agent or IDE</h2>
  <p>SurStor receives usage metadata, token counts and costs. The bridge runs locally over stdio. Claude Code can collect usage through the supplied hook; other hosts must supply actual usage to the reporting tool.</p>
  <ol>
   <li>Sign in and create a named token under <Link to="/dashboard/personal#upload-tokens">Upload tokens</Link>. Store it in your tool's secret settings as <code>SURSTOR_USAGE_TOKEN</code>.</li>
   <li>Install Python 3.11+ and <a href="https://pipx.pypa.io/stable/installation/">pipx</a>, then install the bridge. The download requires no repository access.</li>
  </ol>
  <pre><code>{'pipx install '+wheel}</code></pre>
  <p><a href={wheel}>Download bridge 0.2.0</a></p>
  <details><summary>Set your token and check the connection</summary>
   <p>In PowerShell, enter the token in a hidden prompt. This sets it for this shell and tools launched from it.</p>
   <pre><code>{'$secureToken = Read-Host "SurStor upload token" -AsSecureString\n$env:SURSTOR_USAGE_TOKEN = [System.Net.NetworkCredential]::new("", $secureToken).Password\nsurstor-usage-mcp --check'}</code></pre>
   <p>In Bash, use a hidden prompt.</p>
   <pre><code>{'read -rs -p "SurStor upload token: " SURSTOR_USAGE_TOKEN\nexport SURSTOR_USAGE_TOKEN\nsurstor-usage-mcp --check'}</code></pre>
   <p>Expect “Upload token valid. Connection OK.” The check creates no usage event. Revoke a lost token in the dashboard.</p>
  </details>
  <details><summary>Claude Code — automatic usage</summary>
   <p>Run these commands in the shell where you set the token. The hooks inherit that shell's environment. Restart Claude Code from that shell after installation.</p>
   <pre><code>{'claude mcp add --transport stdio surstor-usage -- surstor-usage-mcp\nsurstor-usage-mcp install-hook claude-code'}</code></pre>
   <p>Approve the hooks in Claude Code, complete a request, then select Refresh usage here. The collector groups repeated request entries and includes cache reads and writes in input tokens. Unsupported or missing usage is skipped. Hooks run after main and subagent turns and at session end.</p>
   <p>The installer adds to your existing Claude settings and saves a backup. If the host stops before a background upload finishes, use surstor_flush_usage on the next session.</p>
  </details>
  <details><summary>Cursor — local MCP</summary><p>Add this server to <code>~/.cursor/mcp.json</code>, replacing the token placeholder in your local settings. If the command is not found, use its absolute installed path.</p><pre><code>{config}</code></pre><p>Restart or reload MCP. Your agent must call surstor_report_usage with actual per-request counts. Automatic Cursor telemetry collection is not included.</p></details>
  <details><summary>Claude Desktop — local MCP</summary><p>Open Settings → Developer → Edit Config and merge this server into <code>claude_desktop_config.json</code>. Use the absolute installed command path if the desktop app cannot find it.</p><pre><code>{config}</code></pre><p>Restart Claude Desktop. Available tools are surstor_report_usage, surstor_flush_usage and surstor_check_connection. Reporting requires actual counts supplied by your tool or collector.</p></details>
  <details><summary>Your own agent — HTTPS</summary>
   <pre><code>{'POST https://www.surstor.net/api/events\nAuthorization: Bearer <upload token>\nContent-Type: application/json'}</code></pre>
   <p>Send one event per completed model request. Replace the UUID and timestamp placeholders. The numbers below are synthetic examples.</p>
   <pre><code>{JSON.stringify(example,null,2)}</code></pre>
   <p>For unknown usage, set usage_status to unknown, all token counts to null, and cost to null. Retry with the original event_id.</p>
   <p>Check credentials first with <code>POST https://www.surstor.net/api/check-connection</code>, the same Authorization header and an empty JSON object.</p>
  </details>
  <details><summary>Full event contract and allowed values</summary>
   <p><a href="/downloads/event-contract.md">Download field reference</a> · <a href="/downloads/event-schema.json">Download JSON Schema</a></p>
   <ul>
    <li><code>version</code> must be integer 1. <code>event_id</code> is a stable UUID per model request. Optional <code>project_id</code> is an opaque UUID.</li>
    <li><code>occurred_at</code> is an ISO timestamp with timezone and up to six fractional digits, at most five minutes in the future.</li>
    <li><code>provider</code>, <code>model</code> and <code>integration</code> start with a letter or digit and contain 1–128 letters, digits, dots, underscores, colons, slashes or hyphens. URLs, paths and credential-like strings are rejected.</li>
    <li><code>usage_source</code> is provider_response, harness_event, inference_server or manual.</li>
    <li><code>usage_status</code> is reported, estimated, incomplete or unknown. Reported requires input and output counts. Unknown requires null counts.</li>
    <li><code>input_tokens</code> and <code>output_tokens</code> are required, each null or an integer from 0 to 1,000,000,000. Optional cache_read_tokens and cache_write_tokens follow the same limits.</li>
    <li>Input includes cache reads and writes. Their sum must not exceed input. For Anthropic, sum input_tokens, cache_read_input_tokens and cache_creation_input_tokens.</li>
    <li><code>cost</code> is null or contains exactly amount, currency, kind and pricing_version. Amount is a nonnegative decimal string with up to nine integer and six fractional digits. Currency is three uppercase letters. Kind is provider_reported or estimated. Pricing_version is an identifier, or null for provider-reported costs.</li>
    <li>The JSON body is limited to 16,384 bytes. Extra fields, prompt content, responses and tool arguments are rejected. Use per-request counts, not session totals.</li>
   </ul>
  </details>
  <div className="usage-scroll"><table><thead><tr><th>Response</th><th>Meaning</th><th>Next step</th></tr></thead><tbody>
   <tr><td>201</td><td>Stored</td><td>Refresh usage</td></tr>
   <tr><td>200, duplicate</td><td>Already stored</td><td>Delivery complete</td></tr>
   <tr><td>409</td><td>Same ID, different data</td><td>Check request ID generation</td></tr>
   <tr><td>422</td><td>Invalid field</td><td>Read error.field and error.message</td></tr>
   <tr><td>401</td><td>Invalid or revoked credential</td><td>Check or replace the upload token</td></tr>
   <tr><td>429 / 503</td><td>Limit reached / unavailable</td><td>Retry later with the same event ID</td></tr>
  </tbody></table></div>
 </section>
}
