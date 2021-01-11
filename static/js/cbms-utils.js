
var fixTime = function(v){
    if(v < 10){
        return '0' + v;
    }else{
        return '' + v;
    }
}

var ts2dt = function(ts){
    return new Date(parseInt(ts)*1000);
}

var dt2ts = function(dt){
    return Math.floor(dt.getTime() / 1000);
}

var ts2str = function(ts){
    var dt = ts2dt(ts);
    return dt.getFullYear()+'-'+fixTime(dt.getMonth()+1)+'-'+fixTime(dt.getDate())+' '+
            fixTime(dt.getHours())+':'+fixTime(dt.getMinutes())+':'+fixTime(dt.getSeconds());
};

var dt2str = function(dt){
    return dt.getFullYear()+'-'+fixTime(dt.getMonth()+1)+'-'+fixTime(dt.getDate());
};

var parseDatetime = function(dateString){
    var reg = /(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})/g;
    var dateArray = reg.exec(dateString);
    for(var i = 0; i< dateArray.length; ++i){
        dateArray[i] = parseInt(dateArray[i], 10);
    }
    var date =  new Date(
        dateArray[1],
        dateArray[2]-1, // Careful, month starts at 0!
        dateArray[3],
        dateArray[4],
        dateArray[5],
        dateArray[6]
    );
    if(date.getFullYear() == dateArray[1]
       && date.getMonth() == dateArray[2] - 1
       && date.getDate() == dateArray[3]
       && date.getHours() == dateArray[4]
       && date.getMinutes() == dateArray[5]
       && date.getSeconds() == dateArray[6]){
        return date;
    }
    else{
        throw new Error("invalid datetime")
    }
}

var restrict_bytes = function(bytes){
    if(bytes >= 10){
        return Math.round(bytes);
    }else if(bytes >= 1){
        return Math.round(bytes * 10) / 10;
    }else if(bytes >= 0.01){
        return Math.round(bytes * 100) / 100;
    }else{
        return 0.01
    }
}

var restrict_count = function(count, maxLenght){
    var maxLength = maxLength || 7;
    var maxLenCount = Math.pow(10, maxLength);
    var unit = '';

    if(count >= maxLenCount){
        count = Math.round(count / 1000);
        unit = 'K';

        if(count >= maxLenCount / 10){
            count = Math.round(count / 1000);
            unit = 'M';
        }
    }
    return count + unit;
}


var propToQueryString = function(dictionary) {
    var o = [];
    var val;
    for (var prop in dictionary) {
        val = '' + dictionary[prop];
        o.push(encodeURIComponent(prop) + '=' + encodeURIComponent(dictionary[prop]));
    }
    return o.join('&');
}

var queryStringToProp = function(args) {
    var parts          = null,
        output         = {},
        key            = null,
        value          = null,
        equalsSegments = null,
        lim            = null;

    var trim = function(str, delim) {
        if (delim) return str.replace(new RegExp("^[\\s" + delim + "]+"),'').replace(new RegExp("[\\s" + delim + "]+$"), '');
        else return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }

    if (args.trim() === '') {
        return output;
    }

    args = trim(args, '&\?#');
    parts = args.split('&');
    lim = parts.length;

    for (var i=0,l=lim; i<l; i++) {
        equalsSegments = parts[i].split('=');
        key = decodeURIComponent(equalsSegments.shift());
        value = equalsSegments.join("=");
        output[key] = decodeURIComponent(value);
    }
    return output;
}

var cleanQueryString = function(newValues, cleanKeys, needCleanDims) {
    var win = window.parent;
    var needCleanDims = needCleanDims || true;
    var search = win.location.search;
    var prop = queryStringToProp(search);

    if (needCleanDims) {
        for (var key in prop) {
            if (key.indexOf('dim_') == 0) {
                delete prop[key];
            }
        }
    }
    for (var keyIndex in cleanKeys) {
        delete prop[cleanKeys[keyIndex]];
    }

    $.extend(prop, newValues);
    return propToQueryString(prop);
}

var setCleanUrl = function(newValues, cleanKeys, needCleanDims) {
    var win = window.parent;
    var url = win.location.origin + win.location.pathname;
    var hash = win.location.hash;
    var newSearch = cleanQueryString(newValues||{}, cleanKeys, needCleanDims);

    if (newSearch) {
        url += '?' + newSearch;
    }

    if (hash) {
        url += hash;
    }

    win.history.replaceState({},0, url);
}

var print_table_in_console = function(data) {
    var show_in_console = window.SHOW_DATA_IN_CONSOLE;
    var limit = window.SHOW_DATA_IN_CONSOLE_LIMIT;
    try{
        show_in_console = top.window.SHOW_DATA_IN_CONSOLE;
        limit = top.window.SHOW_DATA_IN_CONSOLE_LIMIT;
    } catch(e){}
    if (show_in_console) {
        var newData = [];
        if (limit) {
            for (var i in data) {
                if (i < limit) {
                    newData.push(data[i]);
                }
            }
        } else {
            newData = data;
        }
        console.table(newData);
    }
};
var formatString = function(fmt, obj, named) {
    if (named) {
        return fmt.replace(/%\(\w+\)s/g, function(match){return String(obj[match.slice(2,-2)]);});
    } else {
        return fmt.replace(/%s/g, function(match){return String(obj.shift());});
    }
}

window.print_table_in_console = print_table_in_console;
