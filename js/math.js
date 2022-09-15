Math.getMin = object => {
    if(Object.keys(object).length==1)
        return Object.keys(object)[0];
    return Object.keys(object).filter(x => {return object[x] === Math.min.apply(null,Object.values(object))});
};
Math.countDecimals = num => {
    if (Math.floor(num.valueOf()) === num.valueOf())
        return 0;
    var str = num.toString();
    if (str.indexOf(".") !== -1 && str.indexOf("-") !== -1) {
        return str.split("-")[1] || 0;
    } else if (str.indexOf(".") !== -1) {
        return str.split(".")[1].length || 0;
    }
    return str.split("-")[1] || 0;
}
Math.clamp = (num, min, max) => Math.min(Math.max(num, min), max);
Math.roundp = (num, precision) => Math.round(num * (10**precision)) / (10**precision);
Math.diff = (num,num2) => Math.abs(num - num2);
function getAt(arr,index) {
    return arr[Math.clamp(index,0,arr.length-1)];
}
Object.filter = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(predicate));