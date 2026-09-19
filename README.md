# Greentube Petstore API Automation

REST API automation for the PET endpoints provided by the [Swagger Petstore](https://petstore.swagger.io/).

The project uses TypeScript and Playwright Test to cover successful CRUD operations, negative validation, response bodies, and HTTP status codes.

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

Run the complete API test suite:

```bash
npm test
```

Run the complete quality gate:

```bash
npm run check
```

The quality gate runs:

- TypeScript type checking
- ESLint
- Prettier verification

## HTML report

Tests generate a Playwright HTML report in `playwright-report/`.

Open the most recent report with:

```bash
npm run test:report
```

Stop the report server with `Ctrl+C` after reviewing it.

## Automated scenarios

| Scenario                         | Requests                                               | Main assertions                                                             |
| -------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------- |
| Create and retrieve a pet        | `POST /pet`, `GET /pet/{petId}`                        | Status `200`; POST matches the submitted pet; GET matches the POST response |
| Update an existing pet           | `POST /pet`, `PUT /pet`, `GET /pet/{petId}`            | Status `200`; PUT contains the update; a following GET confirms persistence |
| Delete an existing pet           | `POST /pet`, `DELETE /pet/{petId}`, `GET /pet/{petId}` | DELETE returns `200`; the following GET returns `404`                       |
| Reject an unsupported media type | `POST /pet`, `GET /pet/{petId}`                        | A `text/plain` POST returns `415`; the rejected pet does not exist          |

The suite explicitly verifies:

- `200 OK`
- `404 Not Found`
- `415 Unsupported Media Type`

## Project structure

```text
src/
├── clients/
│   └── pet.client.ts
├── factories/
│   └── pet.factory.ts
└── models/
    └── pet.model.ts

tests/
├── pet.lifecycle.spec.ts
└── pet.validation.spec.ts
```

- `PetClient` contains HTTP operations without assertions.
- The factory provides isolated test data with timestamp-based IDs.
- The model describes the Petstore request and response structure.
- The tests contain behavioral and status-code assertions.

## Test design

- Each test creates its own pet and does not depend on execution order.
- Tests run with one worker because the target is a shared public service.
- Automatic retries are disabled so repeated write requests cannot hide failures.
- `afterEach` cleanup removes test data even when an assertion fails.

## External-service limitation

The tests run against the public Swagger Petstore. Results can be affected by service availability, network connectivity, or changes to the shared demonstration environment.
