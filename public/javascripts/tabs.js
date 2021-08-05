function openStatus(evt, status) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(status).style.display = "grid";
    evt.currentTarget.className += " active";
}


document.getElementById("default").click()

function findMissingLetter(array) {
    const hexArray = array.map((item) => {
        return item.charCodeAt(0).toString(16);
    })

    for (let i = 1; i < hexArray.length; i++) {
        if (hexArray[i] > (hexArray[i - 1] + 1)) {
            console.log(parseint(Number(hexArray[i - 1])+1, 16));
            return hexArray[i - 1] + 1;
        }
    }
}