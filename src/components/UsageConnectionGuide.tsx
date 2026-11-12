import { Link } from 'react-router'

export default function UsageConnectionGuide() {
  return <section className="usage-panel usage-guide" aria-labelledby="agent-guide">
    <h2 id="agent-guide">Connect an AI agent or IDE</h2>
    <ol>
      <li><strong>Use your SurStor login.</strong> Create an account in <Link to="/dashboard/personal">My usage</Link>. Store your SurStor email and password in your agent or IDE’s secret settings. Keep them out of chat and source control.</li>
      <li><strong>Choose how to report requests.</strong> If your IDE supports local MCP servers and you have the SurStor Usage Dashboard checkout, use the reporting bridge below. If you control the agent code, you can send events directly without installing the bridge.</li>
    </ol>
    <details><summary>IDE setup: local MCP server</summary>
      <p>Add a <b>stdio</b> server in your IDEâ€™s MCP settings. Use Python 3.11 or newer and set the working directory to the checkout containing the <code>surstor_usage</code> folder.</p>
      <pre><code>{'Command: python\nArguments: -m surstor_usage.mcp\nSURSTOR_USAGE_URL=https://www.surstor.net\nSURSTOR_USAGE_EMAIL=<your SurStor email>\nSURSTOR_USAGE_PASSWORD=<your SurStor password>'}</code></pre>
      <p>Supply the environment variables to that server through your IDE. Restart the MCP server and look for <code>surstor_report_usage</code> and <code>surstor_flush_usage</code>. A collector or agent hook must pass the actual usage from each completed request to the reporting tool. Enabling MCP alone does not collect it.</p>
    </details>
    <details><summary>Agent setup: HTTPS reporting endpoint</summary>
      <p>POST JSON containing <code>email</code> and <code>password</code> to <code>https://www.surstor.net/api/agent-session</code> with <code>Content-Type: application/json</code>. Use the returned <code>access_token</code> for uploads. Sign in again when it expires after one hour.</p>
      <p>After a completed model call, POST one JSON event to <code>https://www.surstor.net/api/events</code> with <code>Content-Type: application/json</code> and <code>Authorization: Bearer &lt;access_token&gt;</code>. Send from your agent process, keeping the credentials out of prompts and source control.</p>
      <pre><code>{JSON.stringify({version:1,event_id:'<new UUID for this request>',occurred_at:'<actual ISO timestamp with timezone>',provider:'local',model:'<model identifier>',integration:'my-agent',usage_source:'inference_server',usage_status:'unknown',input_tokens:null,output_tokens:null,cost:null},null,2)}</code></pre>
      <p>Replace the placeholders and set the source to match your tool. When the provider supplies both counts, use <code>reported</code> with those numbers. Leave unknown counts null. Retry the same event with its original UUID so it is counted once.</p>
    </details>
    <p><strong>Check the connection:</strong> Run one request through the configured tool. For direct uploads, look for <code>accepted: true</code>; for the bridge, flush pending events. Select <b>Refresh usage</b> in your workspace and look for your model and tool. If an upload returns 401, obtain a fresh session and retry the same event.</p>
  </section>
}
