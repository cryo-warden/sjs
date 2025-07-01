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
import "./SelectionPicker.css";

export const SelectionPicker = () => {
  const selectionIndex = useSelectionIndex();
  const appendNewSelection = useAppendNewSelection(initializeSelectionState);
  const setPreviousSelectionIndex = useSetPreviousSelectionIndex();
  const setNextSelectionIndex = useSetNextSelectionIndex();
  const deleteSelection = useDeleteSelection();
  const selectionsLength = useSelectionsLength();
  return (
    <div className="panel SelectionPicker">
      <button onClick={appendNewSelection} disabled={selectionsLength >= 10}>
        +
      </button>
      <button
        onClick={setPreviousSelectionIndex}
        disabled={selectionIndex <= 0}
      >
        {"<"}
      </button>
      <span>
        {selectionIndex + 1} / {selectionsLength}
      </span>
      <button
        onClick={setNextSelectionIndex}
        disabled={selectionIndex >= selectionsLength - 1}
      >
        {">"}
      </button>
      <button onClick={deleteSelection} disabled={selectionsLength <= 1}>
        X
      </button>
    </div>
  );
};
