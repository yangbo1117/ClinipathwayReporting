import _ from "lodash";

function FilterUndefineNull(source) {
    return source.map((item, index) => {
        let obj = { 'key': index };
        _.forIn(item, function (value, key) {
            if (_.isUndefined(value) || _.isNull(value)) {
                obj[key] = 0;
            } else {
                if (value.toString().indexOf('.') === -1) {
                    obj[key] = value;
                } else {
                    if (_.isNumber(value)) {
                        obj[key] = +value.toFixed(2);
                    } else {
                        obj[key] = value;
                    }
                }
            }
        });
        return obj;
    });
}

export {
    FilterUndefineNull,
}