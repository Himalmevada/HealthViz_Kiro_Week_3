import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // Cache for COVID vaccination data
  CovidDataCache: a
    .model({
      country: a.string().required(),
      data: a.json().required(),
      lastUpdated: a.datetime().required(),
      dataType: a.string().required(), // 'vaccination', 'cases', etc.
    })
    .authorization((allow) => [allow.authenticated()]),

  // Cache for AQI data
  AqiDataCache: a
    .model({
      location: a.string().required(),
      country: a.string().required(),
      data: a.json().required(),
      lastUpdated: a.datetime().required(),
      pollutant: a.string(), // PM2.5, PM10, etc.
    })
    .authorization((allow) => [allow.authenticated()]),

  // User preferences and saved filters
  UserPreferences: a
    .model({
      userId: a.string().required(),
      preferences: a.json().required(),
      savedFilters: a.json(),
      dashboardLayout: a.json(),
    })
    .authorization((allow) => [allow.owner()]),

  // Analytics and insights cache
  AnalyticsCache: a
    .model({
      analysisType: a.string().required(), // 'correlation', 'vulnerability', etc.
      parameters: a.json().required(),
      results: a.json().required(),
      lastUpdated: a.datetime().required(),
    })
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
