import { gridClasses } from '../constants/gridClasses';
import { GridRowId } from '../models/gridRows';

export function isOverflown(element: Element): boolean {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

export function findParentElementFromClassName(elem: Element, className: string): Element | null {
  return elem.closest(`.${className}`);
}

export function getRowEl(cell?: Element | null): HTMLElement | null {
  if (!cell) {
    return null;
  }
  return findParentElementFromClassName(cell as HTMLDivElement, gridClasses.row)! as HTMLElement;
}

// TODO remove
export function isGridCellRoot(elem: Element | null): boolean {
  return elem != null && elem.classList.contains(gridClasses.cell);
}

export function isGridHeaderCellRoot(elem: Element | null): boolean {
  return elem != null && elem.classList.contains(gridClasses.columnHeader);
}

function escapeOperandAttributeSelector(operand: string): string {
  return operand.replace(/["\\]/g, '\\$&');
}

export function getGridColumnHeaderElement(root: Element, field: string) {
  return root.querySelector<HTMLDivElement>(
    `[role="columnheader"][data-field="${escapeOperandAttributeSelector(field)}"]`,
  );
}
function getGridRowElementSelector(id: GridRowId): string {
  return `.${gridClasses.row}[data-id="${escapeOperandAttributeSelector(String(id))}"]`;
}

export function getGridRowElement(root: Element, id: GridRowId) {
  return root.querySelector<HTMLDivElement>(getGridRowElementSelector(id));
}

export function getGridCellElement(root: Element, { id, field }: { id: GridRowId; field: string }) {
  const rowSelector = getGridRowElementSelector(id);
  const cellSelector = `.${gridClasses.cell}[data-field="${escapeOperandAttributeSelector(
    field,
  )}"]`;
  return root.querySelector<HTMLDivElement>(`${rowSelector} ${cellSelector}`);
}
