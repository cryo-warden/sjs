import {
  initializeSelectionState,
  useDeleteSelection,
  useSelectionIndex,
  useSelectionsLength,
} from "./StateContext";
import {
  useAppendNewSelection,
  useSetPreviousSelectionIndex,
  useSetNextSelectionIndex,
} from "./StateContext";

export const SelectionPicker = () => {
  const selectionIndex = useSelectionIndex();
  const appendNewSelection = useAppendNewSelection(initializeSelectionState);
  const setPreviousSelectionIndex = useSetPreviousSelectionIndex();
  const setNextSelectionIndex = useSetNextSelectionIndex();
  const deleteSelection = useDeleteSelection();
  const selectionsLength = useSelectionsLength();
  return (
    <div className="panel SelectionPicker">
      <p>Current Selection: {selectionIndex}</p>
      <button onClick={appendNewSelection} disabled={selectionsLength >= 10}>
        Start New Selection
      </button>
      <button
        onClick={setPreviousSelectionIndex}
        disabled={selectionIndex <= 0}
      >
        Previous Selection
      </button>
      <button
        onClick={setNextSelectionIndex}
        disabled={selectionIndex >= selectionsLength - 1}
      >
        Next Selection
      </button>
      <button onClick={deleteSelection} disabled={selectionsLength <= 1}>
        Delete Selection
      </button>
    </div>
  );
};
