
function trap(heights) {
    if (heights === null || heights.length < 3) return 0;

    const n = heights.length;
    let totalWater = 0;

    // Calculate Max Left
    const maxLeft = new Array(n).fill(0);
    maxLeft[0] = heights[0];
    for (let i = 1; i < n; i++) {
        maxLeft[i] = Math.max(maxLeft[i - 1], heights[i]);
    }

    //  Max Right
    const maxRight = new Array(n).fill(0);
    maxRight[n - 1] = heights[n - 1];
    for (let i = n - 2; i >= 0; i--) {
        maxRight[i] = Math.max(maxRight[i + 1], heights[i]);
    }

    // Calculate Trapped Water
    for (let i = 0; i < n; i++) {
        const waterLevel = Math.min(maxLeft[i], maxRight[i]);
        const trapped = waterLevel - heights[i];
        if (trapped > 0) {
            totalWater += trapped;
        }
    }

    return totalWater;
}


function renderSVG(heights, waterAmounts) {
    const svg = document.getElementById('waterTankSVG');
    svg.innerHTML = '';

    if (!heights || heights.length === 0) return;

    const n = heights.length;
    const maxOverallHeight = Math.max(...heights);

    const blockWidth = 70;
    const scaleY = 300 / Math.max(maxOverallHeight + 1, 6);
    let currentX = 10;
    for (let i = 0; i < n; i++) {
        const h = heights[i];
        const w = waterAmounts[i] || 0;

        const blockHeight = h * scaleY;
        const blockY = 380 - blockHeight;
        const blockRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        blockRect.setAttribute('x', currentX);
        blockRect.setAttribute('y', blockY);
        blockRect.setAttribute('width', blockWidth);
        blockRect.setAttribute('height', blockHeight);
        blockRect.setAttribute('fill', '#e6e500');
        svg.appendChild(blockRect);

        if (w > 0) {
            const waterHeight = w * scaleY;
            const waterY = blockY - waterHeight;
            const maxLeft = getMax(heights.slice(0, i + 1));
            const maxRight = getMax(heights.slice(i, n));
            const waterLevel = Math.min(maxLeft, maxRight);

            const actualWaterLevelY = 380 - (waterLevel * scaleY);

            const waterRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            waterRect.setAttribute('x', currentX);
            waterRect.setAttribute('y', actualWaterLevelY);
            waterRect.setAttribute('width', blockWidth);
            waterRect.setAttribute('height', waterHeight);
            waterRect.setAttribute('fill', '#009ed8');
            svg.appendChild(waterRect);
        }

        currentX += blockWidth + 5;
    }

    svg.setAttribute('width', currentX);
}

function getMax(arr) {
    return arr.length === 0 ? 0 : Math.max(...arr);
}


function solveAndRender() {
    const inputString = document.getElementById('input_value').value;
    const heights = inputString.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 0);

    if (heights.length === 0) {
        document.getElementById('resultOutput').innerHTML = "Please enter valid, comma-separated, non-negative heights.";
        document.getElementById('waterTankSVG').innerHTML = '';
        return;
    }

    const totalTrappedWater = trap(heights);

    const n = heights.length;
    const maxLeft = new Array(n).fill(0);
    const maxRight = new Array(n).fill(0);
    const waterAmounts = new Array(n).fill(0);

    maxLeft[0] = heights[0];
    for (let i = 1; i < n; i++) {
        maxLeft[i] = Math.max(maxLeft[i - 1], heights[i]);
    }

    maxRight[n - 1] = heights[n - 1];
    for (let i = n - 2; i >= 0; i--) {
        maxRight[i] = Math.max(maxRight[i + 1], heights[i]);
    }

    for (let i = 0; i < n; i++) {
        const waterLevel = Math.min(maxLeft[i], maxRight[i]);
        waterAmounts[i] = Math.max(0, waterLevel - heights[i]);
    }

    //  result
    document.getElementById('resultOutput').innerHTML = `
        <h2>Output:${totalTrappedWater} Units</h2>`;

    renderSVG(heights, waterAmounts);
}

document.addEventListener('DOMContentLoaded', solveAndRender);