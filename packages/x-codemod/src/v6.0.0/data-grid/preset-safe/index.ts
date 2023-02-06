import transformColumnMenu from '../column-menu-components-rename';
import renameRowSelectionProps from '../row-selection-props-rename';
import renameRowsPerPageOptions from '../rename-rowsPerPageOptions-prop';
import removeDisableExtendRowFullWidth from '../remove-disableExtendRowFullWidth-prop';
import renameLinkOperatorsLogicOperators from '../rename-linkOperators-logicOperators';
import renameSelectorsAndEvents from '../rename-selectors-and-events';
import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  file.source = transformColumnMenu(file, api, options);
  file.source = renameRowSelectionProps(file, api, options);
  file.source = renameRowsPerPageOptions(file, api, options);
  file.source = removeDisableExtendRowFullWidth(file, api, options);
  file.source = renameLinkOperatorsLogicOperators(file, api, options);
  file.source = renameSelectorsAndEvents(file, api, options);

  return file.source;
}
