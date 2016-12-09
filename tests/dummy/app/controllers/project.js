import Ember from 'ember';
import npmCashay from 'npm:cashay';

const { Controller, Logger } = Ember;
const { cashay } = npmCashay;

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
