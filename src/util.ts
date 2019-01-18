// helper function to determine if a value is a Date object
export const isDate = (item: any) => {
    if (Object.prototype.toString.call(item) === "[object Date]") {
        return true
    }
    return false
}
