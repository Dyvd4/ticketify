import * as React from 'react';
import BgBox from './BgBox';

interface CardProps {
    children: React.ReactNode
    centered?: boolean
    className?: string
    style?: any
}

function Card(props: CardProps) {
    let styles = {
        width: "fit-content",
        height: "fit-content",
        ...props.style
    }
    return <BgBox
        style={styles}
        className={`shadow-md rounded-lg p-8 border border-black
                    ${props.centered ? `absolute top-1/2 left-1/2 
                    transform -translate-x-1/2 -translate-y-1/2` : ""} 
                    ${props.className}`}>
        {props.children}
    </BgBox>
}

export default Card;