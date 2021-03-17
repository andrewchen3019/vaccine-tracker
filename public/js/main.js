
/*socket io*/
setInterval(() => {
    $("#mercy-iframe").attr("src", "https://mychart.mercycare.org/mychart/openscheduling/SignupAndSchedule/EmbeddedSchedule?id=10237&vt=3138&public=1");
}, 5000)
const socket = io();
socket.emit("state", "IA");
socket.on("CVS", ({ data }) => {
    const json = JSON.parse(data);
    const tableData = json.responsePayloadData.data.NJ;
    let tableHTML = "";
    $("#cvs-content").html(`<table class="table" id="cvs-table">
    </table>`)
    tableData.forEach(row => {
        if (row.status !== "Fully Booked") {
            send();
            $("#cvs-container").removeClass("not-available")
            $("#cvs-container").addClass("available")
            const element = `<tr><td>${row.city.charAt(0) + row.city.slice(1).toLowerCase()}</td><td class='available-status'>${row.status}</td></tr>`;
            tableHTML += element;
        }else{
            const element = `<tr><td>${row.city.charAt(0) + row.city.slice(1).toLowerCase()}</td><td class='not-available-status'>${row.status}</td></tr>`;
            tableHTML += element;
        }

    });
    $("#cvs-table").html(tableHTML)
})
socket.on("time", ({time}) => {
    $("#last-updated").html(`Last updated: ${time}`)
} )
