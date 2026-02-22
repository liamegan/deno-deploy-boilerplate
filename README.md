## Getting started

NOTE: need to be able to deploy before deno deploy creates databases

- Clone the repo
- Create the app
- Add a database
- Add the pre-deploy hook to the app - deno task db:migrate:deploy
- Deno init
- Deno install
- deno run -A npm:prisma generate
- deno task --tunnel dev

- deno run --tunnel db:migrate
- Push?
