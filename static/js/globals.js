
window.addsubHeader = function (dispName) {
  d3.select("#subHeader").insert("span","#appBtnGroup").attr("class","nav-next nav-prev").html(">");
  d3.select("#subHeader").insert("a","#appBtnGroup").attr("class","nav-now nav-a").html(dispName);
};
