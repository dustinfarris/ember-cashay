export default function(graphql) {
  const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString
  } = graphql;

  /* Add your object types here

  // Example:

  const User = new GraphQLObjectType({
    name: 'User',
    description: 'A user',
    fields: {
      id: { type: GraphQLID },
      name: { type: GraphQLString }
    }
  });

  */

  const query = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      /* Add your query fields here */

      // Example:

      hello: {
        type: GraphQLString,
        resolve() {
          return 'world';
        }
      }

      /*

      // Example using Mirage and the User type above

      users: {
        type: new GraphQLList(User),
        resolve: (_parent, _args, { mirage }) => {
          return mirage.users.all().models.map(model => model.attrs);
        }
      }

      */
    }
  });

  return new GraphQLSchema({ query });
}
