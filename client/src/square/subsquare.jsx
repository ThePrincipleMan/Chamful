import React from 'react'
import Token from '../tokens/token'
import './square.css'

const SubSquare = ({
    color,
    token,
    tokencolor,
}) => {
   //console.log(tokencolor)
    return (
        <>
            <div className={`${color} subsquare`}>
                {token.map((e, idx) =>{
                    return(
                        <Token
                            tokencolor = {tokencolor}
                        />
                    );
                }
                )}
            </div>
        </>
    )
}

export default SubSquare