/***
 * Contains basic SlickGrid formatters.
 * 
 * NOTE:  These are merely examples.  You will most likely need to implement something more
 *        robust/extensible/localizable/etc. for your use!
 * 
 * @module Formatters
 * @namespace Slick
 */

(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Formatters": {
        "PercentComplete": PercentCompleteFormatter,
        "PercentCompleteBar": PercentCompleteBarFormatter,
        "YesNo": YesNoFormatter,
        "Checkmark": CheckmarkFormatter,
        "LongTextTipFormatter": LongTextTipFormatter,
        "NumberWithCommas": NumberWithCommasFormatter,
        "ByteWithSpan": ByteWithSpanFormatter,
        "PortWithIcon": PortWithIconFormatter,

      }
    }
  });

  function PercentCompleteFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value === "") {
      return "-";
    } else if (value < 50) {
      return "<span style='color:red;font-weight:bold;'>" + value + "%</span>";
    } else {
      return "<span style='color:green'>" + value + "%</span>";
    }
  }

  function PercentCompleteBarFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value === "") {
      return "";
    }

    var color;

    if (value < 30) {
      color = "red";
    } else if (value < 70) {
      color = "silver";
    } else {
      color = "green";
    }

    return "<span class='percent-complete-bar' style='background:" + color + ";width:" + value + "%'></span>";
  }

  function YesNoFormatter(row, cell, value, columnDef, dataContext) {
    return value ? "Yes" : "No";
  }

  function CheckmarkFormatter(row, cell, value, columnDef, dataContext) {
    return value ? "<img src='../images/tick.png'>" : "";
  }

  function LongTextTipFormatter(row, cell, value, columnDef, dataContext) {
    return '<span title="' + value + '">' + value + '</span>';
  }

  function NumberWithCommasFormatter(row, cell, value, columnDef, dataContext) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function ByteWithSpanFormatter(row, cell, value, columnDef, dataContext) {
    return '<span style="padding-left:5px;">' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</span>';
  }

  function PortWithIconFormatter(row, cell, value, columnDef, dataContext) {
    if(value.c_or_s=='c'){
        return value.port.toString() + '<span class="flow-table-client-port-icon"></span>';
    }else if(value.c_or_s=='s'){
        return value.port.toString() + '<span class="flow-table-server-port-icon"></span>';
    }else{
        return value.port.toString();
    }
  }

})(jQuery);
