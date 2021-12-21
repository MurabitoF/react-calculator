import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./styles.css";

export const ACTIONS = {
	ADD_DIGIT: "add-digit",
	CHOOSE_OPERATION: "choose-operation",
	CLEAR: "clear",
	DELETE_DIGIT: "delete-digit",
	EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
	switch (type) {
		case ACTIONS.ADD_DIGIT:
			if (state.override) {
				return {
					...state,
					currentOperant: payload.digit,
					override: false,
				};
			}
			if (payload.digit === "0" && state.currentOperant === "0") {
				return state;
			}
			if (payload.digit === "." && state.currentOperant.includes(".")) {
				return state;
			}
			return {
				...state,
				currentOperant: `${state.currentOperant || ""}${payload.digit}`,
			};
		case ACTIONS.CHOOSE_OPERATION:
			if (state.currentOperant == null && state.previousOperant == null) {
				return state;
			}

			if (state.currentOperant == null) {
				return {
					...state,
					operation: payload.operation,
				};
			}

			if (state.previousOperant == null) {
				return {
					...state,
					operation: payload.operation,
					previousOperant: state.currentOperant,
					currentOperant: null,
				};
			}
			return {
				...state,
				previousOperant: evaluate(state),
				operation: payload.operation,
				currentOperant: null,
			};
		case ACTIONS.CLEAR:
			return {};
		case ACTIONS.DELETE_DIGIT:
			if (state.override) {
				return {
					...state,
					override: false,
					currentOperant: null,
				};
			}
			if (state.currentOperant == null) return state;
			if (state.currentOperant.length === 1) {
				return {
					...state,
					currentOperant: null,
				};
			}
			return {
				...state,
				currentOperant: state.currentOperant.slice(0, -1),
			};
		case ACTIONS.EVALUATE:
			if (
				state.operation == null ||
				state.currentOperant == null ||
				state.previousOperant == null
			) {
				return state;
			}
			return {
				...state,
				override: true,
				previousOperant: null,
				operation: null,
				currentOperant: evaluate(state),
			};
		default:
			return state;
	}
}

function evaluate({ currentOperant, previousOperant, operation }) {
	const prev = parseFloat(previousOperant);
	const current = parseFloat(currentOperant);
	if (isNaN(prev) || isNaN(current)) return "";
	let computation = "";
	switch (operation) {
		case "+":
			computation = prev + current;
			break;
		case "-":
			computation = prev - current;
			break;
		case "*":
			computation = prev * current;
			break;
		case "÷":
			computation = prev / current;
			break;
		default:
			computation = "";
	}
	return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
	maximumFractionDigits: 0,
});

function formatOperand(operant) {
	if (operant == null) return;
	const [integer, decimal] = operant.split(".");
	if (decimal == null) return INTEGER_FORMATTER.format(integer);
	return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
	const [{ currentOperant, previousOperant, operation }, dispatch] =
		useReducer(reducer, {});

	return (
		<div className="calculator-grid">
			<div className="output">
				<div className="previous-operant">
					{formatOperand(previousOperant)} {operation}
				</div>
				<div className="current-operant">
					{formatOperand(currentOperant)}
				</div>
			</div>
			<button
				className="span-two"
				onClick={() => dispatch({ type: ACTIONS.CLEAR })}
			>
				AC
			</button>
			<button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
				DEL
			</button>
			<OperationButton operation="÷" dispatch={dispatch} />
			<DigitButton digit="1" dispatch={dispatch} />
			<DigitButton digit="2" dispatch={dispatch} />
			<DigitButton digit="3" dispatch={dispatch} />
			<OperationButton operation="*" dispatch={dispatch} />
			<DigitButton digit="4" dispatch={dispatch} />
			<DigitButton digit="5" dispatch={dispatch} />
			<DigitButton digit="6" dispatch={dispatch} />
			<OperationButton operation="+" dispatch={dispatch} />
			<DigitButton digit="7" dispatch={dispatch} />
			<DigitButton digit="8" dispatch={dispatch} />
			<DigitButton digit="9" dispatch={dispatch} />
			<OperationButton operation="-" dispatch={dispatch} />
			<DigitButton digit="." dispatch={dispatch} />
			<DigitButton digit="0" dispatch={dispatch} />
			<button
				className="span-two"
				onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
			>
				=
			</button>
		</div>
	);
}

export default App;
