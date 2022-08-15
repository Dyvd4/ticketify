import React from 'react';

interface TypedTextProps {
    children?: React.ReactNode
    words?: any[]
    speed?: TypingSpeed | number
    wordDelayMs?: number
    mode?: TypedTextMode
    onWordChange?(word: string): void
    fontFamily?: string
    fontSize?: string
    initialHeight?: boolean
}
interface TypedTextState {
    rendered: boolean
    animation: {
        words: {
            value: any[]
            index: number,
            blocked?: boolean
        }
        chars: {
            value: any[],
            index: number
        }
        displayedChars: any[]
        speed: TypingSpeed | number
        wordDelayMs: number
        mode: TypedTextMode
    }
}

type TypedTextMode = "stay" | "reverse" | "infinite" | "infinite-reverse"

export enum TypingSpeed {
    Slow = 300,
    Normal = 200,
    Fast = 100
}

interface TypedText {
    loaded: boolean
}

class TypedText extends React.Component<TypedTextProps, TypedTextState> {
    constructor(props) {
        super(props);
        this.state = {
            rendered: false,
            animation: {
                words: {
                    value: [] as any[],
                    index: 0,
                    // used for reverse mode
                    blocked: false
                },
                chars: {
                    value: [] as any[],
                    index: 0
                },
                displayedChars: [] as any[],
                speed: TypingSpeed.Normal,
                wordDelayMs: 1500,
                mode: "stay" as TypedTextMode
            }
        }
    }
    componentDidMount = () => {
        this.setState({ rendered: true });
        this.init(this.props.children ? [this.props.children] : this.props.words);
    }
    init = (words?: any[]) => {
        if (!this.loaded) {
            let newAnimationState = { ...this.state.animation };
            newAnimationState.words.value = words!;
            newAnimationState.mode = this.props.mode || "stay";
            if (this.props.speed) newAnimationState.speed = this.props.speed;
            if (this.props.wordDelayMs) newAnimationState.wordDelayMs = this.props.wordDelayMs;
            this.loaded = true;
            this.setState({
                animation: newAnimationState
            }, () => {
                this.setWriteInterval();
            });
        }
    }
    setWriteInterval = (reverse?: boolean) => {
        let animation = { ...this.state.animation };
        let intervallId = setInterval(async () => {
            if (reverse) {
                // reverse writing
                if (animation.displayedChars.length === 0) {
                    clearInterval(intervallId);
                    this.setWriteInterval();
                }
                else {
                    this.removeChar();
                }
            }
            else {
                animation = { ...this.state.animation };

                if (animation.chars.value.length - 1 === animation.chars.index) {
                    await this.pushChar();
                    clearInterval(intervallId);
                    if (["infinite", "infinite-reverse",].includes(animation.mode) ||
                        (animation.mode === "stay" && animation.words.value.length > 1 && animation.words.index !== animation.words.value.length) ||
                        (animation.mode === "reverse" && (animation.words.value.length > 1 && !(animation.words.index === animation.words.value.length && animation.words.blocked)))
                        ) {
                        setTimeout(() => {
                            this.setWriteInterval(true);
                        }, animation.wordDelayMs);
                    }
                    return;
                }
                if (animation.chars.value.length === 0 && !animation.words.value[animation.words.index]) {
                    clearInterval(intervallId);
                    this.resetWords();
                    return;
                }
                else if (animation.chars.value.length === 0 && animation.words.value[animation.words.index]) {
                    animation.chars.value = animation.words.value[animation.words.index].split("");
                    if (this.props.onWordChange) this.props.onWordChange(animation.words.value[animation.words.index]);
                    animation.words.index++;
                }
                this.setState({ animation }, async () => {
                    await this.pushChar();
                });
            }
        }, animation.speed);
    }
    resetWords = () => {
        let animation = { ...this.state.animation }
        let { words } = animation;
        switch (animation.mode) {
            case "infinite":
                words = {
                    ...animation.words,
                    index: 0
                }
                break;
            case "infinite-reverse":
                words = {
                    value: animation.words.value.reverse(),
                    index: 1
                }
                break;
            case "reverse":
                words = {
                    value: words.value.reverse(),
                    index: 1,
                    blocked: true
                }
                break;
        }
        this.setState({
            animation: {
                ...animation,
                chars: {
                    value: [],
                    index: 0
                },
                words
            }
        }, () => this.setWriteInterval());
    }
    pushChar = async () => {
        let animation = { ...this.state.animation };
        animation.displayedChars.push(animation.chars.value[animation.chars.index]);
        animation.chars.index++;
        this.setState({ animation }, () => {
            return;
        });
    }
    removeChar = async () => {
        let animation = { ...this.state.animation };
        animation.displayedChars.pop();
        animation.chars.index--;
        if (animation.displayedChars.length === 0) animation.chars.value = [];
        this.setState({ animation }, () => {
            return;
        });
    }
    render() {
        let { animation: { displayedChars } } = this.state;
        const {
            fontSize,
            fontFamily = "'Roboto Mono', monospace"
        } = this.props;
        return (
            <span style={{ fontFamily }}
                className={`${fontSize} typed-text`}>
                {!this.state.rendered && this.props.initialHeight && <>
                    <span className="invisible">placeholder</span>
                </>}
                {displayedChars.map((c, index) => <span key={index}>{c}</span>)}
            </span>
        )
    }
}

export default TypedText;