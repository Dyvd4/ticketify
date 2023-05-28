import { FormControl, Input } from "@chakra-ui/react";
import React, { Component } from "react";
import { getMatchingCharLength } from "src/utils/string";
import DiscardButton from "./DiscardButton";
import ListItem from "./ListItem";
import LoadingState from "./LoadingState";
import NotFoundState from "./NotFoundState";

type InputPropsOmitLiterals = "autoComplete" | "value" | "onChange" | "type" | "disabled" | "size";
type InputProps = Omit<React.ComponentPropsWithRef<"input">, InputPropsOmitLiterals>;

interface Props {
	items: any;
	onSelect(item: any, inputValue: string): void;
	onChange(inputValue): void;
	listItemRender(item: any): string | Promise<string>;
	inputValue: string;
	listProps?: React.ComponentPropsWithRef<"ul">;
	inputProps?: InputProps;
	disabled?: boolean;
	filter?: {
		value?(item: any, inputValue: string): boolean | Promise<boolean>;
		option?: "suppressDefaultFilter" | "decide";
	};
	onError?(error: any): void;
	onDiscard?(...args): void;
}

interface State {}

class AutoCompleter extends Component<Props, State> {
	listRef: React.RefObject<HTMLUListElement>;
	inputRef: React.RefObject<HTMLInputElement>;
	listItemObserver: IntersectionObserver;
	maxLength: number;
	state = {
		notFound: false,
		loading: false,
		listItems: [] as any[],
		keyPosition: -1,
		itemToIntersect: null as HTMLLIElement | null,
	};
	constructor(props) {
		super(props);
		this.listRef = React.createRef();
		this.inputRef = React.createRef();
		this.maxLength = 10;
	}
	componentDidMount = () => {
		this.registerKeyboardEvents();
		this.registerClickEvent();
	};
	getListItems = () => {
		return Array.from(this.listRef.current?.querySelectorAll("li") || []);
	};
	// event register
	// --------------
	registerKeyboardEvents = () => {
		this.inputRef.current!.addEventListener("keydown", (e) => {
			e.stopImmediatePropagation();
			if (["ArrowUp", "ArrowDown", "Enter"].includes(e.key)) {
				e.preventDefault();
			}
			const listItems = this.getListItems();
			switch (e.key) {
				case "ArrowUp":
					if (this.state.keyPosition !== -1) {
						let newKeyPosition = this.state.keyPosition - 1;
						const itemToIntersect = listItems[newKeyPosition];
						if (itemToIntersect) {
							itemToIntersect.scrollIntoView({ behavior: "smooth" });
						}
						this.setState({
							keyPosition: newKeyPosition,
						});
					}
					break;
				case "ArrowDown":
					if (this.state.keyPosition !== this.state.listItems.length) {
						let newKeyPosition = this.state.keyPosition + 1;
						const itemToIntersect = listItems[newKeyPosition];
						if (itemToIntersect) {
							itemToIntersect.scrollIntoView({ behavior: "smooth" });
						}
						this.setState({
							keyPosition: newKeyPosition,
						});
					}
					break;
				case "Enter":
					if (this.state.listItems[this.state.keyPosition]) {
						let activeListItem = this.listRef.current!.querySelector(
							".autocomplete-list-item-active"
						)! as HTMLElement;
						activeListItem.click();
					}
					break;
				default:
					break;
			}
		});
	};
	registerClickEvent = () => {
		const handleOutsideClick = (e) => {
			let target = e.target as HTMLElement;
			if (
				!target.closest(".autocomplete-list") &&
				!target.closest(".autocomplete-list-wrapper")
			) {
				this.setState({
					listItems: [],
					keyPosition: -1,
					notFound: false,
				});
			}
		};
		document.addEventListener("mousedown", handleOutsideClick);
		document.addEventListener("touchstart", handleOutsideClick);
	};
	// helper
	// ------
	setListItems = async (scrolledToBottom?: boolean) => {
		const items = scrolledToBottom
			? [
					...this.props.items,
					...this.props.items.slice(
						this.props.items.length,
						this.props.items.length + this.maxLength
					),
			  ]
			: this.props.items.slice(0, this.maxLength);

		let listItems: any = [];
		let { listItemRender, filter } = this.props;
		const inputValue = this.inputRef.current?.value || "";

		for (let i = 0; i < items.length; i++) {
			let item = items[i];

			let displayValue = listItemRender(item);
			if (displayValue instanceof Promise) displayValue = await displayValue;
			let mappedDisplayValue = this.mapDisplayValue(String(displayValue));

			const li = {
				displayValue,
				mappedDisplayValue,
				...item,
			};
			if (inputValue) {
				let usesFilter = filter && filter.value && typeof filter.value === "function";
				if (!usesFilter && this.filter(String(displayValue), inputValue)) {
					listItems.push(li);
				} else if (usesFilter) {
					let defaultFilterMatches = this.filter(String(displayValue), inputValue);
					let customFilterMatches = filter!.value!(item, inputValue);
					if (customFilterMatches instanceof Promise)
						customFilterMatches = await customFilterMatches;

					if (!filter?.option && defaultFilterMatches && customFilterMatches) {
						listItems.push(li);
					} else if (filter?.option && filter?.option === "suppressDefaultFilter") {
						if (customFilterMatches) listItems.push(li);
					} else if (filter?.option && filter?.option === "decide") {
						if (defaultFilterMatches || customFilterMatches) listItems.push(li);
					}
				}
			} else {
				listItems.push(li);
			}
		}
		this.setState({
			loading: false,
			notFound: listItems.length === 0,
			listItems: listItems.sort(
				(a, b) =>
					getMatchingCharLength(inputValue, b.displayValue) -
					getMatchingCharLength(inputValue, a.displayValue)
			),
			keyPosition: listItems.length === 0 ? -1 : this.state.keyPosition,
		});
	};
	mapDisplayValue = (displayValue: string) => {
		let displayValueChars = displayValue.split("");
		let inputValueChars = this.inputRef.current!.value.split("");
		return displayValueChars.map((listItemChar, index) => {
			if (inputValueChars.includes(listItemChar)) {
				return (
					<span key={index} className="text-black dark:text-white">
						{listItemChar}
					</span>
				);
			}
			return <span key={index}>{listItemChar}</span>;
		});
	};
	filter = (displayValue: string, inputValue: string) => {
		// checks if any char is included in input value
		let displayValueChars = displayValue.split("");
		let inputValueChars = inputValue.split("");
		for (let i = 0; i < displayValueChars.length; i++) {
			let displayValueChar = displayValueChars[i];
			if (inputValueChars.includes(displayValueChar)) {
				return true;
			}
		}
		return false;
	};
	// event handler
	// -------------
	handleInputChange = (e) => {
		this.props.onChange(e.target.value);
		this.setState(
			{
				loading: true,
			},
			() => {
				this.setListItems();
			}
		);
	};
	handleReset = () => {
		this.setState({
			listItems: [],
			keyPosition: -1,
			notFound: false,
			loading: false,
			inputValue: "",
		});
	};
	handleClick = (item: any, displayValue: string) => {
		this.setState({
			inputValue: displayValue,
			listItems: [],
			keyPosition: -1,
		});
		this.props.onSelect(item, displayValue);
	};
	handleDiscard = () => {
		this.setState({ selected: false });
		if (this.props.onDiscard) this.props.onDiscard();
	};
	handleScroll = async (e) => {
		let autoCompleteList = e.target;
		let scrolledToBottom =
			Math.ceil(autoCompleteList.scrollHeight - autoCompleteList.scrollTop) ===
			autoCompleteList.clientHeight;
		if (scrolledToBottom) {
			this.setListItems(true);
		}
	};
	render() {
		const { listItems } = this.state;
		const { className: listClassName, ...restListProps } = this.props.listProps || {};
		let { style: inputStyle, ...restInputProps } = this.props.inputProps || {};
		inputStyle =
			listItems.length > 0
				? {
						borderRadius: ".25rem .25rem 0 0",
						width: "100%",
						...inputStyle,
				  }
				: {
						width: "100%",
						...inputStyle,
				  };
		return (
			<FormControl className="form-group autocomplete-list-wrapper relative">
				<div className="flex items-center justify-center gap-2">
					<Input
						onChange={this.handleInputChange}
						onFocus={() => this.setListItems()}
						ref={this.inputRef}
						autoComplete="off"
						value={this.props.inputValue ? this.props.inputValue : ""}
						type="text"
						disabled={this.props.disabled}
						style={inputStyle}
						{...restInputProps}
					/>
					{this.props.onDiscard && (
						<>
							<DiscardButton
								onClick={this.handleDiscard}
								className={this.props.inputValue ? "visible" : "hidden"}
							/>
						</>
					)}
				</div>
				<ul
					ref={this.listRef}
					className={`autocomplete-list no-select dark:bg-gray-700
                                ${
									listItems.length === 0 && !this.state.notFound
										? "border-b-0 p-0"
										: ""
								}
                                ${listClassName}`}
					onScroll={this.handleScroll}
					{...restListProps}
				>
					{this.state.loading && <LoadingState />}
					{this.state.notFound && !this.state.loading && <NotFoundState />}
					{this.state.listItems.map(
						({ displayValue, mappedDisplayValue, ...item }, index) => (
							<ListItem
								active={this.state.keyPosition === index}
								onClick={(e) => {
									e.stopPropagation();
									this.handleClick(item, displayValue as string);
								}}
								key={item.id}
							>
								{mappedDisplayValue}
							</ListItem>
						)
					)}
				</ul>
			</FormControl>
		);
	}
}

export default AutoCompleter;
