function toggleHamburgerMenu() {
    var hmenu = document.getElementById("hamburger-menu");
    if (hmenu) {
        // hmenu.style.right = (hmenu.style.right == "10px") ? "-100px" : "10px";
        hmenu.style.top = (hmenu.style.top == "80px") ? "-50px" : "80px";
        hmenu.style.transform = (hmenu.style.transform == "scale(1)") ? "scale(0)" : "scale(1)";
    }
    else {
        alert('NNDIFKGMNTRNFCV');
    }
}

function signup(code) {
    console.log(code);
    document.getElementById("error-msg").innerText = ""

    var password = document.getElementById("signup-password").value;
    if (password == document.getElementById("signup-password-confirm").value) {
        var full_name = document.getElementById("signup-name").value;
        var school_name = document.getElementById("signup-school-name").value;
        var address_1 = document.getElementById("signup-address-1").value;
        var address_2 = document.getElementById("signup-address-2").value;
        var city = document.getElementById("signup-city").value;
        var state = document.getElementById("signup-state").value;
        var zip = document.getElementById("signup-zip").value;
        var email = document.getElementById("signup-email").value;

        if (!full_name || !address_1 || !city || !state || !zip) {
            errorMsg("Some required fields empty.");
            return;
        } else {
            if (zip.length < 5) {
                errorMsg("Zip code must be 5 digits");
                return;
            } else {
                console.log(full_name + " " + school_name + " " + address_1 + " " + address_2 + " " + city + " " + city + " " + state + " " + zip);
                firebase.auth().createUserWithEmailAndPassword(email, password).then((e) => {
                    successMsg("Account made, Please wait for order request to be sent...");
                    sendOrderRequest({
                        full_name, school_name, address_1, address_2, city, state, zip, email,
                    })
                }).catch((reason) => {
                    errorMsg(reason.message);
                });
                return;
            }
        }
    } else {
        errorMsg("Passwords do not match.");
    }
}

function sendOrderRequest(data) {
    firebase.database().ref("/order_requests").push(data).then((e) => {
        successMsg("Your request has been sent! Please wait 1-2 business days for it to be approved.");
    }).catch((reason) => {
        errorMsg(reason);
    });
}

function errorMsg(msg) {
    document.getElementById("error-msg").innerText = msg;
    document.getElementById("success-msg").innerText = "";
}

function successMsg(msg) {
    document.getElementById("success-msg").innerText = msg;
    document.getElementById("error-msg").innerText = "";
}

const loginErrors = {
    "auth/invalid-email": "Invalid email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/internal-error": "Unknown error.",
    "auth/user-not-found": "User doesn't exist."
}

function login() {
    var email, password;
    try {
        email = document.getElementById("email-field").value;
        password = document.getElementById("password-field").value;
    } catch {
        errorMsg("Unknown error")
    }

    firebase.auth().signInWithEmailAndPassword(email, password).then((e) => {
        location = "profile.html";
    }).catch((reason) => {
        console.log(reason);
        errorMsg(loginErrors[reason.code]);
    });
}

function loadProfileInfo() {
    document.getElementById("email").innerText = firebase.auth().currentUser.email;
    var uid = firebase.auth().currentUser.uid;

}

function updateHamburgerMenu() {
    if (firebase.auth().currentUser) { // if they are SIGNED IN
        document.getElementById("hb-home").style.display = "block";
        document.getElementById("hb-profile").style.display = "block";
        document.getElementById("hb-dashboard").style.display = "block";
        document.getElementById("hb-login").style.display = "none";
        document.getElementById("hb-signout").style.display = "block";

        document.getElementById("header-profile").style.display = "block";
        document.getElementById("header-login").style.display = "none";
    } else { // if they are LOGGED OUT
        document.getElementById("hb-home").style.display = "block";
        document.getElementById("hb-profile").style.display = "none";
        document.getElementById("hb-dashboard").style.display = "none";
        document.getElementById("hb-login").style.display = "block";
        document.getElementById("hb-signout").style.display = "none";

        document.getElementById("header-profile").style.display = "none";
        document.getElementById("header-login").style.display = "block";
    }
}

var product_id = "";
var attendanceData = [["Loading..."]];
var dbAttendance = {};

async function fetchProductId() {
    try {
        var data = await firebase.database().ref("/product_ids/" + firebase.auth().currentUser.uid).get();
        if (!data.exists) {
            return;
        } else {
            product_id = data.val();
        }
    }
    catch (reason) {
        console.log("fetchproductid error", reason)
    }
}

async function fetchAttendanceData() {
    attendanceData = [["Loading..."]];
    updateTable();
    var response = await axios.post("https://atepsbackend.akze.repl.co/get_attendance/c1");
    var ref = firebase.database().ref("/classes/c1/students");
    var data = await ref.get();
    console.log("fetched attendance data", dbAttendance);
    dbAttendance = data.val();
    attendanceData = response.data;
    updateTable();
}

const attendanceTableSVGs = [
    `<svg style="height: 24px; width: 24px; color: rgb(0, 0, 0)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-x" viewBox="0 0 16 16"><path d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z" fill="#000000"></path><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" fill="#000000"></path></svg>`,
    `<svg     style="height: 24px; width: 24px; color: rgb(0, 0, 255)"     xmlns="http://www.w3.org/2000/svg"     xmlns:xlink="http://www.w3.org/1999/xlink"     width="40"     zoomAndPan="magnify"     viewBox="0 0 30 30.000001"     height="40"     preserveAspectRatio="xMidYMid meet"     version="1.0"   >     <defs>       <clipPath id="id1">         <path           d="M 2.328125 4.222656 L 27.734375 4.222656 L 27.734375 24.542969 L 2.328125 24.542969 Z M 2.328125 4.222656 "           clip-rule="nonzero"         ></path>       </clipPath>     </defs>     <g clip-path="url(#id1)">       <path         fill="rgb(13.729858%, 12.159729%, 12.548828%)"         d="M 27.5 7.53125 L 24.464844 4.542969 C 24.15625 4.238281 23.65625 4.238281 23.347656 4.542969 L 11.035156 16.667969 L 6.824219 12.523438 C 6.527344 12.230469 6 12.230469 5.703125 12.523438 L 2.640625 15.539062 C 2.332031 15.84375 2.332031 16.335938 2.640625 16.640625 L 10.445312 24.324219 C 10.59375 24.472656 10.796875 24.554688 11.007812 24.554688 C 11.214844 24.554688 11.417969 24.472656 11.566406 24.324219 L 27.5 8.632812 C 27.648438 8.488281 27.734375 8.289062 27.734375 8.082031 C 27.734375 7.875 27.648438 7.679688 27.5 7.53125 Z M 27.5 7.53125 "         fill-opacity="1"         fill-rule="nonzero"       ></path>     </g>   </svg>`,
    `<svg    style="height: 24px; width: 24px; color: rgb(0, 0, 0)"    xmlns="http://www.w3.org/2000/svg"    width="16"    height="16"    fill="currentColor"    class="bi bi-clock"    viewBox="0 0 16 16"  >    <path      d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"      fill="#000000"    ></path>    <path      d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"      fill="#000000"    ></path>  </svg>`
]

function makeTableHTML(myArray) {
    console.log(myArray);
    var result = "<table id='attendance-table'>";
    for (var i = 0; i < myArray.length; i++) {
        result += "<tr>";
        for (var j = 0; j < myArray[i].length; j++) {
            var student = myArray[0][j];
            var date = myArray[i][0];
            var combinedID;
            if (student != "DATE" && date != "DATE") {
                combinedID = student + "/" + date;
            }
            var c = undefined;
            if (myArray[i][j] == "0") {
                c = "warning hcell";
            } else if (myArray[i][j] == "1") {
                c = "success hcell";
            } else if (myArray[i][j] == "2") {
                c = "late hcell";
            } else if (i == 0 || j == 0) {
                c = "sidecell";
            }

            result += "<td" + ((c) ? " class='" + c + "'" : "") + (combinedID ? ("id=" + "'" + combinedID + "'") : "") + ">" + (
                () => {
                    var v = myArray[i][j];
                    if (i == 0 || j == 0) {
                        if (j != 0) {
                            console.log("dbattendksnfd", dbAttendance);
                            return `${dbAttendance[v]["name"]} (${v})`;
                        }
                        return v;
                    }
                    else return attendanceTableSVGs[v];
                }
            )() + (
                () => {
                    if ((i == 0) || (j == 0)) return "";
                    else {
                        var temp = [];
                        for (var i in attendanceTableSVGs) {
                            temp.push(`
                            <div class="hcell-hover-option svg${i}" onclick="updateAttendanceElement(this);">
                                ${attendanceTableSVGs[i]}
                            </div>
                            `)
                        }
                        return (
                            `<div class="hcell-hover-option-container">` +
                            temp.join("   ") +
                            `</div>`
                        );
                    }
                }
            )()
                + "</td>";
        }
        result += "</tr>";
    }
    result += "</table>";

    return result;
}

function updateAttendanceElement(element) {
    console.log(element);
    var cell = element.parentElement.parentElement;
    console.log(cell.id);
    var n;
    let classes = Array.from(element.classList)
    if (classes.indexOf("svg0") != -1) {
        console.log("0");
        cell.className = "warning hcell";
        cell.children[0].outerHTML = attendanceTableSVGs[0];
        n = 0;
    }
    if (classes.indexOf("svg1") != -1) {
        console.log("1");
        cell.className = "success hcell";
        cell.children[0].outerHTML = attendanceTableSVGs[1];
        n = 1;
    }
    if (classes.indexOf("svg2") != -1) {
        console.log("2");
        cell.className = "late hcell";
        cell.children[0].outerHTML = attendanceTableSVGs[2];
        n = 2;
    }
    if (n !== undefined && n !== null) {
        var t = cell.id.split("/");
        var student = t[0];
        var date = t[1];
        firebase.database().ref("/classes/c1/students/" + student + "/dates/" + date).update({ state: n }).then((result) => {
            console.log("doned", result);
        }).catch((reason) => {
            console.log("failure", reason);
        });
    }
}

function updateTable() {
    var parent = document.getElementById("table-container");
    var i = makeTableHTML(attendanceData);
    parent.innerHTML = i;
}

var lpc = 0;
var lastScan = 0;
var interval;

function addCompareDBEvents() {
    firebase.database().ref("/ai").on("value", (data) => {
        lpc = data.val().lpc;
        console.log("lpc update", lpc);
    });
    firebase.database().ref("/check").on("value", (data) => {
        console.log("data val", data.val());
        lastScan = data.val().lastScan;
        console.log("lastScan update", lastScan);
    });

    interval = setInterval(determineComparison, 200);
}

function compareAIAndScan() {
    var recent = (((new Date()).getTime() - lastScan) <= 10000) ? 1 : 0;
    console.log("lastScan", lastScan);
    console.log("current time", new Date().getTime());
    console.log("time since lastScan", new Date().getTime() - lastScan);
    console.log("recent", recent);
    console.log("lpc", lpc);
    if (lpc > recent) {
        return true;
    }
    return false;
}

function determineComparison() {
    var check = compareAIAndScan();
    console.log("determining comparison", check);
    var lvb = document.getElementById("live-view-btn");
    if (lvb) {
        lvb.innerText = check ? "Live View (THREAT DETECTED)" : "Live View";
    }
}

firebase.auth().onAuthStateChanged((auth) => {
    updateHamburgerMenu();

    switch (location.pathname) {
        case "/profile.html":
            if (!auth) {
                location = "login.html";
            } else {
                loadProfileInfo();
            }
            break;

        case "/login.html":
            if (auth) {
                location = "profile.html";
            }
            break;

        case "/dashboard.html":
            if (!auth) {
                location = "login.html";
            } else {
                fetchProductId().then(() => {
                    fetchAttendanceData();
                })
                addCompareDBEvents();
            }

        default:
            break;
    }
})