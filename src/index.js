import { runPlanner } from './agent/planner.js';

async function main() {
  const input = `
Tasks: fix bug, gym, business work
Energy: medium
`;

  const result = await runPlanner(input);

  console.log('\n=== RESULT ===\n');
  console.log(result);
}

main();
