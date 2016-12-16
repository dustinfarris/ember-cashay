import Ember from 'ember';
import { cashay } from 'cashay';

const { Controller, Logger } = Ember;

export default Controller.extend({
  actions: {
    createProject(project) {
      Logger.debug(`Creating ${project.name}!`);
      cashay.mutate('createProject', {
        variables: { name: project.name }
      });
    },
    deleteProject(project) {
      Logger.debug(`Removing ${project.name}`);
      cashay.mutate('deleteProject', {
        variables: { id: project.id }
      });
    }
  }
});
