// this is a copy of data.js in api folder as react does not allow to import directly from outside src directory.
// try to keep both these files in sync as important

export const colorArray = ["yellow", "blue", "red", "green"]
// was giving incorrect order of play["yellow", "green", "red", "blue"]
export const dieValues = [1,2,3,1,2,3,4,8]

export default{
    colorArray,
    dieValues,
}