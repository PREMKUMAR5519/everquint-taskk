
function TaskOne(n) {
    if (n != '' && isNaN(n)) return console.log('Please enter a number');
    const buildings = {
        T: { time: 5, earnings: 1500, type: 'Theatre' },
        P: { time: 4, earnings: 1000, type: 'Pub' },
        C: { time: 10, earnings: 2000, type: 'Commercial Park' }
    };

    let maxEarnings = -1;
    let solutions = [];

    const maxT = Math.floor(n / buildings.T.time);

    for (let t = 0; t <= maxT; t++) {
        const timeAfterT = n - (t * buildings.T.time);
        const maxP = Math.floor(timeAfterT / buildings.P.time);

        for (let p = 0; p <= maxP; p++) {
            const timeAfterP = timeAfterT - (p * buildings.P.time);
            const maxC = Math.floor(timeAfterP / buildings.C.time);

            for (let c = 0; c <= maxC; c++) {
                const currentEarnings = calculateEarnings(n, t, p, c, buildings);

                if (currentEarnings > maxEarnings) {
                    maxEarnings = currentEarnings;
                    solutions = [{ T: t, P: p, C: c }];
                } else if (currentEarnings === maxEarnings) {
                    solutions.push({ T: t, P: p, C: c });
                }
            }
        }
    }

    printOutput(n, maxEarnings, solutions);
}


function calculateEarnings(totalTime, tCount, pCount, cCount, specs) {
    let currentTime = 0;
    let totalEarnings = 0;

    // Build Theatres 
    for (let i = 0; i < tCount; i++) {
        currentTime += specs.T.time;
        totalEarnings += (totalTime - currentTime) * specs.T.earnings;
    }

    // Build Pubs
    for (let i = 0; i < pCount; i++) {
        currentTime += specs.P.time;
        totalEarnings += (totalTime - currentTime) * specs.P.earnings;
    }

    // Build Commercial Parks
    for (let i = 0; i < cCount; i++) {
        currentTime += specs.C.time;
        totalEarnings += (totalTime - currentTime) * specs.C.earnings;
    }

    return totalEarnings;
}


function printOutput(inputTime, earnings, solutions) {
    console.log(`Result for Time Unit: ${inputTime}`);
    console.log(`Earnings: $${earnings}`);
    console.log(`Solutions`);

    solutions.forEach((sol, index) => {
        console.log(`${index + 1}. T: ${sol.T} P: ${sol.P} C: ${sol.C}`);
    });
    console.log('');
}


TaskOne();