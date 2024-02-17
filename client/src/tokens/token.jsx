import React from 'react'
import './token.css'

const Token = ({
    // color,
    tokencolor,
}) => {
    // console.log(tokencolor)
    return (
        <>
            <div className={`${tokencolor} token`}>
                {tokencolor[0]}
            </div>
        </>
    )
}

export default Token