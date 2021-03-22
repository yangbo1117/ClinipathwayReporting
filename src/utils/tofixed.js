export default function(value){
    if(typeof(value) === "number" && JSON.stringify(value).indexOf(".") > -1)
    {
        return +Number(value).toFixed(2);
    }else {
        return value
    }
 
}