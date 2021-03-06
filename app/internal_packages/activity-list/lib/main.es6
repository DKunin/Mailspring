import { ComponentRegistry, WorkspaceStore } from 'mailspring-exports';
import { HasTutorialTip } from 'mailspring-component-kit';
import ActivityListButton from './activity-list-button';
import ActivityListStore from './activity-list-store';

const ActivityListButtonWithTutorialTip = HasTutorialTip(ActivityListButton, {
  title: 'Open and link tracking',
  instructions: "If you've enabled link tracking or read receipts, those events will appear here!",
});

export function activate() {
  // ActivityListStore.activate();
}

export function deactivate() {
  // ComponentRegistry.unregister(ActivityListButtonWithTutorialTip);
}
