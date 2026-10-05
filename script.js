// ========================================
// Smart Energy V10 FINAL
// ========================================


// ========================================
// DATA
// ========================================

let devices =
    JSON.parse(
        localStorage.getItem("smartEnergyDevices")
    ) || [];

let editingIndex = -1;


// ========================================
// SAVE DATA
// ========================================

function saveData() {

    localStorage.setItem(
        "smartEnergyDevices",
        JSON.stringify(devices)
    );

}


// ========================================
// QUICK DEVICE
// ========================================

function selectDevice(name, watt) {

    document.getElementById("deviceName").value =
        name;

    document.getElementById("watt").value =
        watt;

    document.getElementById("deviceName")
        .scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

}


// ========================================
// ADD / EDIT DEVICE
// ========================================

function calculate() {

    const name =
        document
            .getElementById("deviceName")
            .value
            .trim();

    const watt =
        Number(
            document.getElementById("watt").value
        );

    const hours =
        Number(
            document.getElementById("hours").value
        );

    const days =
        Number(
            document.getElementById("days").value
        );

    const rate =
        Number(
            document.getElementById("rate").value
        );


    if (
        name === "" ||
        watt <= 0 ||
        hours <= 0 ||
        days <= 0 ||
        rate <= 0
    ) {

        alert("กรุณากรอกข้อมูลให้ครบ");

        return;
    }


    if (hours > 24) {

        alert(
            "ชั่วโมงการใช้งานต่อวันต้องไม่เกิน 24 ชั่วโมง"
        );

        return;
    }


    if (days > 31) {

        alert(
            "จำนวนวันต่อเดือนไม่ควรเกิน 31 วัน"
        );

        return;
    }


    const energy =
        (watt * hours * days) / 1000;


    const cost =
        energy * rate;


    const device = {

        name: name,

        watt: watt,

        hours: hours,

        days: days,

        rate: rate,

        energy: energy,

        cost: cost

    };


    // EDIT

    if (editingIndex >= 0) {

        devices[editingIndex] =
            device;

        editingIndex = -1;

        document.getElementById(
            "addButton"
        ).textContent =
            "+ เพิ่มเครื่องใช้ไฟฟ้า";

    }


    // ADD

    else {

        devices.push(device);

    }


    saveData();

    updateDisplay();

    clearForm();

}


// ========================================
// CLEAR FORM
// ========================================

function clearForm() {

    document.getElementById(
        "deviceName"
    ).value = "";

    document.getElementById(
        "watt"
    ).value = "";

    document.getElementById(
        "hours"
    ).value = "";

}


// ========================================
// UPDATE ALL
// ========================================

function updateDisplay() {

    updateDashboard();

    updateDeviceList();

    updateChart();

    updateRanking();

    updateAdvisor();

    updateSimulator();

    updateTarget();

}


// ========================================
// DASHBOARD
// ========================================

function updateDashboard() {

    let totalEnergy = 0;

    let totalCost = 0;


    devices.forEach(function(device) {

        totalEnergy += device.energy;

        totalCost += device.cost;

    });


    document.getElementById(
        "totalEnergy"
    ).textContent =
        totalEnergy.toFixed(2);


    document.getElementById(
        "totalCost"
    ).textContent =
        totalCost.toFixed(2);


    document.getElementById(
        "yearCost"
    ).textContent =
        (totalCost * 12).toFixed(2);


    document.getElementById(
        "deviceCount"
    ).textContent =
        devices.length;


    document.getElementById(
        "deviceSubtitle"
    ).textContent =
        devices.length === 0
            ? "ยังไม่มีรายการ"
            : `มี ${devices.length} เครื่อง`;


    updateTargetDifference(totalCost);

}


// ========================================
// TARGET DIFFERENCE
// ========================================

function updateTargetDifference(totalCost) {

    const target =
        Number(
            localStorage.getItem(
                "smartEnergyTarget"
            )
        );


    const element =
        document.getElementById(
            "targetDifference"
        );


    if (!target) {

        element.textContent = "-";

        return;
    }


    const difference =
        target - totalCost;


    element.textContent =
        Math.abs(difference).toFixed(0);


}


// ========================================
// DEVICE LIST
// ========================================

function updateDeviceList() {

    const list =
        document.getElementById(
            "deviceList"
        );


    if (devices.length === 0) {

        list.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🔌
                </div>

                <strong>
                    ยังไม่มีเครื่องใช้ไฟฟ้า
                </strong>

                <p>
                    เพิ่มเครื่องแรกของคุณด้านบน
                </p>

            </div>

        `;

        return;
    }


    let totalEnergy = 0;


    devices.forEach(function(device) {

        totalEnergy +=
            device.energy;

    });


    list.innerHTML = "";


    devices.forEach(function(device, index) {

        const percentage =
            totalEnergy > 0
                ? (device.energy / totalEnergy) * 100
                : 0;


        const item =
            document.createElement("div");


        item.className =
            "device";


        item.innerHTML = `

            <div class="device-top">

                <div class="device-name">

                    <strong>
                        ${escapeHTML(device.name)}
                    </strong>

                    <span>
                        ${device.watt} W
                    </span>

                </div>


                <div class="device-actions">

                    <button
                        class="edit-button"
                        onclick="editDevice(${index})"
                    >
                        แก้ไข
                    </button>


                    <button
                        class="delete-button"
                        onclick="deleteDevice(${index})"
                    >
                        ×
                    </button>

                </div>

            </div>


            <div class="device-details">

                <span>
                    ⏱️ ${device.hours} ชม./วัน
                </span>

                <span>
                    📅 ${device.days} วัน/เดือน
                </span>

                <span>
                    ⚡ ${device.rate} บาท/kWh
                </span>

            </div>


            <div class="device-cost">

                <strong>
                    ฿${device.cost.toFixed(2)}
                </strong>

                <span>
                    ${device.energy.toFixed(2)} kWh/เดือน
                </span>

            </div>


            <div class="progress">

                <div
                    style="width:${percentage}%"
                ></div>

            </div>

        `;


        list.appendChild(item);

    });

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ========================================
// EDIT
// ========================================

function editDevice(index) {

    const device =
        devices[index];


    editingIndex =
        index;


    document.getElementById(
        "deviceName"
    ).value =
        device.name;


    document.getElementById(
        "watt"
    ).value =
        device.watt;


    document.getElementById(
        "hours"
    ).value =
        device.hours;


    document.getElementById(
        "days"
    ).value =
        device.days;


    document.getElementById(
        "rate"
    ).value =
        device.rate;


    document.getElementById(
        "addButton"
    ).textContent =
        "✓ บันทึกการแก้ไข";


    document.getElementById(
        "deviceName"
    ).scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


// ========================================
// DELETE
// ========================================

function deleteDevice(index) {

    const device =
        devices[index];


    const confirmDelete =
        confirm(
            `ต้องการลบ "${device.name}" หรือไม่?`
        );


    if (!confirmDelete) {

        return;

    }


    devices.splice(index, 1);


    saveData();

    updateDisplay();

}


// ========================================
// CHART
// ========================================

function updateChart() {

    const card =
        document.getElementById(
            "chartCard"
        );

    const chart =
        document.getElementById(
            "energyChart"
        );


    if (devices.length === 0) {

        card.style.display =
            "none";

        return;

    }


    card.style.display =
        "block";


    let totalEnergy = 0;


    devices.forEach(function(device) {

        totalEnergy +=
            device.energy;

    });


    chart.innerHTML = "";


    const sorted =
        [...devices].sort(
            (a, b) =>
                b.energy - a.energy
        );


    sorted.forEach(function(device) {

        const percentage =
            totalEnergy > 0
                ? (device.energy / totalEnergy) * 100
                : 0;


        const row =
            document.createElement("div");


        row.className =
            "chart-row";


        row.innerHTML = `

            <div class="chart-label">

                <span>
                    ${escapeHTML(device.name)}
                </span>

                <strong>
                    ${percentage.toFixed(1)}%
                </strong>

            </div>


            <div class="chart-bar">

                <div
                    style="width:${percentage}%"
                ></div>

            </div>

        `;


        chart.appendChild(row);

    });

}


// ========================================
// RANKING
// ========================================

function updateRanking() {

    const card =
        document.getElementById(
            "rankingCard"
        );

    const list =
        document.getElementById(
            "rankingList"
        );


    if (devices.length === 0) {

        card.style.display =
            "none";

        return;

    }


    card.style.display =
        "block";


    const sorted =
        [...devices].sort(
            (a, b) =>
                b.energy - a.energy
        );


    list.innerHTML = "";


    sorted.forEach(function(device, index) {

        const item =
            document.createElement("div");


        item.className =
            "ranking-item";


        item.innerHTML = `

            <span class="rank">
                ${index + 1}
            </span>


            <div class="ranking-info">

                <strong>
                    ${escapeHTML(device.name)}
                </strong>

                <small>
                    ${device.energy.toFixed(2)}
                    kWh/เดือน
                </small>

            </div>


            <span class="ranking-cost">
                ฿${device.cost.toFixed(2)}
            </span>

        `;


        list.appendChild(item);

    });

}


// ========================================
// SMART ENERGY ADVISOR
// ========================================

function updateAdvisor() {

    const card =
        document.getElementById(
            "advisorCard"
        );

    const content =
        document.getElementById(
            "advisorContent"
        );


    if (devices.length === 0) {

        card.style.display =
            "none";

        return;

    }


    card.style.display =
        "block";


    const sorted =
        [...devices].sort(
            (a, b) =>
                b.cost - a.cost
        );


    const top =
        sorted[0];


    const savingHours =
        Math.min(
            2,
            top.hours
        );


    const savingEnergy =
        (
            top.watt *
            savingHours *
            top.days
        ) / 1000;


    const savingMoney =
        savingEnergy *
        top.rate;


    content.innerHTML = `

        <div class="advice-item">

            🔴 เครื่องที่ควรให้ความสนใจมากที่สุดคือ

            <strong>
                ${escapeHTML(top.name)}
            </strong>

            เพราะมีค่าไฟประมาณ

            <strong>
                ฿${top.cost.toFixed(2)}
            </strong>

            ต่อเดือน

        </div>


        <div class="advice-item">

            💡 หากลดการใช้งานเครื่องนี้ประมาณ

            <strong>
                ${savingHours} ชั่วโมง/วัน
            </strong>

            อาจประหยัดได้ประมาณ

            <div class="advice-saving">

                ฿${savingMoney.toFixed(2)}
                /เดือน

            </div>

        </div>


        <div class="advice-item">

            📊 เครื่องนี้คิดเป็นประมาณ

            <strong>
                ${getDevicePercentage(top).toFixed(1)}%
            </strong>

            ของการใช้ไฟทั้งหมด

        </div>

    `;

}


// ========================================
// DEVICE PERCENTAGE
// ========================================

function getDevicePercentage(device) {

    const total =
        devices.reduce(
            (sum, item) =>
                sum + item.energy,
            0
        );


    if (total === 0) {

        return 0;

    }


    return (
        device.energy / total
    ) * 100;

}


// ========================================
// TARGET
// ========================================

const targetInput =
    document.getElementById(
        "targetCost"
    );


targetInput.addEventListener(
    "input",
    function() {

        localStorage.setItem(
            "smartEnergyTarget",
            this.value
        );

        updateTarget();

        updateDashboard();

    }
);


function updateTarget() {

    const target =
        Number(
            localStorage.getItem(
                "smartEnergyTarget"
            )
        );


    const current =
        devices.reduce(
            (sum, device) =>
                sum + device.cost,
            0
        );


    const status =
        document.getElementById(
            "targetStatus"
        );


    if (!target) {

        status.textContent =
            "ยังไม่ได้ตั้งเป้าหมาย";

        status.className =
            "target-status";

        return;

    }


    if (current <= target) {

        const remaining =
            target - current;


        status.innerHTML = `

            ✅ อยู่ในเป้าหมาย

            <strong>
                เหลืออีก ฿${remaining.toFixed(2)}
            </strong>

        `;


        status.className =
            "target-status success";

    }

    else {

        const over =
            current - target;


        status.innerHTML = `

            ⚠️ เกินเป้าหมาย

            <strong>
                ฿${over.toFixed(2)}
            </strong>

        `;


        status.className =
            "target-status danger";

    }

}


// ========================================
// SIMULATOR
// ========================================

function updateSimulator() {

    const select =
        document.getElementById(
            "simulatorDevice"
        );


    const currentValue =
        select.value;


    select.innerHTML = `

        <option value="">
            -- เลือกเครื่องใช้ไฟฟ้า --
        </option>

    `;


    devices.forEach(function(device, index) {

        const option =
            document.createElement("option");


        option.value =
            index;


        option.textContent =
            device.name;


        select.appendChild(option);

    });


    if (
        currentValue !== "" &&
        devices[currentValue]
    ) {

        select.value =
            currentValue;

    }

}


// ========================================
// TOGGLE SIMULATOR
// ========================================

function toggleSimulator() {

    const simulator =
        document.getElementById(
            "simulator"
        );

    const icon =
        document.getElementById(
            "toggleIcon"
        );


    if (
        simulator.style.display ===
        "none"
    ) {

        simulator.style.display =
            "block";

        icon.textContent =
            "−";

    }

    else {

        simulator.style.display =
            "none";

        icon.textContent =
            "＋";

    }

}


// ========================================
// SIMULATE SAVING
// ========================================

function simulateSaving() {

    const index =
        document.getElementById(
            "simulatorDevice"
        ).value;


    const newHours =
        Number(
            document.getElementById(
                "newHours"
            ).value
        );


    const result =
        document.getElementById(
            "simulationResult"
        );


    if (
        index === "" ||
        newHours < 0
    ) {

        alert(
            "กรุณาเลือกเครื่องและกรอกชั่วโมงใหม่"
        );

        return;

    }


    if (newHours > 24) {

        alert(
            "ชั่วโมงต้องไม่เกิน 24 ชั่วโมงต่อวัน"
        );

        return;

    }


    const device =
        devices[index];


    const oldCost =
        device.cost;


    const newEnergy =
        (
            device.watt *
            newHours *
            device.days
        ) / 1000;


    const newCost =
        newEnergy *
        device.rate;


    const saving =
        oldCost - newCost;


    if (saving <= 0) {

        result.innerHTML = `

            <div class="warning">

                ⚠️
                ชั่วโมงใหม่ไม่ได้ช่วยลดค่าไฟ

            </div>

        `;

        return;

    }


    const percent =
        oldCost > 0
            ? (saving / oldCost) * 100
            : 0;


    result.innerHTML = `

        <div class="saving-result">

            <span>
                คุณอาจประหยัดได้
            </span>


            <strong>
                ฿${saving.toFixed(2)}
            </strong>


            <small>
                ต่อเดือน
                (${percent.toFixed(1)}%)
            </small>


            <div class="saving-compare">

                ฿${oldCost.toFixed(2)}

                →

                ฿${newCost.toFixed(2)}

            </div>

        </div>

    `;

}


// ========================================
// DARK MODE
// ========================================

function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    const dark =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "smartEnergyTheme",
        dark
            ? "dark"
            : "light"
    );


    document.querySelector(
        ".theme-button"
    ).textContent =
        dark
            ? "☀️"
            : "🌙";

}


// ========================================
// LOAD THEME
// ========================================

function loadTheme() {

    const theme =
        localStorage.getItem(
            "smartEnergyTheme"
        );


    if (theme === "dark") {

        document.body.classList.add(
            "dark"
        );


        document.querySelector(
            ".theme-button"
        ).textContent =
            "☀️";

    }

}


// ========================================
// EXPORT REPORT
// ========================================

function exportReport() {

    if (devices.length === 0) {

        alert(
            "ยังไม่มีข้อมูลสำหรับสร้างรายงาน"
        );

        return;

    }


    let totalEnergy = 0;

    let totalCost = 0;


    devices.forEach(function(device) {

        totalEnergy +=
            device.energy;

        totalCost +=
            device.cost;

    });


    const target =
        Number(
            localStorage.getItem(
                "smartEnergyTarget"
            )
        ) || 0;


    let report = "";

    report +=
        "SMART ENERGY REPORT\n";

    report +=
        "============================\n\n";


    report +=
        `ค่าไฟต่อเดือน: ${totalCost.toFixed(2)} บาท\n`;

    report +=
        `ค่าไฟต่อปี: ${(totalCost * 12).toFixed(2)} บาท\n`;

    report +=
        `ใช้ไฟทั้งหมด: ${totalEnergy.toFixed(2)} kWh\n`;

    report +=
        `จำนวนเครื่อง: ${devices.length} เครื่อง\n`;


    if (target > 0) {

        report +=
            `เป้าหมายค่าไฟ: ${target.toFixed(2)} บาท\n`;

    }


    report +=
        "\nเครื่องใช้ไฟฟ้า\n";

    report +=
        "----------------------------\n";


    devices.forEach(function(device, index) {

        report +=
            `${index + 1}. ${device.name}\n`;

        report +=
            `   กำลังไฟ: ${device.watt} W\n`;

        report +=
            `   ใช้งาน: ${device.hours} ชม./วัน\n`;

        report +=
            `   ใช้ไฟ: ${device.energy.toFixed(2)} kWh/เดือน\n`;

        report +=
            `   ค่าไฟ: ${device.cost.toFixed(2)} บาท/เดือน\n\n`;

    });


    report +=
        "สร้างโดย Smart Energy";


    const blob =
        new Blob(
            [report],
            {
                type:
                    "text/plain;charset=utf-8"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href =
        url;


    link.download =
        "smart-energy-report.txt";


    link.click();


    URL.revokeObjectURL(url);

}


// ========================================
// RESET
// ========================================

function resetAll() {

    if (
        !confirm(
            "ต้องการล้างข้อมูลทั้งหมดหรือไม่?"
        )
    ) {

        return;

    }


    devices = [];

    editingIndex = -1;


    localStorage.removeItem(
        "smartEnergyDevices"
    );

    localStorage.removeItem(
        "smartEnergyTarget"
    );


    document.getElementById(
        "targetCost"
    ).value = "";


    document.getElementById(
        "addButton"
    ).textContent =
        "+ เพิ่มเครื่องใช้ไฟฟ้า";


    updateDisplay();

}


// ========================================
// LOAD SAVED TARGET
// ========================================

function loadSavedTarget() {

    const target =
        localStorage.getItem(
            "smartEnergyTarget"
        );


    if (target) {

        document.getElementById(
            "targetCost"
        ).value =
            target;

    }

}


// ========================================
// START APP
// ========================================

loadTheme();

loadSavedTarget();

updateDisplay();