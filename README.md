# Greentube Petstore API Automation

REST API automation for the PET endpoints provided by the [Swagger Petstore](https://petstore.swagger.io/).

The project uses:

- TypeScript for implementation
- Cucumber.js for Gherkin scenarios, execution, hooks, and reporting
- Playwright for HTTP requests
- Node.js strict assertions for verification

## Prerequisites

Install:

- Node.js 24 LTS
- npm

## Installation

Install the exact dependency versions from `package-lock.json`:

```bash
npm ci
```

## Running the tests

Run all Cucumber scenarios:

```bash
npm test
```

Validate feature syntax and step matching without sending HTTP requests:

```bash
npm run test:dry-run
```

Run the complete code quality gate:

```bash
npm run check
```

The quality gate runs:

- TypeScript type checking
- ESLint
- Prettier verification

## Cucumber report

Every Cucumber run produces:

```text
reports/cucumber-report.html
```

Open this file in a browser to inspect scenarios, steps, hooks, durations, and failures.

## Automated scenarios

| Feature                | Scenario                         | Requests                                               | Main assertions                                                             |
|------------------------|----------------------------------|--------------------------------------------------------|-----------------------------------------------------------------------------|
| Pet lifecycle          | Create and retrieve a pet        | `POST /pet`, `GET /pet/{petId}`                        | Status `200`; POST matches the submitted pet; GET matches the POST response |
| Pet lifecycle          | Update an existing pet           | `POST /pet`, `PUT /pet`, `GET /pet/{petId}`            | Status `200`; PUT contains the update; a following GET confirms persistence |
| Pet lifecycle          | Delete an existing pet           | `POST /pet`, `DELETE /pet/{petId}`, `GET /pet/{petId}` | DELETE returns `200`; the following GET returns `404`                       |
| Pet request validation | Reject an unsupported media type | `POST /pet`, `GET /pet/{petId}`                        | A `text/plain` POST returns `415`; the rejected pet does not exist          |

The suite explicitly verifies:

- `200 OK`
- `404 Not Found`
- `415 Unsupported Media Type`

## Project structure

```text
features/
├── pet-lifecycle.feature
├── pet-validation.feature
├── step-definitions/
│   └── pet.steps.ts
└── support/
    ├── hooks.ts
    └── world.ts

src/
├── clients/
│   └── pet.client.ts
├── factories/
│   └── pet.factory.ts
└── models/
    └── pet.model.ts

cucumber.cjs
```

### Feature files

The `.feature` files describe the API behavior in Gherkin without implementation details.

### Step definitions

`pet.steps.ts` translates Given/When/Then statements into TypeScript requests and assertions.

### World

Cucumber creates a new `PetWorld` for every scenario. It stores scenario-specific state such as:

- API request context
- Pet client
- Generated payload
- Latest response
- Expected and actual response bodies

No state is shared between scenarios.

### Hooks

The `Before` hook creates a new Playwright `APIRequestContext` and `PetClient`.

The `After` hook:

1. Attempts to delete the scenario's generated pet.
2. Disposes the API request context.

Cleanup runs even when a scenario fails.

### API client

`PetClient` contains the POST, GET, PUT, and DELETE operations without assertions. Assertions remain in the Cucumber step definitions.

## Test design

- Every scenario receives a new World and a timestamp-based pet ID.
- Scenarios do not depend on execution order.
- Scenarios run serially because the target is a shared public service.
- Automatic retries are not configured, so repeated write requests cannot hide failures.
- Required setup is visible through Gherkin steps rather than hidden inside hooks.
- Invalid requests use the raw Playwright request context rather than complicating the valid `PetClient` interface.

## External-service limitation

The tests run against the public Swagger Petstore. Results can be affected by service availability, network connectivity, or changes to the shared demonstration environment.
