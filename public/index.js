const shortExtraDataTitles = {
    "chess/puzzle": "Game PGN"
};

$(".short-type-option").on("change", () => {

    const shortType = $(".short-type-option").val() || "";
    const shortExtraDataTitle = shortExtraDataTitles[shortType];

    if (shortExtraDataTitle) {
        $(".short-extra-data-container").css("display", "flex");
        $(".short-extra-data-title").html(shortExtraDataTitle);
    } else {
        $(".short-extra-data-container").css("display", "none");
    }

});

$(".produce-video").on("click", () => {

    const socket = io({ reconnection: false });

    socket.on("connect", () => {
        $(".short-configuration").css("display", "none");
        $(".production-logs").css("display", "flex");
        $(".production-logs").html("<span>Spawning Python process...</span>");

        socket.emit(
            "produce",
            $(".short-type-option").val() || "",
            $(".short-extra-data").val() || ""
        );

        socket.on("render info", message => {
            $(".production-logs").append(`<span>${message}</span>`);
        });

        socket.on("render done", filename => {
            $(".short-configuration").css("display", "flex");
            $(".short-filename").html(filename);
            $(".short-preview").attr("src", `/media/${filename}`);
            $("#file").val(filename);
        });
    });

});

const logsObserver = new MutationObserver(() => {
    const logsContainer = $(".production-logs").get(0);
    logsContainer.scrollTop = logsContainer.scrollHeight;
});

logsObserver.observe($(".production-logs").get(0), {
    childList: true
});

$("#upload-form").on("submit", (e) => {

    const shortDetails = {
        title: $("#title").val(),
        description: $("#description").val(),
        file: $("#file").val()
    };

    if ( !shortDetails.title || shortDetails.title.length < 1 ) return alert("Title hasn't been set.");
    if ( shortDetails.title.length > 100 ) return alert("Title has to be shorter than 100 characters.");

    if ( !shortDetails.description || shortDetails.description.length < 1 ) return alert("Description hasn't been set.");
    if ( shortDetails.description.length > 5000 ) return alert("Description has to be shorter than 5000 characters.");

    if ( !shortDetails.file ) return alert("Short must be created before uploading.");

    const socket = io({ reconnection: false });

    socket.on("connect", () => {
        $(".production-logs").css("display", "flex");
        $(".production-logs").html("<span>Starting Uploading process...</span>");

        socket.emit(
            "upload",
            shortDetails
        );

        socket.on("upload info", message => {
            $(".production-logs").append(`<span>${message}</span>`);
        });

        socket.on("upload done", filename => {
            $(".short-configuration").css("display", "flex");
            $(".short-filename").html(filename);
            $(".short-preview").attr("src", `/media/${filename}`);
        });
    });

    e.preventDefault();

});

$(".popup-btn").on("click", () => {
    $(".upload-popup").toggleClass("hidden");
});