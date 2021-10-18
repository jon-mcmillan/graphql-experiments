# Public and Private GraphQL Playgrounds

An example of how to hide part of the schema from the playground.

This only hides the schema. If the field is requested, it will still resolve.

```graphql
query {
  cities {
    "This is public"
    name

    "This is private"
    country
  }
}
```
