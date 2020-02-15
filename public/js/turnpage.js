$("#flipbook").turn({
    width: 400,
    height: 300,
    autoCenter: true
});

$("#pageFld").val($("#flipbook").turn("page"));

$("#flipbook").bind("turned", function(event, page, view) {
    $("#pageFld").val(page);
});

$("#pageFld").change(function() {
    $("#flipbook").turn("page", $(this).val());
});

$("#prevBtn").click(function() {
    $("#flipbook").turn("previous");
});

$("#nextBtn").click(function() {
    $("#flipbook").turn("next");
});