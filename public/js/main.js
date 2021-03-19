
window.alerted = false;
const socket = io();
function renderData(data) {
    if (data) {
        let tableHTML = "";
        $("#cvs-content").html(`<table class="table" id="cvs-table">
        </table>`)
        let available = false;
        data.forEach(row => {
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
            $(".state-header").removeClass("not-available-header");
            $(".state-header").addClass("available-header");
        }else{
            window.alerted = false;
            $(".state-header").addClass("not-available-header");
            $(".state-header").removeClass("available-header");
        }
        $("#cvs-table").html(tableHTML)
        socket.emit("state", state)
    }else{
        $("#cvs").html("<h1>CVS Pharmacy</h1><div class='error'>It looks like CVS is not adminstering vaccines in your state</div>")
    }

}
const {state} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
});
if (state) {
    states.forEach(stateObj => {
        if (stateObj.abbreviation === state) {
            $("#header-h1").html(`Vaccine Tracker - ${stateObj.name}`)
        }
    })
    select.value = state;

    socket.emit("state", state)
    socket.on("CVS", ({ data }) => {
        const json = JSON.parse(data);
        $("#cvs-content").html(`<table class="table" id="cvs-table">
        </table>`);
        eval(`renderData(json.responsePayloadData.data.${state})`)
    })
    socket.on("time", ({time}) => {
        $("#last-updated").html(`Last updated: ${time}`)
    } )


}else{
    console.log("home page")
}

