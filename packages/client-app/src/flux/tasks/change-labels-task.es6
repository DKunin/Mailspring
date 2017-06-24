import Category from '../models/category';
import ChangeMailTask from './change-mail-task';

// Public: Create a new task to apply labels to a message or thread.
//
// Takes an options object of the form:
// - labelsToAdd: An {Array} of {Category}s or {Category} ids to add
// - labelsToRemove: An {Array} of {Category}s or {Category} ids to remove
// - threads: An {Array} of {Thread}s or {Thread} ids
// - messages: An {Array} of {Message}s or {Message} ids
export default class ChangeLabelsTask extends ChangeMailTask {

  constructor(options = {}) {
    super(options);
    this.source = options.source
    this.labelsToAdd = options.labelsToAdd || [];
    this.labelsToRemove = options.labelsToRemove || [];
    this.taskDescription = options.taskDescription;
  }

  label() {
    return "Applying labels";
  }

  categoriesToAdd() {
    return this.labelsToAdd;
  }

  categoriesToRemove() {
    return this.labelsToRemove;
  }

  description() {
    if (this.taskDescription) {
      return this.taskDescription;
    }

    let countString = "";
    if (this.threadIds.length > 1) {
      countString = ` ${this.threadIds.length} threads`;
    }

    const removed = this.labelsToRemove[0];
    const added = this.labelsToAdd[0];
    const objectsAvailable = (added || removed) instanceof Category;

    // Note: In the future, we could move this logic to the task
    // factory and pass the string in as this.taskDescription (ala Snooze), but
    // it's nice to have them declaratively based on the actual labels.
    if (objectsAvailable) {
      const looksLikeMove = (this.labelsToAdd.length === 1 && this.labelsToRemove.length > 0);

      // Spam / trash interactions are always "moves" because they're the three
      // folders of Gmail. If another folder is involved, we need to decide to
      // return either "Moved to Bla" or "Added Bla".
      if (added && added.name === 'spam') {
        return `Marked${countString} as Spam`;
      } else if (removed && removed.name === 'spam') {
        return `Unmarked${countString} as Spam`;
      } else if (added && added.name === 'trash') {
        return `Trashed${countString}`;
      } else if (removed && removed.name === 'trash') {
        return `Removed${countString} from Trash`;
      }
      if (looksLikeMove) {
        if (added.name === 'all') {
          return `Archived${countString}`;
        } else if (removed.name === 'all') {
          return `Unarchived${countString}`;
        }
        return `Moved${countString} to ${added.displayName}`;
      }
      if (this.labelsToAdd.length === 1 && this.labelsToRemove.length === 0) {
        return `Added ${added.displayName}${countString ? ' to' : ''}${countString}`;
      }
      if (this.labelsToAdd.length === 0 && this.labelsToRemove.length === 1) {
        return `Removed ${removed.displayName}${countString ? ' from' : ''}${countString}`;
      }
    }
    return `Changed labels${countString ? ' on' : ''}${countString}`;
  }

  _isArchive() {
    const toAdd = this.labelsToAdd.map(l => l.name)
    return toAdd.includes("all") || toAdd.includes("archive")
  }
}