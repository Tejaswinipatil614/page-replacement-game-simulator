let score = 0;

async function runSimulation() {

    document.getElementById("output").innerHTML = "";
    score = 0;

    const pages = document.getElementById("pages").value.split(" ").map(Number);
    const frames = parseInt(document.getElementById("frames").value);
    const algo = document.getElementById("algo").value;
    const guess = parseInt(document.getElementById("guess").value);

    const res = await fetch("http://127.0.0.1:5000/simulate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({pages, frames, algo, guess})
    });

    const data = await res.json();

    drawChart(data.faults);

    document.getElementById("output").innerHTML =
        `<h2>📊 Page Faults: ${data.faults}</h2>`;

    data.steps.forEach((s, i) => {
        setTimeout(() => {

            let framesHTML = s.frames.map(f =>
                `<div class="frame-box">${f}</div>`
            ).join("");

            let result = s.correct ? "✅ Correct" : "❌ Wrong";

            if (s.correct) score++;

            document.getElementById("output").innerHTML += `
                <div>
                    <h3>Step ${s.step}</h3>
                    ${framesHTML}
                    <p>Replaced: ${s.replaced || "None"} | ${result}</p>
                </div>
            `;

            document.getElementById("score").innerText =
                "🏆 Score: " + score;

        }, i * 800);
    });
}

function drawChart(faults) {
    const ctx = document.getElementById("chart").getContext("2d");

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Page Faults"],
            datasets: [{
                label: "Fault Count",
                data: [faults]
            }]
        }
    });
}