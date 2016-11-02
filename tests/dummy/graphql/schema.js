export default function(graphql) {
  const {
    GraphQLList,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLID
  } = graphql;

  const User = new GraphQLObjectType({
    name: 'User',
    description: 'A user',
    fields: {
      id: { type: GraphQLID },
      name: { type: GraphQLString }
    }
  });

  const queryType = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      users: {
        type: new GraphQLList(User),
        resolve: (_parent, _args, { mirage }) => {
          return mirage.users.all().models.map(model => model.attrs);
        }
      }
    }
  });

  return new GraphQLSchema({
    query: queryType
  });
}
