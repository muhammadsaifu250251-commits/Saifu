function calculate() {

    const deviceName =
        document.getElementById("deviceName").value;

    const watt =
        Number(document.getElementById("watt").value);

    const hours =
        Number(document.getElementById("hours").value);

    const days =
        Number(document.getElementById("days").value);

    const rate =
        Number(document.getElementById("rate").value);


    if (
        deviceName === "" ||
        watt <= 0 ||
        hours <= 0 ||
        days <= 0 ||
        rate <= 0
    ) {
        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
    }


    // คำนวณหน่วยไฟ
    const energy =
        (watt * hours * days) / 1000;


    // คำนวณค่าไฟ
    const cost =
        energy * rate;


    // แสดงผล
    document.getElementById("energy").textContent =
        energy.toFixed(2);

    document.getElementById("cost").textContent =
        cost.toFixed(2);


    // เพิ่มรายการ
    const list =
        document.getElementById("deviceList");

    const item =
        document.createElement("div");

    item.className = "device";

    item.innerHTML =
        "<strong>" + deviceName + "</strong><br>" +
        "กำลังไฟ: " + watt + " W<br>" +
        "ใช้งาน: " + hours + " ชั่วโมง/วัน<br>" +
        "ใช้ไฟ: " + energy.toFixed(2) + " kWh<br>" +
        "ค่าไฟ: " + cost.toFixed(2) + " บาท";

    list.appendChild(item);
}