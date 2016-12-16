import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull
} from 'graphql';

// QUERIES

const Project = new GraphQLObjectType({
  name: 'Project',
  description: 'A group of todos working toward a common goal',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    todos: {
      type: new GraphQLList(Todo),
      resolve: ({ id }, _args, { db }) => {
        return db.todos.where({ projectId: id }).models.map(model => model.attrs);
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

const rootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    projects: {
      type: new GraphQLList(Project),
      resolve: (_parent, _args, { db }) => {
        console.log(`Reading all projects from database`);
        return db.projects.all().models.map(model => model.attrs);
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
      resolve: (_parent, { id }, { db }) => {
        console.log(`Reading project ${id} from database`);
        return db.projects.find(id).attrs;
      }
    }
  })
});


// MUTATIONS

const rootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: () => ({
    createProject: {
      type: Project,
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
      resolve(_parent, { name, description }, { db }) {
        console.log(`Creating project in database`);
        return db.create('project', { name, description }).attrs;
      }
    },
    updateProject: {
      type: Project,
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
      resolve(_parent, { id, name, description }, { db }) {
        console.log(`Updating project ${id} in database`);
        return db.projects.find(id).update({ name, description });
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
      resolve(_parent, { id }, { db }) {
        console.log(`Deleting project ${id} from database`);
        db.projects.find(id).destroy();
        return true;
      }
    }
  })
});


// SCHEMA

export default new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation
});
