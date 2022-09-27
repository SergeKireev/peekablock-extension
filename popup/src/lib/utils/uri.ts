export const decodeParam = (param: any, isJson: boolean) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const qsJson = urlParams.get(param)
    let result = decodeURI(qsJson)
    return isJson ? JSON.parse(result) : result
}