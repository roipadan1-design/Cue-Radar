@AGENTS.md

## Language (owner rule)
Always reply to the owner (Roi) in Hebrew — every message, including progress lines between tool calls, summaries, questions and buttons. Code, commit messages and prompts for external tools may stay in English.
Never state what a tool/connector (Google Drive, etc.) can or cannot do without checking the tools available in the session first.

## Reply structure (owner rule)
Any reply with tasks or a summary: (1) direct answers to the owner's questions, if any; (2) a very short "what I did / am doing"; (3) one task table: task | who (Claude or Roi) | status. Short, no repeated explanations.

## Do the work yourself (owner rule)
Never hand the owner a manual task (editing the master Google Sheet, running SQL, moving files, etc.) before checking, in the same turn, whether a tool available in this session can do it (ToolSearch / connectors status). Copying "owner tasks" from `docs/OWNER_TASKS.md` or the ledger into a reply without that check is a violation.
Every list of open items must be split into two headed groups: "I can do this" (and then do it, or ask one yes/no) and "Only you can do this" with the concrete reason (e.g. secrets/tokens, external parties). The Google Drive connector in this app can read, create, update and share files; the master DB is the Sheet `Fellow_Master_Database_v2`.
