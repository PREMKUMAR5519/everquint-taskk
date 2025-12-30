function TaskOne(n) {
    if (n != '' && isNaN(n)) return console.log('Please enter a number');
    const buildings = {
        T: { time: 5, earnings: 1500, type: 'Theatre' },
        P: { time: 4, earnings: 1000, type: 'Pub' },
        C: { time: 10, earnings: 2000, type: 'Commercial Park' }
    };


    let Temp = new Array(n + 1).fill(0);

    for (let i = 1; i <= n; i++) {
        for (let key in buildings) {
            let b = buildings[key];
            if (i >= b.time) {
                let currentProfit = (i - b.time) * b.earnings + Temp[i - b.time];
                Temp[i] = Math.max(Temp[i], currentProfit);
            }
        }
    }

    const maxEarnings = Temp[n];
    let solutions = [];

    const maxT = Math.floor(n / buildings.T.time);
    const maxP = Math.floor(n / buildings.P.time);
    const maxC = Math.floor(n / buildings.C.time);

    for (let t = 0; t <= maxT; t++) {
        for (let p = 0; p <= maxP; p++) {
            for (let c = 0; c <= maxC; c++) {
                if ((t * 5 + p * 4 + c * 10) <= n) {
                    const currentEarnings = calculateEarnings(n, t, p, c, buildings);

                    if (currentEarnings === maxEarnings) {
                        solutions.push({ T: t, P: p, C: c });
                    }
                }
            }
        }
    }

    solutions.sort((a, b) => {
        const countDiff = (b.T + b.P + b.C) - (a.T + a.P + a.C);
        if (countDiff !== 0) return countDiff;
        if (b.T !== a.T) return b.T - a.T;
        if (b.P !== a.P) return b.P - a.P;
        return b.C - a.C;
    });

    const finalSolutions = solutions.filter(sol => {
        const timeUsed = (sol.T * 5) + (sol.P * 4) + (sol.C * 10);
        return timeUsed < n || (sol.T + sol.P + sol.C === 1 && timeUsed === n);
    });

    printOutput(n, maxEarnings, finalSolutions);
}

function calculateEarnings(totalTime, tCount, pCount, cCount, specs) {
    let currentTime = 0;
    let totalEarnings = 0;
    for (let i = 0; i < tCount; i++) { currentTime += specs.T.time; totalEarnings += (totalTime - currentTime) * specs.T.earnings; }
    for (let i = 0; i < pCount; i++) { currentTime += specs.P.time; totalEarnings += (totalTime - currentTime) * specs.P.earnings; }
    for (let i = 0; i < cCount; i++) { currentTime += specs.C.time; totalEarnings += (totalTime - currentTime) * specs.C.earnings; }
    return totalEarnings;
}

function printOutput(inputTime, earnings, solutions) {
    const useNumbering = inputTime < 10;
    console.log(`Time Unit: ${inputTime}`);
    console.log(`Earnings: $${earnings}`);

    if (!useNumbering) {
        console.log('');
    }

    console.log(useNumbering ? 'Solutions' : 'Solutions:');
    solutions.forEach((sol, index) => {
        const prefix = useNumbering ? `${index + 1}. ` : '';
        console.log(`${prefix}T: ${sol.T} P: ${sol.P} C: ${sol.C}`);
    });
    console.log('');
}

// TaskOne(7);
// TaskOne(13);
TaskOne(49);




