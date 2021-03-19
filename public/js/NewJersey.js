
/*socket io*/
window.alerted = false;
const socket = io();
socket.on("CVS", ({ data }) => {
    const json = JSON.parse(data);
    const tableData = json.responsePayloadData.data.NJ;
    let tableHTML = "";
    $("#cvs-content").html(`<table class="table" id="cvs-table">
    </table>`)
    let available = false;
    tableData.forEach(row => {
        if (row.status !== "Fully Booked") {
            available = true;

            const element = `<tr><td>${row.city.charAt(0) + row.city.slice(1).toLowerCase()}, ${row.state}</td><td class='available-status'>${row.status}</td></tr>`;
            tableHTML += element;
        }else{
            const element = `<tr><td>${row.city.charAt(0) + row.city.slice(1).toLowerCase()}, ${row.state}</td><td class='not-available-status'>${row.status}</td></tr>`;
            tableHTML += element;
        }

    });
    if (available) {
        if (window.alerted == false) {
            send();
            window.alerted = true;
        }
        $("#cvs-container").removeClass("not-available")
        $("#cvs-container").addClass("available");
        $("header").removeClass("not-available");
        $("header").addClass("available");
    }else{
        window.alerted = false;
        $("#cvs-container").removeClass("available")
        $("#cvs-container").addClass("not-available")
        $("header").removeClass("available");
        $("header").addClass("not-available");
    }
    $("#cvs-table").html(tableHTML)
})
socket.on("time", ({time}) => {
    $("#last-updated").html(`Last updated: ${time}`)
} )
