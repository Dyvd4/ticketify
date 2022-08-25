import { Input } from '@chakra-ui/react';
import { faFrown, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Object from 'lodash';
import React, { Component } from 'react';
import { getHighestMatchingIndex, getSmallestMatchingIndex } from '../utils/array';
import Tooltip from './ToolTip';

const domain = process.env.REACT_APP_FULLDOMAIN;

const DIRECTION = {
    UP: "up",
    DOWN: "down"
}

interface Props {
    items: any
    onClick(item: any, inputValue: string)
    ajax?: {
        url: string
        responseProperty: string
    }
    placeholder?: string
    className?: string
    name?: string
    // keeps value in input by onClick
    keepValue?: boolean
    disabled?: boolean
    displayProperty?: string
    display?(item: any): string
    filter?: {
        value?(item: any, inputValue: string): boolean | Promise<boolean>
        option?: "suppressDefaultFilter" | "decide"
    }
    onError?(error: any)
    onDiscard?(selectedItem: any, inputValue: string)
}

interface State {
    inputValue: string
    notFound: boolean
    loading: boolean
    keyPosition: number
    autoCompleteListItems: JSX.Element[]
    autoCompleteListItemsJson: any[]
    interSectingListItems: {
        value: HTMLLIElement[],
        indexRange: {
            top: number,
            bottom: number
        }
    },
    itemToIntersect: HTMLLIElement | null
    selectedItem: any
}

class AutoCompleter extends Component<Props, State> {
    autoCompleteListRef: React.RefObject<HTMLUListElement>
    listItemObserver: IntersectionObserver
    maxLength: number
    state = {
        inputValue: "",
        notFound: false,
        loading: false,
        autoCompleteListItems: [] as JSX.Element[],
        autoCompleteListItemsJson: [],
        keyPosition: -1,
        interSectingListItems: {
            value: [] as HTMLLIElement[],
            indexRange: {
                top: 0,
                bottom: 7
            }
        },
        itemToIntersect: null,
        selectedItem: null
    }
    constructor(props) {
        super(props);
        this.autoCompleteListRef = React.createRef();
        this.maxLength = 10;
    }
    componentDidMount = () => {
        this.registerKeyboardEvents();
        this.registerClickEvent();
        this.listItemObserver = new IntersectionObserver(this.handleObserve, {
            root: this.autoCompleteListRef.current,
            threshold: 1
        });
    }
    componentDidUpdate = () => {
        this.getListItems().forEach(listItem => {
            this.listItemObserver.observe(listItem);
        });
    }
    getListItems = () => {
        if (this.autoCompleteListRef.current?.querySelectorAll("li")) {
            return Array.from(this.autoCompleteListRef.current.querySelectorAll("li"));
        }
        return [];
    }
    handleObserve = (entries, observer) => {
        let listItems = this.getListItems();
        entries.forEach(entry => {
            let listItem = entry.target as HTMLLIElement;
            let interSectingListItems = [...this.state.interSectingListItems.value];
            if (!entry.isIntersecting && interSectingListItems.includes(listItem)) {
                interSectingListItems.splice(interSectingListItems.indexOf(listItem), 1);
                this.setState({
                    interSectingListItems: {
                        ...this.state.interSectingListItems,
                        value: interSectingListItems
                    }
                });
            }
            else if (entry.isIntersecting && !interSectingListItems.includes(listItem)) {
                interSectingListItems.push(listItem);
                this.setState({
                    interSectingListItems: {
                        ...this.state.interSectingListItems,
                        value: interSectingListItems
                    }
                });
            }
            this.setState({
                interSectingListItems: {
                    ...this.state.interSectingListItems,
                    indexRange: {
                        top: getSmallestMatchingIndex(interSectingListItems, listItems),
                        bottom: getHighestMatchingIndex(interSectingListItems, listItems)
                    }
                }
            });
        });
    }
    registerKeyboardEvents = () => {
        document.addEventListener("keydown", e => {
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
            }
            let listItems = this.getListItems();
            switch (e.key) {
                case 'ArrowUp':
                    if (this.state.keyPosition !== -1) {
                        let newKeyPosition = this.state.keyPosition - 1;
                        let { indexRange } = this.state.interSectingListItems;
                        if (newKeyPosition <= indexRange.top - 1 && this.state.autoCompleteListItems[newKeyPosition]) {
                            this.setState({ itemToIntersect: listItems[newKeyPosition] })
                            this.scrollUntilIntersecting(DIRECTION.UP);
                        }
                        this.setState({
                            keyPosition: newKeyPosition
                        }, () => {
                            this.toggleActiveClass(this.autoCompleteListRef.current!);
                        });
                    }
                    break;
                case 'ArrowDown':
                    if (this.state.keyPosition !== this.state.autoCompleteListItems.length) {
                        let newKeyPosition = this.state.keyPosition + 1;
                        let { indexRange } = this.state.interSectingListItems;
                        if (newKeyPosition >= indexRange.bottom + 1 && this.state.autoCompleteListItems[newKeyPosition]) {
                            this.setState({ itemToIntersect: listItems[newKeyPosition] })
                            this.scrollUntilIntersecting(DIRECTION.DOWN);
                        }
                        this.setState({
                            keyPosition: newKeyPosition
                        }, () => {
                            this.toggleActiveClass(this.autoCompleteListRef.current!);
                        });
                    }
                    break;
                case 'Enter':
                    if (this.state.autoCompleteListItems[this.state.keyPosition]) {
                        let activeListItem = this.autoCompleteListRef.current!.querySelector(".autocomplete-list-item-active")! as HTMLElement;
                        activeListItem.click();
                    }
                    break;
                default:
                    break;
            }
        });
    }
    registerClickEvent = () => {
        window.document.documentElement.addEventListener("click", (e) => {
            let target = e.target as HTMLElement;
            if (!target.closest(".autocomplete-list") && !target.closest(".autocomplete-list-wrapper")) {
                this.setState({
                    autoCompleteListItems: [],
                    autoCompleteListItemsJson: [],
                    keyPosition: -1,
                    notFound: false
                });
            }
        });
    }
    toggleActiveClass = (autoCompleteList: HTMLUListElement) => {
        const autoCompleteListItems = autoCompleteList.getElementsByTagName("li");
        if (autoCompleteListItems.length > 0) {
            Array.from(autoCompleteListItems).forEach(item => {
                item.classList.remove("autocomplete-list-item-active");
            });
            if (this.state.keyPosition === -1 || this.state.keyPosition === autoCompleteListItems.length) return;
            let autoCompleteListItem = autoCompleteListItems[this.state.keyPosition];
            if (autoCompleteListItem) autoCompleteListItem.classList.add("autocomplete-list-item-active");
        }
    }
    handleReset = () => {
        this.setState({
            autoCompleteListItems: [],
            autoCompleteListItemsJson: [],
            keyPosition: -1,
            notFound: false,
            selectedItem: null,
            loading: false,
            inputValue: ""
        });
    }
    handleClick = (item: any, displayValue: string) => {
        this.setState({
            inputValue: displayValue,
            autoCompleteListItems: [],
            keyPosition: -1,
            selectedItem: item
        })
        if (!this.props.keepValue) {
            this.setState({
                inputValue: ""
            });
        }
        this.props.onClick(item, displayValue);
    }
    updateInput = (e) => {
        this.setState({
            inputValue: e.target.value,
            loading: true
        }, async () => {
            let { ajax, items } = this.props;
            if (ajax) {
                try {
                    let response = await fetch(`${domain}/${ajax.url}/renderedItemsLength=0&inputValue=${this.state.inputValue}`);
                    let data = await response.json();
                    // note: better formatting?
                    if (!response.ok) throw new Error(`An error ocurred when trying to fetch \n ${JSON.stringify(data)}`);
                    items = data[ajax.responseProperty];
                    this.setAutoCompleteListItems(items);
                }
                catch (e) {
                    if (this.props.onError) this.props.onError(e);
                    this.handleReset();
                }
            }
            else {
                this.setAutoCompleteListItems(items.slice(0, this.maxLength));
            }
        });
    }
    setAutoCompleteListItems = async (items: any[]) => {
        // set this to state because otherwise 
        // I couldn't detect wheter there are items or not (for setting padding)
        let listItems: JSX.Element[] = [];
        let { displayProperty, display, filter } = this.props;

        if (this.state.inputValue) {
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let displayValue = (displayProperty) ? Object.get(item, displayProperty) : item;
                let mappedItem: JSX.Element[];
                if (typeof display === "function") {
                    displayValue = display(item);
                    if (displayValue instanceof Promise) displayValue = await displayValue;
                }
                mappedItem = this.mapDisplayValue(String(displayValue));

                const li = <li
                    className="autocomplete-list-item dark:bg-gray-700 dark:text-gray-300"
                    onClick={(e) => { e.stopPropagation(); this.handleClick(item, displayValue) }}
                    key={i}>
                    {mappedItem}
                </li>
                let usesFilter = filter && filter.value && typeof filter.value === "function";

                if (!usesFilter && this.filter(String(displayValue), this.state.inputValue)) {
                    listItems.push(li)
                }
                else if (usesFilter) {
                    let defaultFilterMatches = this.filter(String(displayValue), this.state.inputValue);
                    let customFilterMatches = filter!.value!(item, this.state.inputValue);
                    if (customFilterMatches instanceof Promise) customFilterMatches = await customFilterMatches;

                    if (!filter?.option && defaultFilterMatches && customFilterMatches) {
                        listItems.push(li);
                    }
                    else if (filter?.option && filter?.option === "suppressDefaultFilter") {
                        if (customFilterMatches) listItems.push(li);
                    }
                    else if (filter?.option && filter?.option === "decide") {
                        if (defaultFilterMatches || customFilterMatches) listItems.push(li);
                    }
                }
            }
        }
        this.setState({
            loading: false,
            notFound: listItems.length === 0,
            autoCompleteListItems: (listItems.length > 0) ? listItems : [],
            autoCompleteListItemsJson: items,
            keyPosition: (listItems.length === 0) ? -1 : this.state.keyPosition
        });
    }
    mapDisplayValue = (displayValue: string) => {
        let displayValueChars = displayValue.split("");
        let inputValueChars = this.state.inputValue.split("");
        return displayValueChars.map((listItemChar, index) => {
            if (inputValueChars.includes(listItemChar)) {
                return <span key={index} className="text-black dark:text-white">{listItemChar}</span>
            }
            return <span key={index}>{listItemChar}</span>;
        });
    }
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
    }
    handleScroll = async (e) => {
        let autoCompleteList = e.target;
        // ajax
        let scrolledToBottom = Math.ceil(autoCompleteList.scrollHeight - autoCompleteList.scrollTop) === autoCompleteList.clientHeight;
        if (scrolledToBottom && this.props.ajax) {
            try {
                let response = await fetch(`${domain}/${this.props.ajax.url}/renderedItemsLength=${this.state.autoCompleteListItemsJson.length}&inputValue=${this.state.inputValue}`);
                let data = await response.json();
                // note: better formatting?
                if (!response.ok) throw new Error(`An error ocurred when trying to fetch \n ${JSON.stringify(data)}`);
                let concatItems = data[this.props.ajax.responseProperty];
                let itemsToRender = [...this.state.autoCompleteListItemsJson, ...concatItems].distinct();
                this.setAutoCompleteListItems(itemsToRender);
            }
            catch (e) {
                if (this.props.onError) this.props.onError(e);
                this.handleReset();
            }
        }
        // without ajax
        else if (scrolledToBottom) {
            let { items } = this.props;
            let renderedItemsLength = this.state.autoCompleteListItemsJson.length;
            let itemsToRender = [...this.state.autoCompleteListItemsJson, ...items.slice(renderedItemsLength, renderedItemsLength + this.maxLength)]
            this.setAutoCompleteListItems(itemsToRender);
        }
    }
    scrollUntilIntersecting = (direction) => {
        if (direction === DIRECTION.UP) {
            let { itemToIntersect } = this.state;
            let intervalId = setInterval(() => {
                let dropDown = this.autoCompleteListRef.current!;
                dropDown.scrollTo(0, dropDown.scrollTop - 1);
                if (this.state.interSectingListItems.value.includes(itemToIntersect!)) clearInterval(intervalId);
            }, 1);
        }
        else if (direction === DIRECTION.DOWN) {
            let { itemToIntersect } = this.state;
            let intervalId = setInterval(() => {
                let dropDown = this.autoCompleteListRef.current!;
                dropDown.scrollTo(0, dropDown.scrollTop + 1);
                if (this.state.interSectingListItems.value.includes(itemToIntersect!)) clearInterval(intervalId);
            }, 1);
        }
    }
    handleDiscard = () => {
        if (this.props.onDiscard) this.props.onDiscard(this.state.selectedItem, this.state.inputValue);
        this.setState({ selectedItem: null, inputValue: "" });
    }
    renderAutoCompleteListItems = () => {
        return (
            <>
                {this.state.loading &&
                    <li className="autocomplete-list-item
                                 dark:text-white">
                        searching...
                    </li>
                }
                {this.state.notFound && !this.state.loading &&
                    <li className="autocomplete-list-item 
                                   flex justify-center items-center gap-2
                                   dark:text-white">
                        <span>
                            Not found
                        </span>
                        <FontAwesomeIcon icon={faFrown} size="lg" />
                    </li>
                }
                {this.state.autoCompleteListItems.map(listItem => listItem)}
            </>
        )
    }
    renderDiscardButton = () => {
        if (this.props.onDiscard) {
            return (
                <Tooltip title="Discard">
                    <div className={`icon text-gray-500 hover:text-black ${(this.state.selectedItem) ? "visible" : "hidden"}`} onClick={this.handleDiscard}>
                        <FontAwesomeIcon icon={faMinusCircle} size="lg" />
                    </div>
                </Tooltip>)
        }
        return null;
    }
    render() {
        let { autoCompleteListItems } = this.state;
        let { name, className } = this.props;
        className = `autocomplete-list no-select ${className} dark:bg-gray-700`;
        let placeholder = (this.props.placeholder) ? this.props.placeholder : "";
        return (
            <div style={{ position: 'relative' }} className="form-group autocomplete-list-wrapper">
                <div className="flex-center-inner gap-2">
                    <Input
                        autoComplete="off"
                        name={name}
                        placeholder={placeholder}
                        value={(this.state.inputValue) ? this.state.inputValue : ""}
                        style={(autoCompleteListItems.length > 0) ? { borderRadius: '.25rem .25rem 0 0', width: '100%' } : { width: '100%' }}
                        onChange={this.updateInput}
                        type="text"
                        disabled={this.props.disabled}
                    />
                    {this.renderDiscardButton()}
                </div>
                <ul
                    ref={this.autoCompleteListRef}
                    style={(autoCompleteListItems.length === 0 && !this.state.notFound) ? { padding: '0', borderBottom: '0' } : {}}
                    className={className}
                    onScroll={this.handleScroll}>
                    {this.renderAutoCompleteListItems()}
                </ul>
            </div >
        );
    }
}

export default AutoCompleter;