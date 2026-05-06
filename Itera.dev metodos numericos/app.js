// ==========================================
//   VARIABLES GLOBALES Y CONTROL DE MODAL
// ==========================================
let currentMethod = '';
let myChart = null;

function closeModal() {
    const modal = document.getElementById('welcomeModal');
    modal.classList.add('hidden');
    setTimeout(() => { modal.style.display = 'none'; }, 500);
}

function getDecimals() {
    return parseInt(document.getElementById('decimalCount').value) || 6;
}

// ==========================================
//     1. ENRUTADOR Y CONTROL DE INTERFAZ
// ==========================================
function loadMethod(method) {
    currentMethod = method;
    clearData();

    const title = document.getElementById('method-title');
    const inputsContainer = document.getElementById('inputs-container');
    let inputsHTML = '<div class="input-grid">';


    if (method === 'bolzano') {
        title.innerText = 'Teorema de Bolzano';
        inputsHTML += `
            <div class="input-group"><label>Función f(x)</label><input type="text" id="func" value="x^3 + 4*x^2 - 10"></div>
            <div class="input-group"><label>Límite Inferior (a)</label><input type="number" id="a" value="1" step="any"></div>
            <div class="input-group"><label>Límite Superior (b)</label><input type="number" id="b" value="2" step="any"></div>
        `;
    }
    else if (method === 'biseccion' || method === 'regla_falsa') {
        title.innerText = method === 'biseccion' ? 'Método de Bisección' : 'Regla Falsa (Falsa Posición)';
        inputsHTML += `
            <div class="input-group"><label>Función f(x)</label><input type="text" id="func" value="x^3 + 4*x^2 - 10"></div>
            <div class="input-group"><label>Límite Inferior (a)</label><input type="number" id="a" value="1" step="any"></div>
            <div class="input-group"><label>Límite Superior (b)</label><input type="number" id="b" value="2" step="any"></div>
        `;
    }
    else if (method === 'secante') {
        title.innerText = 'Método de la Secante';
        inputsHTML += `
            <div class="input-group"><label>Función f(x)</label><input type="text" id="func" value="x^3 + 4*x^2 - 10"></div>
            <div class="input-group"><label>Valor Inicial (p0)</label><input type="number" id="p0" value="1" step="any"></div>
            <div class="input-group"><label>Valor Inicial (p1)</label><input type="number" id="p1" value="2" step="any"></div>
        `;
    }
    else if (method === 'newton') {
        title.innerText = 'Método de Newton-Raphson';
        inputsHTML += `
            <div class="input-group"><label>Función f(x)</label><input type="text" id="func" value="x^3 + 4*x^2 - 10"></div>
            <div class="input-group"><label>Punto Inicial (p0)</label><input type="number" id="p0" value="1.5" step="any"></div>
        `;
    }
    else if (method === 'punto_fijo') {
        title.innerText = 'Iteración de Punto Fijo';
        inputsHTML += `
            <div class="input-group"><label>Función g(x)</label><input type="text" id="func" value="(10 - 4*x^2)^(1/3)"></div>
            <div class="input-group"><label>Valor Inicial (p0)</label><input type="number" id="p0" value="1.5" step="any"></div>
        `;
    }
    else if (method === 'muller') {
        title.innerText = 'Método de Müller';
        inputsHTML += `
            <div class="input-group"><label>Función f(x)</label><input type="text" id="func" value="16*x^4 - 40*x^3 + 5*x^2 + 20*x + 6"></div>
            <div class="input-group"><label>x0</label><input type="number" id="x0" value="0.5" step="any"></div>
            <div class="input-group"><label>x1</label><input type="number" id="x1" value="-0.5" step="any"></div>
            <div class="input-group"><label>x2</label><input type="number" id="x2" value="0.0" step="any"></div>
        `;
    }
    else if (method === 'horner') {
        title.innerText = 'Método de Horner';
        inputsHTML += `
            <div class="input-group"><label>Ecuación Polinómica f(x)</label><input type="text" id="func" value="2*x^4 - 3*x^2 + 3*x - 4" placeholder="ej: 2*x^4 - 3*x^2 + 3*x - 4"></div>
            <div class="input-group"><label>Punto de evaluación (x0)</label><input type="number" id="x0" value="-2" step="any"></div>
        `;
    }
    else if (method === 'bairstow') {
        title.innerText = 'Método de Bairstow';
        inputsHTML += `
            <div class="input-group"><label>Ecuación Polinómica f(x)</label><input type="text" id="func" value="x^4 + x^3 + 3*x^2 + 4*x + 6" placeholder="ej: x^4 + x^3 + 3*x^2 + 4*x + 6"></div>
            <div class="input-group"><label>Valor inicial (r0)</label><input type="number" id="r0" value="-2.1" step="any"></div>
            <div class="input-group"><label>Valor inicial (s0)</label><input type="number" id="s0" value="-1.9" step="any"></div>
        `;
    }
    else if (method === 'newton_multivariable') {
        title.innerText = 'Newton-Raphson Multivariable';
        inputsHTML += `
            <div class="input-group"><label>f1(x,y,z)</label><input type="text" id="f1" value="x^2 + y^2 + z^2 - 9"></div>
            <div class="input-group"><label>f2(x,y,z)</label><input type="text" id="f2" value="x^2 - y - z"></div>
            <div class="input-group"><label>f3(x,y,z) (Dejar vacío si es 2x2)</label><input type="text" id="f3" value="x - z"></div>
            <div class="input-group"><label>Valor Inicial x0</label><input type="number" id="x0" value="1" step="any"></div>
            <div class="input-group"><label>Valor Inicial y0</label><input type="number" id="y0" value="1" step="any"></div>
            <div class="input-group"><label>Valor Inicial z0 (Si aplica)</label><input type="number" id="z0" value="1" step="any"></div>
        `;
    }



    inputsHTML += `<div class="input-group"><label>&nbsp;</label><button class="btn btn-primary" onclick="runAlgorithm()">Calcular</button></div></div>`;

    inputsContainer.innerHTML = inputsHTML;
    inputsContainer.classList.remove('fade-in');
    void inputsContainer.offsetWidth;
    inputsContainer.classList.add('fade-in');
}

function clearData() {
    document.getElementById('tableHead').innerHTML = '';
    document.getElementById('tableBody').innerHTML = '';
    if (myChart) { myChart.destroy(); myChart = null; }
}

function exportExcel() {
    const table = document.getElementById('resultsTable');
    if (!table || table.rows.length <= 1) { alert("No hay datos para exportar."); return; }
    const wb = XLSX.utils.table_to_book(table, { sheet: "Resultados" });
    XLSX.writeFile(wb, `Resultados_${currentMethod}.xlsx`);
}

function f(funcString, x_val) {
    try { return math.evaluate(funcString, { x: x_val }); }
    catch (error) { alert("Error en la función."); throw error; }
}

function runAlgorithm() {
    try {
        if (currentMethod === 'bolzano') runBolzano();
        else if (currentMethod === 'biseccion') runBisection();
        else if (currentMethod === 'regla_falsa') runReglaFalsa();
        else if (currentMethod === 'secante') runSecante();
        else if (currentMethod === 'newton') runNewton();
        else if (currentMethod === 'punto_fijo') runPuntoFijo();
        else if (currentMethod === 'muller') runMuller();
        else if (currentMethod === 'horner') runHorner();
        else if (currentMethod === 'bairstow') runBairstow();
        else if (currentMethod === 'newton_multivariable') runNewtonMultivariable();
    } catch (e) {
        alert("Ocurrió un error matemático.");
        console.error(e);
    }
}

// ==========================================
// FUNCIÓN PARA GENERAR EL APARTADO DE ANÁLISIS
// ==========================================
function generateAnalysisSummary(negativeIters, zeroErrorIter, colSpan) {
    let html = `<tr style="background-color: rgba(255, 255, 255, 0.03);"><td colspan="${colSpan}" style="text-align: left; padding: 20px; border-top: 2px solid var(--primary);">`;
    html += `<strong style="color: var(--primary); font-size: 1.1em; text-shadow: 0 0 8px var(--primary-glow);">📊 Apartado de Análisis de Iteración:</strong><br><br>`;

    // Análisis de Negativos
    if (negativeIters.length > 0) {
        html += `🔸 <strong style="color: #fb923c;">Iteración Negativa:</strong> El valor calculado (Raíz/Factor) cruzó hacia el lado negativo en las iteraciones: <strong>${negativeIters.join(', ')}</strong>.<br>`;
    } else {
        html += `🔹 <strong style="color: #94a3b8;">Signo Constante:</strong> La iteración se mantuvo en valores positivos en todo el proceso.<br>`;
    }

    // Análisis de Error Cero
    if (zeroErrorIter !== -1) {
        html += `✅ <strong style="color: #34d399;">Error Cero Logrado:</strong> El error se volvió exactamente <strong>0</strong> en la iteración <strong>${zeroErrorIter}</strong>. ¡Se encontró la solución analítica exacta!<br>`;
    } else {
        html += `📉 <strong style="color: #94a3b8;">Tolerancia Alcanzada:</strong> El método se detuvo por el criterio de tolerancia sin llegar al cero absoluto.<br>`;
    }

    html += `</td></tr>`;
    return html;
}

// ==========================================
// LÓGICA DE MÉTODOS NUMÉRICOS
// ==========================================

function runBolzano() {
    const funcStr = document.getElementById('func').value;
    const a = parseFloat(document.getElementById('a').value);
    const b = parseFloat(document.getElementById('b').value);
    const fa = f(funcStr, a);
    const fb = f(funcStr, b);
    const tbody = document.getElementById('tableBody');

    document.getElementById('tableHead').innerHTML = `<tr><th>Límite a</th><th>Límite b</th><th>f(a)</th><th>f(b)</th><th>f(a)*f(b)</th><th>Conclusión</th></tr>`;

    const product = fa * fb;
    const conclusion = product < 0 ? "Cambio de signo: EXISTE al menos una raíz." : "No hay cambio de signo: NO se garantiza raíz.";
    tbody.innerHTML = `<tr><td>${a}</td><td>${b}</td><td>${fa.toFixed(getDecimals())}</td><td>${fb.toFixed(getDecimals())}</td><td>${product.toFixed(getDecimals())}</td><td style="color: ${product < 0 ? 'green' : 'red'}; font-weight: bold;">${conclusion}</td></tr>`;

    plotFunction(funcStr, a, b, null);
}

function runBisection() {
    const funcStr = document.getElementById('func').value;
    let a = parseFloat(document.getElementById('a').value);
    let b = parseFloat(document.getElementById('b').value);
    const TOL = 1e-10; // Tolerancia interna de convergencia
    const maxIter = 50; // Límite típico de seguridad (la mayoría converge en < 20)

    let fa = f(funcStr, a); let fb = f(funcStr, b);
    if (fa * fb > 0) { alert("Error: f(a) y f(b) deben tener signos opuestos."); return; }

    const tbody = document.getElementById('tableBody');
    document.getElementById('tableHead').innerHTML = `<tr><th>n</th><th>a</th><th>b</th><th>p_n (Raíz)</th><th>f(p_n)</th><th>Error</th></tr>`;
    tbody.innerHTML = '';

    let p, fp, error = 100, p_old = a;
    let negativeIters = [];
    let zeroErrorIter = -1;
    let iterPoints = [];

    for (let i = 1; i <= maxIter; i++) {
        p = a + (b - a) / 2;
        fp = f(funcStr, p);
        if (i > 1) error = Math.abs((p - p_old) / p);

        if (p < 0) negativeIters.push(i);
        if (error === 0 && i > 1) zeroErrorIter = i;

        let pStyle = p < 0 ? 'color: #ea580c; font-weight: bold;' : 'font-weight: bold;';
        iterPoints.push({ x: p, y: fp, label: i });

        tbody.innerHTML += `<tr><td>${i}</td><td>${a.toFixed(getDecimals())}</td><td>${b.toFixed(getDecimals())}</td><td style="${pStyle}">${p.toFixed(getDecimals())}</td><td>${fp.toFixed(getDecimals())}</td><td>${i === 1 ? '-' : error.toFixed(getDecimals())}</td></tr>`;

        if (fp === 0 || (b - a) / 2 < TOL || error === 0) {
            if (fp === 0) zeroErrorIter = i;
            break;
        }

        if (fa * fp > 0) { a = p; fa = fp; } else { b = p; }
        p_old = p;
    }

    tbody.innerHTML += generateAnalysisSummary(negativeIters, zeroErrorIter, 6);
    plotFunction(funcStr, parseFloat(document.getElementById('a').value), parseFloat(document.getElementById('b').value), p, iterPoints);
}

function runReglaFalsa() {
    const funcStr = document.getElementById('func').value;
    let a = parseFloat(document.getElementById('a').value);
    let b = parseFloat(document.getElementById('b').value);
    const TOL = 1e-10;
    const maxIter = 50; // Límite típico de seguridad (la mayoría converge en < 20)

    let fa = f(funcStr, a); let fb = f(funcStr, b);
    if (fa * fb > 0) { alert("Error: f(a) y f(b) deben tener signos opuestos."); return; }

    const tbody = document.getElementById('tableBody');
    document.getElementById('tableHead').innerHTML = `<tr><th>Iteración</th><th>a</th><th>b</th><th>Raíz (p)</th><th>f(p)</th><th>Error</th></tr>`;
    tbody.innerHTML = '';

    let p = a, p_old = a, error = 100;
    let negativeIters = []; let zeroErrorIter = -1;
    let iterPoints = [];

    for (let i = 1; i <= maxIter; i++) {
        p = b - (fb * (b - a)) / (fb - fa);
        let fp = f(funcStr, p);
        if (i > 1) error = Math.abs((p - p_old) / p);

        if (p < 0) negativeIters.push(i);
        if (error === 0 && i > 1) zeroErrorIter = i;

        let pStyle = p < 0 ? 'color: #ea580c; font-weight: bold;' : 'font-weight: bold;';
        iterPoints.push({ x: p, y: fp, label: i });

        tbody.innerHTML += `<tr><td>${i}</td><td>${a.toFixed(getDecimals())}</td><td>${b.toFixed(getDecimals())}</td><td style="${pStyle}">${p.toFixed(getDecimals())}</td><td>${fp.toFixed(getDecimals())}</td><td>${i === 1 ? '-' : error.toFixed(getDecimals())}</td></tr>`;

        if (Math.abs(fp) === 0) zeroErrorIter = i;
        if (Math.abs(fp) < TOL || error < TOL || error === 0) break;

        if (fa * fp < 0) { b = p; fb = fp; } else { a = p; fa = fp; }
        p_old = p;
    }
    tbody.innerHTML += generateAnalysisSummary(negativeIters, zeroErrorIter, 6);
    plotFunction(funcStr, parseFloat(document.getElementById('a').value), parseFloat(document.getElementById('b').value), p);
}

function runSecante() {
    const funcStr = document.getElementById('func').value;
    let p0 = parseFloat(document.getElementById('p0').value);
    let p1 = parseFloat(document.getElementById('p1').value);
    const TOL = 1e-10;
    const maxIter = 50; // Límite típico de seguridad (la mayoría converge en < 20)

    let f0 = f(funcStr, p0); let f1 = f(funcStr, p1);
    const tbody = document.getElementById('tableBody');
    document.getElementById('tableHead').innerHTML = `<tr><th>Iteración</th><th>p_n-1</th><th>p_n</th><th>Raíz (p_n+1)</th><th>f(p_n+1)</th><th>Error</th></tr>`;
    tbody.innerHTML = '';

    let p, error = 100;
    let negativeIters = []; let zeroErrorIter = -1;
    let iterPoints = [];

    for (let i = 1; i <= maxIter; i++) {
        if (f1 - f0 === 0) { alert("Error: División por cero en Secante."); break; }
        p = p1 - (f1 * (p1 - p0)) / (f1 - f0);
        let fp = f(funcStr, p);
        error = Math.abs((p - p1) / p);

        if (p < 0) negativeIters.push(i);
        if (error === 0) zeroErrorIter = i;

        let pStyle = p < 0 ? 'color: #ea580c; font-weight: bold;' : 'font-weight: bold;';
        iterPoints.push({ x: p, y: fp, label: i });

        tbody.innerHTML += `<tr><td>${i}</td><td>${p0.toFixed(getDecimals())}</td><td>${p1.toFixed(getDecimals())}</td><td style="${pStyle}">${p.toFixed(getDecimals())}</td><td>${fp.toFixed(getDecimals())}</td><td>${error.toFixed(getDecimals())}</td></tr>`;

        if (Math.abs(fp) === 0) zeroErrorIter = i;
        if (Math.abs(fp) < TOL || error < TOL || error === 0) break;

        p0 = p1; f0 = f1;
        p1 = p; f1 = fp;
    }
    tbody.innerHTML += generateAnalysisSummary(negativeIters, zeroErrorIter, 6);
    plotFunction(funcStr, p0 - 2, p + 2, p, iterPoints);
}

function runNewton() {
    const funcStr = document.getElementById('func').value;
    let p0 = parseFloat(document.getElementById('p0').value);
    const TOL = 1e-10;
    const maxIter = 50; // Límite típico de seguridad (la mayoría converge en < 20)

    const node = math.parse(funcStr); const code = node.compile();
    let derivCode = null;
    try {
        const derivative = math.derivative(node, 'x');
        derivCode = derivative.compile();
    } catch (e) {
        console.warn("Derivada simbólica falló en Newton, usando numérica.");
    }

    const tbody = document.getElementById('tableBody');
    document.getElementById('tableHead').innerHTML = `<tr><th>Iteración</th><th>p_n-1</th><th>f(p_n-1)</th><th>f'(p_n-1)</th><th>Raíz (p_n)</th><th>Error</th></tr>`;
    tbody.innerHTML = '';

    let p, error = 100;
    let negativeIters = []; let zeroErrorIter = -1;
    let iterPoints = [];

    for (let i = 1; i <= maxIter; i++) {
        let fp0 = code.evaluate({ x: p0 });
        let dfp0;
        if (derivCode) {
            try {
                dfp0 = derivCode.evaluate({ x: p0 });
            } catch (err) {
                const h = 1e-7;
                dfp0 = (code.evaluate({ x: p0 + h }) - code.evaluate({ x: p0 - h })) / (2 * h);
            }
        } else {
            const h = 1e-7;
            dfp0 = (code.evaluate({ x: p0 + h }) - code.evaluate({ x: p0 - h })) / (2 * h);
        }

        if (dfp0 === 0) { alert("Error: La derivada es cero."); break; }
        p = p0 - (fp0 / dfp0);
        error = Math.abs((p - p0) / p);

        if (p < 0) negativeIters.push(i);
        if (error === 0) zeroErrorIter = i;

        let pStyle = p < 0 ? 'color: #ea580c; font-weight: bold;' : 'font-weight: bold;';
        iterPoints.push({ x: p0, y: fp0, label: i });

        tbody.innerHTML += `<tr><td>${i}</td><td>${p0.toFixed(getDecimals())}</td><td>${fp0.toFixed(getDecimals())}</td><td>${dfp0.toFixed(getDecimals())}</td><td style="${pStyle}">${p.toFixed(getDecimals())}</td><td>${error.toFixed(getDecimals())}</td></tr>`;

        let checkZero = Math.abs(code.evaluate({ x: p }));
        if (checkZero === 0) zeroErrorIter = i;
        if (checkZero < TOL || error < TOL || error === 0) break;
        p0 = p;
    }
    iterPoints.push({ x: p, y: 0, label: 'raíz' });
    tbody.innerHTML += generateAnalysisSummary(negativeIters, zeroErrorIter, 6);
    plotFunction(funcStr, p - 4, p + 4, p, iterPoints);
}

function runPuntoFijo() {
    const funcStr = document.getElementById('func').value;
    let p0 = parseFloat(document.getElementById('p0').value);
    const TOL = 1e-10;
    const maxIter = 50; // Límite típico de seguridad (la mayoría converge en < 20)

    // Calcular derivada de g(x)
    let gDerivCode = null;
    let derivStr = "Aproximación numérica";
    try {
        const gNode = math.parse(funcStr);
        const gDerivNode = math.derivative(gNode, 'x');
        gDerivCode = gDerivNode.compile();
        derivStr = gDerivNode.toString();
    } catch (e) {
        console.warn("No se pudo calcular la derivada simbólica. Se usará cálculo numérico.");
    }

    const tbody = document.getElementById('tableBody');
    document.getElementById('tableHead').innerHTML = `<tr><th>Iteración</th><th>p_{n-1}</th><th>g'(p_{n-1})</th><th>p_n = g(p_{n-1})</th><th>Error</th></tr>`;
    tbody.innerHTML = `<tr style="background:rgba(79,70,229,0.07);"><td colspan="5" style="text-align:left;padding:8px 15px;">
        <strong>Derivada de g(x):</strong> g'(x) = ${derivStr}
        &nbsp;&nbsp;<em style="color:#64748b;font-size:0.85em;">(Para converger se requiere |g'(x)| < 1)</em>
    </td></tr>`;

    let p, error = 100;
    let negativeIters = []; let zeroErrorIter = -1;

    for (let i = 1; i <= maxIter; i++) {
        let dgp0;
        if (gDerivCode) {
            try {
                let dval = gDerivCode.evaluate({ x: p0 });
                dgp0 = (typeof dval === 'object' && dval.re !== undefined) ? dval.re : dval;
            } catch (err) {
                const h = 1e-7;
                dgp0 = (f(funcStr, p0 + h) - f(funcStr, p0 - h)) / (2 * h);
            }
        } else {
            const h = 1e-7;
            dgp0 = (f(funcStr, p0 + h) - f(funcStr, p0 - h)) / (2 * h);
        }
        
        let p_raw = f(funcStr, p0);
        let isComplex = false;
        if (typeof p_raw === 'object' && p_raw.im !== undefined) {
            if (Math.abs(p_raw.im) > 1e-10) isComplex = true;
            p = p_raw.re;
        } else {
            p = p_raw;
        }

        error = Math.abs((p - p0) / p);

        if (p < 0) negativeIters.push(i);
        if (error === 0) zeroErrorIter = i;

        let pStyle = p < 0 ? 'color: #ea580c; font-weight: bold;' : 'font-weight: bold;';
        let dgStyle = Math.abs(dgp0) >= 1 ? 'color:#ef4444;font-weight:bold;' : 'color:#10b981;font-weight:bold;';

        let p_display = isNaN(p) ? 'NaN' : p.toFixed(getDecimals());
        let dp_display = isNaN(dgp0) ? 'NaN' : dgp0.toFixed(getDecimals());

        tbody.innerHTML += `<tr>
            <td>${i}</td>
            <td>${p0.toFixed(getDecimals())}</td>
            <td style="${dgStyle}">${dp_display}</td>
            <td style="${pStyle}">${p_display}</td>
            <td>${isNaN(error) ? 'NaN' : error.toFixed(getDecimals())}</td>
        </tr>`;

        if (isComplex) {
            tbody.innerHTML += `<tr><td colspan="5" style="color: red; text-align:center;">El método divergió hacia números complejos.</td></tr>`;
            break;
        }
        if (error < TOL || error === 0) break;
        p0 = p;
        if (!isFinite(p) || i === maxIter) {
            tbody.innerHTML += `<tr><td colspan="5" style="color: red; text-align:center;">El método divergió o alcanzó iteraciones máximas.</td></tr>`;
            break;
        }
    }
    tbody.innerHTML += generateAnalysisSummary(negativeIters, zeroErrorIter, 5);
    
    let plotRoot = (isFinite(p) && !isNaN(p)) ? p : p0;
    plotPuntoFijo(funcStr, plotRoot - 2, plotRoot + 2, plotRoot);
}

function runMuller() {
    const funcStr = document.getElementById('func').value;
    let x0 = math.complex(document.getElementById('x0').value);
    let x1 = math.complex(document.getElementById('x1').value);
    let x2 = math.complex(document.getElementById('x2').value);
    const TOL = 1e-10;
    const maxIter = 50; // Límite típico de seguridad (la mayoría converge en < 20)

    const f_complex = (val) => math.evaluate(funcStr, { x: val });

    const tbody = document.getElementById('tableBody');
    document.getElementById('tableHead').innerHTML = `<tr><th>Iteración</th><th>x_n (Raíz)</th><th>f(x_n)</th><th>Error</th></tr>`;
    tbody.innerHTML = '';

    let h1, h2, d1, d2, a, b, c, D, E, h, p, error = 100;
    let negativeIters = []; let zeroErrorIter = -1;
    let iterPoints = [];

    for (let i = 3; i <= maxIter + 2; i++) {
        h1 = math.subtract(x1, x0); h2 = math.subtract(x2, x1);
        d1 = math.divide(math.subtract(f_complex(x1), f_complex(x0)), h1);
        d2 = math.divide(math.subtract(f_complex(x2), f_complex(x1)), h2);
        a = math.divide(math.subtract(d2, d1), math.add(h2, h1));
        b = math.add(d2, math.multiply(h2, a));
        c = f_complex(x2);

        let b2 = math.pow(b, 2);
        let four_ac = math.multiply(4, math.multiply(a, c));
        D = math.sqrt(math.subtract(b2, four_ac));

        let E1 = math.add(b, D); let E2 = math.subtract(b, D);
        E = (math.abs(E1) > math.abs(E2)) ? E1 : E2;

        h = math.divide(math.multiply(-2, c), E);
        p = math.add(x2, h);
        error = math.abs(h);

        // Evaluamos si la parte real de la raíz compleja se vuelve negativa
        if (p.re < 0) negativeIters.push(i - 2);
        if (error === 0) zeroErrorIter = i - 2;

        let pStyle = p.re < 0 ? 'color: #ea580c; font-weight: bold;' : 'font-weight: bold;';
        let pFormat = p.im === 0 ? p.re.toFixed(getDecimals()) : `${p.re.toFixed(getDecimals())} ${p.im > 0 ? '+' : '-'} ${Math.abs(p.im).toFixed(getDecimals())}i`;
        let fpFormat = f_complex(p).im === 0 ? f_complex(p).re.toFixed(getDecimals()) : `${f_complex(p).re.toFixed(getDecimals())} + ${f_complex(p).im.toFixed(getDecimals())}i`;

        if (p.im === 0) iterPoints.push({ x: p.re, y: f_complex(p).re, label: i - 2 });
        tbody.innerHTML += `<tr><td>${i - 2}</td><td style="${pStyle}">${pFormat}</td><td>${fpFormat}</td><td>${error.toFixed(getDecimals())}</td></tr>`;

        if (error < TOL || error === 0) break;
        x0 = x1; x1 = x2; x2 = p;
    }
    tbody.innerHTML += generateAnalysisSummary(negativeIters, zeroErrorIter, 4);
    plotFunction(funcStr, -3, 3, p.im === 0 ? p.re : null, iterPoints);
}

function runBairstow() {
    const funcStr = document.getElementById('func').value.trim();
    let r = parseFloat(document.getElementById('r0').value);
    let s = parseFloat(document.getElementById('s0').value);
    const TOL = 1e-10;
    const maxIter = 50;

    // --- Extracción robusta de coeficientes desde la ecuación ---
    // Detecta el grado y usa evaluación en puntos para resolver el sistema Vandermonde
    let a = []; // Coeficientes [a0, a1, ..., aN] donde a0 es el de mayor grado
    let degree = 0;
    try {
        const poly = math.parse(funcStr);
        // Detectar grado máximo
        poly.traverse(node => {
            if (node.type === 'OperatorNode' && node.op === '^') {
                if (node.args && node.args[0] && node.args[0].name === 'x') {
                    const exp = node.args[1].value;
                    if (typeof exp === 'number') degree = Math.max(degree, Math.round(exp));
                }
            } else if (node.type === 'SymbolNode' && node.name === 'x') {
                degree = Math.max(degree, 1);
            }
        });

        if (degree < 2) { alert('Bairstow requiere un polinomio de grado ≥ 2.'); return; }

        // Extraer coeficientes: c_k = (d^k P / dx^k)|_{x=0} / k!
        const compiled = poly.compile();
        a = new Array(degree + 1).fill(0);
        for (let k = 0; k <= degree; k++) {
            // Calcular la k-ésima derivada evaluada en x=0
            let node_k = poly;
            for (let d = 0; d < k; d++) node_k = math.derivative(node_k, 'x');
            let factorial = 1;
            for (let d = 1; d <= k; d++) factorial *= d;
            const coef = node_k.compile().evaluate({ x: 0 }) / factorial;
            // Coeficiente de x^k va en posición (degree - k) del array (mayor a menor)
            a[degree - k] = Math.round(coef * 1e10) / 1e10;
        }
    } catch(e) {
        alert('Error al parsear la ecuación: ' + e.message);
        return;
    }

    const N = a.length - 1; // Grado del polinomio
    if (N < 2) { alert('El polinomio debe tener al menos grado 2.'); return; }

    // Representación legible del polinomio
    const coefStr = a.map((c, i) => {
        const exp = N - i;
        if (c === 0) return null;
        const cStr = (c === 1 && exp > 0) ? '' : (c === -1 && exp > 0) ? '-' : `${c}`;
        if (exp === 0) return `${c}`;
        if (exp === 1) return `${cStr}x`;
        return `${cStr}x^${exp}`;
    }).filter(Boolean).join(' + ').replace(/\+ -/g, '- ');

    const tbody = document.getElementById('tableBody');
    document.getElementById('tableHead').innerHTML =
        `<tr><th>Iter</th><th>r_n</th><th>s_n</th><th>&Delta;r</th><th>&Delta;s</th><th>Error&nbsp;r</th><th>Error&nbsp;s</th></tr>`;
    tbody.innerHTML = `<tr style="background:rgba(79,70,229,0.07);">
        <td colspan="7" style="text-align:left;padding:8px 15px;">
            <strong>Polinomio:</strong> f(x) = ${coefStr} &nbsp;&nbsp;
            <strong>Grado:</strong> ${N} &nbsp;&nbsp;
            <strong>Coef:</strong> [${a.join(', ')}]
        </td></tr>`;

    // --- Algoritmo de Bairstow ---
    let b = new Array(N + 1).fill(0);
    let c = new Array(N + 1).fill(0);
    let errorR = Infinity, errorS = Infinity;
    let negativeIters = [], zeroErrorIter = -1;

    for (let iter = 1; iter <= maxIter; iter++) {
        // Calcular b_k = división sintética con factor (x^2 - r*x - s)
        b[0] = a[0];
        b[1] = a[1] + r * b[0];
        for (let k = 2; k <= N; k++) {
            b[k] = a[k] + r * b[k - 1] + s * b[k - 2];
        }

        // Calcular c_k = segunda división sintética
        c[0] = b[0];
        c[1] = b[1] + r * c[0];
        for (let k = 2; k <= N; k++) {
            c[k] = b[k - 1] + r * c[k - 1] + (k <= N - 1 ? s * c[k - 2] : 0);
        }

        // Determinante del sistema (índices N-1 y N-2 son los últimos de c relevantes)
        // Sistema: [ c[N-2]  c[N-3] ] [Δr]   [-b[N-1]]
        //          [ c[N-1]  c[N-2] ] [Δs] = [-b[N]  ]
        const cN2 = c[N - 2]; // c_{n-2}
        const cN3 = N >= 3 ? c[N - 3] : 0; // c_{n-3} (0 si N=2)
        const cN1 = c[N - 1]; // c_{n-1}

        const detD = cN2 * cN2 - cN1 * cN3;
        if (Math.abs(detD) < 1e-14) {
            tbody.innerHTML += `<tr><td colspan="7" style="color:red;text-align:center;">
                ⚠️ Iteración ${iter}: Determinante ≈ 0. Intenta con otros valores iniciales r0, s0.
            </td></tr>`;
            break;
        }

        const deltaR = (-b[N - 1] * cN2 + b[N] * cN3) / detD;
        const deltaS = (-b[N] * cN2 + b[N - 1] * cN1) / detD;

        r += deltaR;
        s += deltaS;

        errorR = r !== 0 ? Math.abs(deltaR / r) : Math.abs(deltaR);
        errorS = s !== 0 ? Math.abs(deltaS / s) : Math.abs(deltaS);

        if (r < 0 || s < 0) negativeIters.push(iter);
        if (errorR === 0 && errorS === 0) zeroErrorIter = iter;

        const rStyle = r < 0 ? 'color:#ea580c;font-weight:bold;' : 'font-weight:bold;';
        const sStyle = s < 0 ? 'color:#ea580c;font-weight:bold;' : 'font-weight:bold;';

        tbody.innerHTML += `<tr>
            <td>${iter}</td>
            <td style="${rStyle}">${r.toFixed(getDecimals())}</td>
            <td style="${sStyle}">${s.toFixed(getDecimals())}</td>
            <td>${deltaR.toFixed(getDecimals())}</td>
            <td>${deltaS.toFixed(getDecimals())}</td>
            <td>${errorR.toFixed(getDecimals())}</td>
            <td>${errorS.toFixed(getDecimals())}</td>
        </tr>`;

        if ((errorR < TOL && errorS < TOL) || (errorR === 0 && errorS === 0)) break;
    }

    // --- Calcular raíces del factor cuadrático: x² - r·x - s = 0 ---
    const disc = r * r + 4 * s;
    let rootsHTML = `<tr style="background:rgba(16,185,129,0.1);">
        <td colspan="7" style="text-align:left;padding:12px 15px;">
        <strong>🎯 Factor cuadrático convergido:</strong> x² - ${r.toFixed(getDecimals())}x - ${s.toFixed(getDecimals())} = 0<br>`;

    let realRoots = [];
    if (disc >= 0) {
        const r1 = (r + Math.sqrt(disc)) / 2;
        const r2 = (r - Math.sqrt(disc)) / 2;
        realRoots = [r1, r2];
        rootsHTML += `x₁ = <strong style="color:var(--primary)">${r1.toFixed(getDecimals())}</strong>
            &nbsp;&nbsp; x₂ = <strong style="color:var(--primary)">${r2.toFixed(getDecimals())}</strong>`;
    } else {
        const re = r / 2;
        const im = Math.sqrt(-disc) / 2;
        rootsHTML += `x₁ = <strong style="color:#7c3aed">${re.toFixed(getDecimals())} + ${im.toFixed(getDecimals())}i</strong>
            &nbsp;&nbsp; x₂ = <strong style="color:#7c3aed">${re.toFixed(getDecimals())} - ${im.toFixed(getDecimals())}i</strong>`;
    }
    rootsHTML += `</td></tr>`;

    tbody.innerHTML += generateAnalysisSummary(negativeIters, zeroErrorIter, 7) + rootsHTML;

    // Graficar el polinomio con la primera raíz real marcada
    plotFunction(funcStr, -6, 6, realRoots.length > 0 ? realRoots[0] : null);
}


function runNewtonMultivariable() {
    const f1_str = document.getElementById('f1').value.trim();
    const f2_str = document.getElementById('f2').value.trim();
    const f3_str = document.getElementById('f3').value.trim();

    let vars = ['x', 'y']; let funcs = [f1_str, f2_str];
    let x0 = parseFloat(document.getElementById('x0').value);
    let y0 = parseFloat(document.getElementById('y0').value);
    let vals = [x0, y0];

    if (f3_str !== '') { vars.push('z'); funcs.push(f3_str); vals.push(parseFloat(document.getElementById('z0').value || 0)); }

    const TOL = 1e-10;
    const maxIter = 50; // Límite típico de seguridad (la mayoría converge en < 20)

    let f_compiled = funcs.map(func => math.compile(func));
    let J_compiled = [];
    let useNumericalJ = false;
    try {
        for (let i = 0; i < funcs.length; i++) {
            let row = [];
            for (let j = 0; j < vars.length; j++) { row.push(math.derivative(funcs[i], vars[j]).compile()); }
            J_compiled.push(row);
        }
    } catch (e) {
        console.warn("Derivada simbólica falló en Newton Multivariable. Se usará Jacobiano numérico.");
        useNumericalJ = true;
    }

    const tbody = document.getElementById('tableBody');
    let headerHTML = `<tr><th>Iter</th>`;
    vars.forEach(v => headerHTML += `<th>${v}_n</th>`);
    headerHTML += `<th>F(X_n)</th>`;
    headerHTML += `<th>Jacobiano J(X_n)</th>`;
    headerHTML += `<th>Error Máximo</th></tr>`;
    document.getElementById('tableHead').innerHTML = headerHTML;
    tbody.innerHTML = '';

    let X = vals, error = 100;
    let negativeIters = []; let zeroErrorIter = -1;
    let iterPoints = [];

    for (let iter = 1; iter <= maxIter; iter++) {
        if (vars.length >= 2) iterPoints.push({ x: X[0], y: X[1] });
        let scope = {};
        vars.forEach((v, idx) => scope[v] = X[idx]);

        let F_val = f_compiled.map(func => func.evaluate(scope));
        let J_val = [];
        for (let i = 0; i < funcs.length; i++) {
            let row = [];
            for (let j = 0; j < vars.length; j++) {
                if (!useNumericalJ) {
                    try {
                        row.push(J_compiled[i][j].evaluate(scope));
                    } catch (err) {
                        const h = 1e-7;
                        let scope_plus = { ...scope }; scope_plus[vars[j]] += h;
                        let scope_minus = { ...scope }; scope_minus[vars[j]] -= h;
                        row.push((f_compiled[i].evaluate(scope_plus) - f_compiled[i].evaluate(scope_minus)) / (2 * h));
                    }
                } else {
                    const h = 1e-7;
                    let scope_plus = { ...scope }; scope_plus[vars[j]] += h;
                    let scope_minus = { ...scope }; scope_minus[vars[j]] -= h;
                    row.push((f_compiled[i].evaluate(scope_plus) - f_compiled[i].evaluate(scope_minus)) / (2 * h));
                }
            }
            J_val.push(row);
        }

        try {
            let J_inv = math.inv(J_val);
            let delta = math.multiply(J_inv, F_val);
            let X_new = math.subtract(X, delta);

            error = 0;
            for (let k = 0; k < vars.length; k++) {
                let e = Math.abs(delta[k] / X_new[k]);
                if (e > error) error = e;
            }

            // Registrar si alguna variable en la iteración fue negativa
            if (X_new.some(val => val < 0)) negativeIters.push(iter);
            if (error === 0) zeroErrorIter = iter;

            let rowHTML = `<td>${iter}</td>`;
            X.forEach(val => {
                let style = val < 0 ? 'color: #fb923c; font-weight: bold;' : '';
                rowHTML += `<td style="${style}">${val.toFixed(getDecimals())}</td>`;
            });

            // Formatear F_val
            let fStr = `[${F_val.map(v => v.toFixed(4)).join(', ')}]`;
            rowHTML += `<td><span style="font-size:0.85em;color:#94a3b8;">${fStr}</span></td>`;

            // Formatear J_val
            let jStr = '[' + J_val.map(r => '[' + r.map(v => v.toFixed(4)).join(', ') + ']').join(',<br>&nbsp;') + ']';
            rowHTML += `<td><div style="font-size:0.8em;color:#e2e8f0;line-height:1.2;font-family:monospace;">${jStr}</div></td>`;

            rowHTML += `<td>${error.toFixed(getDecimals())}</td>`;
            tbody.innerHTML += `<tr>${rowHTML}</tr>`;

            X = X_new;
            if (error < TOL || error === 0) break;

        } catch (err) { alert("La Matriz Jacobiana es singular en este punto."); break; }
    }

    // Colspan = Variables + Iteración + F(X) + J(X) + Error
    tbody.innerHTML += generateAnalysisSummary(negativeIters, zeroErrorIter, vars.length + 4);
    if (vars.length >= 2) {
        plotMultivariablePath(iterPoints, vars, X);
    } else {
        if (myChart) { myChart.destroy(); myChart = null; }
    }
}

function runHorner() {
    const funcStr = document.getElementById('func').value.trim();
    const x0 = parseFloat(document.getElementById('x0').value);

    // --- Extraer coeficientes del polinomio usando math.js ---
    let coeffs = [];
    try {
        const poly = math.parse(funcStr);
        // Detectar el grado máximo buscando la mayor potencia de x
        let degree = 0;
        poly.traverse(node => {
            if (node.type === 'OperatorNode' && node.op === '^') {
                if (node.args[0].name === 'x') degree = Math.max(degree, node.args[1].value);
            } else if (node.type === 'SymbolNode' && node.name === 'x') {
                degree = Math.max(degree, 1);
            }
        });
        // Evaluar cada coeficiente: c_k = P(k)(0) / k!
        // Método alternativo: evaluar en suficientes puntos y extraer con diferencias
        // Mejor método: compilar y evaluar el polinomio en x=0,1,2... y resolver
        // Usamos math.js para obtener los coeficientes directamente
        const compiled = poly.compile();
        for (let k = degree; k >= 0; k--) {
            // coef_k = coeficiente de x^k
            // Usamos el truco: eval en x=0 da el término independiente,
            // luego restamos y dividimos por x para obtener el siguiente
            let c = 0;
            // Calculamos usando la fórmula de diferencias divididas en x=0
            // c_k = (1/k!) * d^k P / dx^k |_{x=0}
            try {
                let node_k = poly;
                for (let d = 0; d < degree - k; d++) {
                    node_k = math.derivative(node_k, 'x');
                }
                // Evaluar la derivada (degree-k)-ésima en x=0 y dividir por (degree-k)!
                // Esto da el coeficiente de x^k en el polinomio original
                // En realidad necesitamos la derivada k-ésima en x=0 / k!
            } catch(e) {}
            // Recalcular correctamente:
            let deriv = poly;
            for (let d = 0; d < k; d++) deriv = math.derivative(deriv, 'x');
            let factorial = 1; for (let d = 1; d <= k; d++) factorial *= d;
            c = deriv.compile().evaluate({ x: 0 }) / factorial;
            coeffs.push(Math.round(c * 1e10) / 1e10); // Limpiar errores de punto flotante
        }
    } catch(e) {
        alert('Error al parsear la ecuación. Usa la sintaxis de math.js (ej: 2*x^4 - 3*x^2 + 3*x - 4)');
        return;
    }

    const N = coeffs.length - 1;
    if (N < 1) { alert('El polinomio debe tener al menos grado 1.'); return; }

    // Mostrar los coeficientes detectados
    const tbody = document.getElementById('tableBody');
    const coefStr = coeffs.map((c, i) => {
        const exp = N - i;
        if (c === 0) return null;
        if (exp === 0) return `${c}`;
        if (exp === 1) return `${c}x`;
        return `${c}x^${exp}`;
    }).filter(Boolean).join(' + ').replace(/\+ -/g, '- ');

    document.getElementById('tableHead').innerHTML = `<tr><th>k</th><th>Coeficiente a_k</th><th>d_k &mdash; P(x) Acumulado</th><th>d_k &mdash; P'(x) Acumulado</th></tr>`;
    tbody.innerHTML = `<tr style="background:rgba(14, 165, 233, 0.1);"><td colspan="4" style="text-align:left;padding:10px 15px;">
        <strong>Polinomio detectado:</strong> f(x) = ${coefStr}<br>
        <strong>Coeficientes (a₀ a a_N):</strong> [${coeffs.join(', ')}] &nbsp;&nbsp; <strong>Grado:</strong> ${N}
    </td></tr>`;

    // --- Algoritmo de Horner ---
    let y = coeffs[0]; let z = coeffs[0];
    tbody.innerHTML += `<tr><td>0</td><td>${coeffs[0]}</td><td>${y.toFixed(getDecimals())}</td><td>${z.toFixed(getDecimals())}</td></tr>`;
    for (let j = 1; j < N; j++) {
        y = x0 * y + coeffs[j];
        z = x0 * z + y;
        tbody.innerHTML += `<tr><td>${j}</td><td>${coeffs[j]}</td><td>${y.toFixed(getDecimals())}</td><td>${z.toFixed(getDecimals())}</td></tr>`;
    }
    y = x0 * y + coeffs[N];
    tbody.innerHTML += `<tr><td>${N}</td><td>${coeffs[N]}</td><td style="font-weight:bold;color:var(--primary);">${y.toFixed(getDecimals())}</td><td>-</td></tr>`;
    tbody.innerHTML += `<tr style="background:rgba(14, 165, 233, 0.15);"><td colspan="4" style="text-align:left;padding:15px;">
        <strong>✅ Resultados Finales:</strong><br>
        P(${x0}) = <strong style="color:var(--primary);font-size:1.1em;text-shadow:0 0 5px var(--primary-glow);">${y.toFixed(getDecimals())}</strong><br>
        P'(${x0}) = <strong style="color:#34d399;font-size:1.1em;text-shadow:0 0 5px rgba(52,211,153,0.5);">${z.toFixed(getDecimals())}</strong>
    </td></tr>`;

    // Graficar el polinomio con la raíz marcada si P(x0)=0
    plotFunction(funcStr, x0 - 4, x0 + 4, Math.abs(y) < 1e-6 ? x0 : null);
}

// ==========================================
// 6. FUNCIONES DE DIBUJO (CHART.JS - ESTILO GEOGEBRA)
// ==========================================

// Factoria de opciones para Chart.js estilo GeoGebra
function getChartOptions(xMin, xMax) {
    const axisColor = (ctx) => ctx.tick && ctx.tick.value === 0 ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.05)';
    const axisWidth = (ctx) => ctx.tick && ctx.tick.value === 0 ? 2 : 1;
    return {
        responsive: true,
        maintainAspectRatio: false,
        parsing: false,
        animation: { duration: 400 },
        layout: { padding: { top: 10, right: 20, bottom: 10, left: 10 } },
        scales: {
            x: {
                type: 'linear',
                min: xMin,
                max: xMax,
                grid: { color: axisColor, lineWidth: axisWidth, drawBorder: false },
                ticks: { color: '#cbd5e1', font: { size: 11, family: 'Inter' }, maxTicksLimit: 12 }
            },
            y: {
                grid: { color: axisColor, lineWidth: axisWidth, drawBorder: false },
                ticks: { color: '#cbd5e1', font: { size: 11, family: 'Inter' }, maxTicksLimit: 10 }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#f8fafc', font: { size: 13, family: 'Inter', weight: '600' }, padding: 15 }
            },
            zoom: {
                zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'xy' },
                pan: { enabled: true, mode: 'xy' }
            }
        }
    };
}

function plotFunction(funcStr, a, b, root, iterPoints = []) {
    const ctx = document.getElementById('mathChart').getContext('2d');
    let margin = Math.abs(b - a) * 0.6;
    if (margin === 0 || isNaN(margin) || margin > 50) margin = 5;
    const xMin = a - margin, xMax = b + margin;
    const step = (xMax - xMin) / 400;

    let pointData = [];
    for (let x = xMin; x <= xMax; x += step) {
        try {
            const y = math.evaluate(funcStr, { x: x });
            if (isFinite(y) && !isNaN(y)) {
                pointData.push({ x: parseFloat(x.toFixed(6)), y: parseFloat(y.toFixed(10)) });
            } else {
                pointData.push({ x: parseFloat(x.toFixed(6)), y: null });
            }
        } catch(e) {
            pointData.push({ x: parseFloat(x.toFixed(6)), y: null });
        }
    }

    if (myChart) myChart.destroy();

    const datasets = [{
        label: `f(x) = ${funcStr}`,
        data: pointData,
        borderColor: '#4f46e5',
        borderWidth: 2.5,
        tension: 0,
        fill: false,
        pointRadius: 0,
        spanGaps: false
    }];

    if (root !== null && !isNaN(root)) {
        let rootY = null;
        try { rootY = math.evaluate(funcStr, { x: root }); } catch(e) {}
        datasets.push({
            label: `Raíz ≈ ${root.toFixed(6)}`,
            data: [{ x: root, y: rootY !== null ? rootY : 0 }],
            backgroundColor: '#ef4444',
            borderColor: '#b91c1c',
            borderWidth: 2,
            pointRadius: 10,
            pointHoverRadius: 13,
            type: 'scatter'
        });
    }

    // Mostrar puntos de iteración en la gráfica
    if (iterPoints && iterPoints.length > 0) {
        // Limitar a máx 30 puntos para no saturar el gráfico
        const pts = iterPoints.length > 30 ? iterPoints.filter((_, i) => i % Math.ceil(iterPoints.length / 30) === 0) : iterPoints;
        datasets.push({
            label: 'Iteraciones',
            data: pts.map(pt => ({ x: pt.x, y: pt.y })),
            backgroundColor: 'rgba(234, 88, 12, 0.7)',
            borderColor: '#ea580c',
            borderWidth: 1.5,
            pointRadius: pts.map((_, i) => i === pts.length - 1 ? 0 : 5),
            pointHoverRadius: 8,
            type: 'scatter',
            datalabels: { display: false }
        });
    }

    myChart = new Chart(ctx, {
        type: 'line',
        data: { datasets: datasets },
        options: getChartOptions(xMin, xMax)
    });
}

function plotPuntoFijo(funcStr, a, b, root) {
    const ctx = document.getElementById('mathChart').getContext('2d');
    let margin = Math.abs(b - a) * 0.6;
    if (margin === 0 || isNaN(margin) || margin > 50) margin = 5;
    const xMin = a - margin, xMax = b + margin;
    const step = (xMax - xMin) / 400;

    let gData = [], idData = [];
    for (let x = xMin; x <= xMax; x += step) {
        const xp = parseFloat(x.toFixed(6));
        try {
            const y = math.evaluate(funcStr, { x: x });
            gData.push({ x: xp, y: isFinite(y) && !isNaN(y) ? parseFloat(y.toFixed(10)) : null });
        } catch(e) { gData.push({ x: xp, y: null }); }
        idData.push({ x: xp, y: xp });
    }
    if (myChart) myChart.destroy();

    let datasets = [
        { label: `g(x) = ${funcStr}`, data: gData, borderColor: '#4f46e5', borderWidth: 2.5, tension: 0, fill: false, pointRadius: 0, spanGaps: false },
        { label: 'y = x', data: idData, borderColor: '#10b981', borderWidth: 2, borderDash: [5,5], fill: false, pointRadius: 0 }
    ];

    if (root !== null && !isNaN(root) && isFinite(root)) {
        datasets.push({ label: `Punto Fijo ≈ ${root.toFixed(6)}`, data: [{ x: root, y: root }], backgroundColor: '#ef4444', borderColor: '#b91c1c', borderWidth: 2, pointRadius: 9, pointHoverRadius: 12, type: 'scatter' });
    }

    myChart = new Chart(ctx, {
        type: 'line',
        data: { datasets: datasets },
        options: getChartOptions(xMin, xMax)
    });
}

function plotMultivariablePath(iterPoints, vars, root) {
    const ctx = document.getElementById('mathChart').getContext('2d');
    if (myChart) myChart.destroy();

    if (iterPoints.length === 0) return;

    let xVals = iterPoints.map(p => p.x);
    let yVals = iterPoints.map(p => p.y);
    if (root && root.length >= 2) {
        xVals.push(root[0]);
        yVals.push(root[1]);
    }

    let xMin = Math.min(...xVals), xMax = Math.max(...xVals);
    let yMin = Math.min(...yVals), yMax = Math.max(...yVals);

    let xMargin = Math.abs(xMax - xMin) * 0.2 || 2;
    let yMargin = Math.abs(yMax - yMin) * 0.2 || 2;

    xMin -= xMargin; xMax += xMargin;
    yMin -= yMargin; yMax += yMargin;

    let datasets = [
        {
            label: `Ruta de Iteración (${vars[0]} vs ${vars[1]})`,
            data: iterPoints,
            borderColor: '#ea580c',
            backgroundColor: 'rgba(234, 88, 12, 0.5)',
            borderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
            type: 'line',
            tension: 0,
            fill: false,
            showLine: true
        }
    ];

    if (root && root.length >= 2) {
        datasets.push({
            label: `Punto de Cruce ≈ (${root[0].toFixed(4)}, ${root[1].toFixed(4)})`,
            data: [{ x: root[0], y: root[1] }],
            backgroundColor: '#10b981',
            borderColor: '#059669',
            borderWidth: 2,
            pointRadius: 10,
            type: 'scatter'
        });
    }

    let options = getChartOptions(xMin, xMax);
    options.scales.y.min = yMin;
    options.scales.y.max = yMax;
    options.plugins.legend.labels.font.size = 12;

    myChart = new Chart(ctx, {
        type: 'scatter',
        data: { datasets: datasets },
        options: options
    });
}

// ==========================================
// ARRANQUE DINÁMICO
// ==========================================
window.onload = function () {
    document.getElementById('method-title').innerText = 'Dashboard de Métodos Numéricos';
    document.getElementById('inputs-container').innerHTML = `
        <div class="fade-in" style="text-align:center; padding: 50px 40px; width: 100%;">
            <div style="font-size:3em; margin-bottom:15px;">&#x1F9EE;</div>
            <h2 style="color: var(--primary); margin-bottom:12px; font-size:1.6em;">Bienvenido a itera.dev</h2>
            <p style="font-size:1.05em; color:#64748b; max-width:500px; margin:0 auto 20px;">
                Selecciona un método en el menú lateral para comenzar a calcular.
                Los resultados y la gráfica aparecerán aquí automáticamente.
            </p>
            <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin-top:10px;">
                <span style="background:rgba(79,70,229,0.1);color:var(--primary);padding:6px 14px;border-radius:20px;font-size:0.9em;font-weight:600;">&#x1F4CA; Gráficas GeoGebra</span>
                <span style="background:rgba(16,185,129,0.1);color:#059669;padding:6px 14px;border-radius:20px;font-size:0.9em;font-weight:600;">&#x26A1; Convergencia Automática</span>
                <span style="background:rgba(239,68,68,0.1);color:#dc2626;padding:6px 14px;border-radius:20px;font-size:0.9em;font-weight:600;">&#x1F4E5; Exportar a Excel</span>
            </div>
        </div>
    `;
};