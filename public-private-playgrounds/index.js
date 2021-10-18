const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");
const expressPlayground = require("graphql-playground-middleware-express").default;
const { buildSchema, getIntrospectionQuery, graphqlSync } = require("graphql");

const publicDocument = `
type Query {
    cities: [City!]!
}
  
type City {
    name: String
}`;

const privateDocument = `
extend type City {
    country: String
}`;

const cities = [
  { name: "Den Haag", country: "Netherlands" },
  { name: "Bratislava", country: "Slovakia" },
];

const resolvers = {
  Query: {
    cities: () => cities,
  },
};

const app = express();

app.get(
  "/playground",
  expressPlayground({
    endpoint: "/graphql",
    // Perform introspection of the public source document.
    // setting the schema will prevent it from performing introspection on the endpoint
    // regardless if the server allows it.
    schema: graphqlSync(buildSchema(publicDocument), getIntrospectionQuery()).data,
  })
);

const start = async () => {
  const server = new ApolloServer({
    typeDefs: [gql(publicDocument), gql(privateDocument)],
    resolvers,
  });
  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`🚀  Server ready at http://localhost:4000`);
  });
};

start();
