/*
============================================================
STATIC AND DYNAMIC ROUTING SIMULATION
============================================================

TOPOLOGY

PC1
192.168.1.10
     |
    R1
     |
  R2
     |
    R3
     |
PC2
192.168.3.10


STATIC ROUTING

R1 -> R2 -> R3

RIP

RIP automatically learns remote networks.

============================================================
*/


// ============================================================
// DEVICES
// ============================================================

const PC1 = {

    ip: "192.168.1.10",

    gateway: "192.168.1.1"

};


const PC2 = {

    ip: "192.168.3.10",

    gateway: "192.168.3.1"

};


// ============================================================
// ROUTERS
// ============================================================

const routers = {

    R1: {

        lan: "192.168.1.0/24",

        interface: "10.0.0.1"

    },

    R2: {

        left: "10.0.0.2",

        right: "10.0.0.5"

    },

    R3: {

        interface: "10.0.0.6",

        lan: "192.168.3.0/24"

    }

};


// ============================================================
// SIMULATION VARIABLES
// ============================================================

let routingMode = "static";

let currentStep = 0;

let started = false;

const totalSteps = 9;


// ============================================================
// ELEMENTS
// ============================================================

const consoleBox =
    document.getElementById("routingConsole");

const progress =
    document.getElementById("progress");

const stepText =
    document.getElementById("stepText");


// ============================================================
// LOG
// ============================================================

function log(message, type = "") {

    const line =
        document.createElement("div");

    line.textContent =
        message;

    if (type) {

        line.classList.add(type);

    }

    consoleBox.appendChild(line);

    consoleBox.scrollTop =
        consoleBox.scrollHeight;

}


// ============================================================
// PROGRESS
// ============================================================

function updateProgress() {

    const percentage =
        (currentStep / totalSteps) * 100;

    progress.style.width =
        percentage + "%";

}


// ============================================================
// PACKET DISPLAY
// ============================================================

function updatePacket(

    source,
    destination,
    router,
    nextHop,
    protocol,
    hops

) {

    document.getElementById("sourceIP")
        .textContent = source;

    document.getElementById("destinationIP")
        .textContent = destination;

    document.getElementById("currentRouter")
        .textContent = router;

    document.getElementById("nextHop")
        .textContent = nextHop;

    document.getElementById("protocol")
        .textContent = protocol;

    document.getElementById("hopCount")
        .textContent = hops;

}


// ============================================================
// ACTIVATE LINK
// ============================================================

function activate(id) {

    document
        .getElementById(id)
        .classList.add("active");

}


// ============================================================
// SET ROUTING MODE
// ============================================================

function setRoutingMode(mode) {

    if (started) {

        return;

    }


    routingMode = mode;


    if (mode === "static") {

        document.getElementById("modeText")
            .textContent =
            "Current Mode: Static Routing";

    }

    else {

        document.getElementById("modeText")
            .textContent =
            "Current Mode: RIP Dynamic Routing";

    }

}


// ============================================================
// STEP 1
// ============================================================

function stepOne() {

    log(
        "==================================================",
        "info"
    );

    log(
        "STEP 1: PC1 sends ICMP Echo Request",
        "info"
    );

    log(
        `Source IP: ${PC1.ip}`
    );

    log(
        `Destination IP: ${PC2.ip}`
    );

    log(
        "PC1 checks its default gateway."
    );

    log(
        `Default Gateway: ${PC1.gateway}`
    );


    updatePacket(

        PC1.ip,

        PC2.ip,

        "PC1",

        PC1.gateway,

        "ICMP",

        0

    );


    activate("line1");


    stepText.textContent =
        "Step 1: PC1 sends an ICMP packet to its gateway.";

}


// ============================================================
// STEP 2
// ============================================================

function stepTwo() {

    log(
        "STEP 2: R1 receives packet",
        "info"
    );

    log(
        "[R1] Destination network: 192.168.3.0/24."
    );


    if (routingMode === "static") {

        log(
            "[R1] Searching static routing table."
        );

        log(
            "[R1] Route found:"
        );

        log(
            "192.168.3.0/24 -> 10.0.0.2"
        );

    }

    else {

        log(
            "[R1] Searching RIP routing table."
        );

        log(
            "[R1] RIP route found:"
        );

        log(
            "192.168.3.0/24 -> 10.0.0.2"
        );

    }


    updatePacket(

        PC1.ip,

        PC2.ip,

        "R1",

        "10.0.0.2",

        "ICMP",

        1

    );


    activate("line2");


    stepText.textContent =
        "Step 2: R1 selects the route toward R2.";

}


// ============================================================
// STEP 3
// ============================================================

function stepThree() {

    log(
        "STEP 3: R1 forwards packet to R2",
        "info"
    );

    log(
        "[R1] Next-hop address = 10.0.0.2."
    );

    log(
        "[R1] Forwarding packet through G0/1."
    );


    updatePacket(

        PC1.ip,

        PC2.ip,

        "R1",

        "10.0.0.2",

        "ICMP",

        1

    );


    stepText.textContent =
        "Step 3: R1 forwards the packet to R2.";

}


// ============================================================
// STEP 4
// ============================================================

function stepFour() {

    log(
        "STEP 4: R2 receives packet",
        "info"
    );

    log(
        "[R2] Packet received on 10.0.0.2."
    );

    log(
        "[R2] Destination = 192.168.3.0/24."
    );


    if (routingMode === "static") {

        log(
            "[R2] Static route selected:"
        );

        log(
            "192.168.3.0/24 -> 10.0.0.6"
        );

    }

    else {

        log(
            "[R2] RIP route selected:"
        );

        log(
            "192.168.3.0/24 -> 10.0.0.6"
        );

    }


    updatePacket(

        PC1.ip,

        PC2.ip,

        "R2",

        "10.0.0.6",

        "ICMP",

        2

    );


    activate("line3");


    stepText.textContent =
        "Step 4: R2 selects the route toward R3.";

}


// ============================================================
// STEP 5
// ============================================================

function stepFive() {

    log(
        "STEP 5: R2 forwards packet to R3",
        "info"
    );

    log(
        "[R2] Next hop = 10.0.0.6."
    );

    log(
        "[R2] Forwarding through G0/1."
    );


    updatePacket(

        PC1.ip,

        PC2.ip,

        "R2",

        "10.0.0.6",

        "ICMP",

        2

    );


    stepText.textContent =
        "Step 5: R2 forwards the packet to R3.";

}


// ============================================================
// STEP 6
// ============================================================

function stepSix() {

    log(
        "STEP 6: R3 receives packet",
        "info"
    );

    log(
        "[R3] Destination network is directly connected."
    );

    log(
        "[R3] 192.168.3.0/24 is on the local LAN."
    );

    log(
        "[R3] Forwarding packet to PC2."
    );


    updatePacket(

        PC1.ip,

        PC2.ip,

        "R3",

        PC2.ip,

        "ICMP",

        3

    );


    activate("line4");


    stepText.textContent =
        "Step 6: R3 forwards the packet to PC2.";

}


// ============================================================
// STEP 7
// ============================================================

function stepSeven() {

    log(
        "STEP 7: PC2 receives ICMP Echo Request",
        "info"
    );

    log(
        `[PC2] Packet received from ${PC1.ip}.`
    );

    log(
        "[PC2] Generating ICMP Echo Reply."
    );

    log(
        "[PC2] Sending reply toward gateway 192.168.3.1."
    );


    stepText.textContent =
        "Step 7: PC2 receives the ICMP request.";

}


// ============================================================
// STEP 8
// ============================================================

function stepEight() {

    log(
        "STEP 8: ICMP Echo Reply returns",
        "info"
    );

    log(
        "[R3] Forwarding reply to R2."
    );

    log(
        "[R2] Forwarding reply to R1."
    );

    log(
        "[R1] Forwarding reply to PC1."
    );

    log(
        "ICMP reply successfully delivered.",
        "success"
    );


    stepText.textContent =
        "Step 8: ICMP Echo Reply reaches PC1.";

}


// ============================================================
// STEP 9
// ============================================================

function stepNine() {

    log(
        "STEP 9: Ping test completed",
        "info"
    );

    log(
        `Reply from ${PC2.ip}: bytes=32 time<1ms TTL=61`,
        "success"
    );

    log(
        "Packets: Sent = 1, Received = 1, Lost = 0",
        "success"
    );


    const result =
        document.getElementById("pingResult");

    result.classList.add("success");


    result.innerHTML = `

        Reply from ${PC2.ip}:
        bytes=32 time<1ms TTL=61

        <br><br>

        Ping statistics:

        <br>

        Packets: Sent = 1,
        Received = 1,
        Lost = 0

        <br><br>

        Routing Mode:
        ${routingMode === "static"
            ? "Static Routing"
            : "RIP Dynamic Routing"}

        <br><br>

        <strong>
        Result: SUCCESS
        </strong>

    `;


    passTest("test1");

    passTest("test2");

    passTest("test3");

    passTest("test4");

    passTest("test5");


    log(
        "==================================================",
        "success"
    );

    log(
        "STATIC / DYNAMIC ROUTING TEST PASSED",
        "success"
    );


    stepText.textContent =
        "Routing simulation completed successfully.";

}


// ============================================================
// PASS TEST
// ============================================================

function passTest(id) {

    const element =
        document.getElementById(id);

    element.textContent =
        "PASS";

    element.classList.add("pass");

}


// ============================================================
// EXECUTE STEP
// ============================================================

function executeStep() {

    currentStep++;

    updateProgress();


    switch (currentStep) {

        case 1:
            stepOne();
            break;

        case 2:
            stepTwo();
            break;

        case 3:
            stepThree();
            break;

        case 4:
            stepFour();
            break;

        case 5:
            stepFive();
            break;

        case 6:
            stepSix();
            break;

        case 7:
            stepSeven();
            break;

        case 8:
            stepEight();
            break;

        case 9:
            stepNine();
            break;

    }

}


// ============================================================
// START
// ============================================================

function startSimulation() {

    if (started) {

        return;

    }


    started = true;


    consoleBox.innerHTML = "";


    log(
        "Starting routing simulation...",
        "info"
    );


    log(
        `Routing mode: ${
            routingMode === "static"
                ? "STATIC ROUTING"
                : "RIP DYNAMIC ROUTING"
        }`,
        "info"
    );


    log(
        "Topology: PC1 -> R1 -> R2 -> R3 -> PC2",
        "info"
    );


    executeStep();

}


// ============================================================
// NEXT STEP
// ============================================================

function nextStep() {

    if (!started) {

        startSimulation();

        return;

    }


    if (currentStep < totalSteps) {

        executeStep();

    }

}


// ============================================================
// RESET
// ============================================================

function resetSimulation() {

    currentStep = 0;

    started = false;


    consoleBox.innerHTML = `

        <div>
            Routing simulator ready...
        </div>

        <div>
            Select Static Routing or RIP.
        </div>

    `;


    progress.style.width =
        "0%";


    stepText.textContent =
        "Ready to start routing simulation.";


    updatePacket(

        "--",
        "--",
        "--",
        "--",
        "--",
        "--"

    );


    for (let i = 1; i <= 4; i++) {

        document
            .getElementById("line" + i)
            .classList.remove("active");

    }


    const ping =
        document.getElementById("pingResult");

    ping.classList.remove("success");

    ping.textContent =
        "Waiting for routing simulation...";


    for (let i = 1; i <= 5; i++) {

        const test =
            document.getElementById("test" + i);

        test.textContent =
            "WAITING";

        test.classList.remove("pass");

    }

}