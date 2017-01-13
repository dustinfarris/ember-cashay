import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull
} from 'graphql';


// TYPES

const Project = new GraphQLObjectType({
  name: 'Project',
  description: 'A group of todos working toward a common goal',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    projectTodos: {
      type: new GraphQLList(Todo),
      resolve: ({ id }, _args, { schema }) => {
        return schema.todos.where({ projectId: id }).models.map(model => model.attrs);
      }
    }
  })
});

const Todo = new GraphQLObjectType({
  name: 'Todo',
  description: 'Something that needs to be done',
  fields: () => ({
    id: { type: GraphQLID },
    project: { type: Project },
    createdAt: { type: GraphQLString },
    description: { type: GraphQLString }
  })
});


// QUERIES

const rootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    projects: {
      type: new GraphQLList(Project),
      resolve: (_parent, _args, { schema }) => {
        console.log(`Reading all projects from database`);
        return schema.projects.all().models.map(model => model.attrs);
      }
    },
    project: {
      type: Project,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'The project ID for the desired project'
        }
      },
      resolve: (_parent, { id }, { schema }) => {
        console.log(`Reading project ${id} from database`);
        return schema.projects.find(id).attrs;
      }
    }
  })
});


// SUBSCRIPTIONS

const rootSubscription = new GraphQLObjectType({
  name: 'RootSubscription',
  fields: () => ({
    project: {
      type: Project,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'The unique project id'
        }
      }
    },
    projectTodos: {
      type: new GraphQLList(Todo),
      args: {
        project_id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'The unique project id'
        }
      }
    }
  })
});


// MUTATIONS

const rootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: () => ({
    createTodo: {
      type: GraphQLBoolean,
      description: 'Create a new todo',
      args: {
        project_id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'The id of the project this todo will belong to'
        },
        description: {
          type: GraphQLString,
          description: 'The description of the new todo'
        }
      },
      resolve(_parent, { project_id, description }, { schema, socketServer }) {
        const todo = schema.create('todo', { projectId: project_id, description });

        // In real life, notifying websockets would likely go somewhere else
        const message = {
          topic: `projectTodos:${project_id}`,
          data: {
            type: 'add',
            objects: [{ id: todo.attrs.id, description: todo.attrs.description }]
          }
        }
        socketServer.send(message);

        return true;
      }
    },
    createProject: {
      type: GraphQLBoolean,
      description: 'Create a new project',
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The name of the new project'
        },
        description: {
          type: GraphQLString,
          description: 'The description of the new project'
        }
      },
      resolve(_parent, { name, description }, { schema }) {
        console.log(`Creating project in database`);
        return schema.create('project', { name, description }).attrs;
      }
    },
    updateProject: {
      type: GraphQLBoolean,
      description: 'Update an existing project',
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'The project ID'
        },
        name: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The updated name of the project'
        },
        description: {
          type: GraphQLString,
          description: 'The updated description of the project'
        }
      },
      resolve(_parent, { id, name, description }, { schema }) {
        console.log(`Updating project ${id} in database`);
        return schema.projects.find(id).update({ name, description });
      }
    },
    deleteProject: {
      type: GraphQLBoolean,
      description: 'Delete a project',
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'The project ID'
        }
      },
      resolve(_parent, { id }, { schema }) {
        console.log(`Deleting project ${id} from database`);
        schema.projects.find(id).destroy();
        return true;
      }
    }
  })
});


// SCHEMA

export default new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
  subscription: rootSubscription
});
