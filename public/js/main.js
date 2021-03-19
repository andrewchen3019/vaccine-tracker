
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
                const words = row.city.split(" ");
                let finalWord = "";
                words.forEach(word => {
                    finalWord += word.charAt(0) + word.slice(1).toLowerCase() + " ";
                })
                finalWord = finalWord.slice(0, finalWord.length-2)
                const element = `<tr><td>${finalWord}, ${row.state}</td><td class='available-status'>${row.status}</td></tr>`;
                tableHTML += element;
            }else{
                const words = row.city.split(" ");
                let finalWord = "";
                words.forEach(word => {
                    finalWord += word.charAt(0) + word.slice(1).toLowerCase() + " ";
                })
                finalWord = finalWord.slice(0, finalWord.length-2)
                const element = `<tr><td>${finalWord}, ${row.state}</td><td class='not-available-status'>${row.status}</td></tr>`;
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
            $("#state-header-name").html(stateObj.name);
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

