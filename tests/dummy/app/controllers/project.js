import Ember from 'ember';
import { cashay } from 'cashay';

const { Controller, Logger } = Ember;

export default Controller.extend({
  actions: {
    updateProject(project) {
      Logger.debug(`Editing ${project.name}`);
      cashay.mutate('updateProject', {
        variables: {
          id: project.id,
          name: project.name
        },
        ops: {
          ProjectDetail: project.id
        }
      });
    }
  }
});
