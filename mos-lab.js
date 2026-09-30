/* Interactive, qualitative nMOS visualization using the tested teaching model. */
(() => {
  'use strict';
  const root = document.getElementById('mos-lab');
  if (!root || !window.MOSModel) return;
  const svgNS = 'http://www.w3.org/2000/svg';
  const $ = id => document.getElementById(id);
  const controls = { vgs: $('lab-vgs'), vds: $('lab-vds'), vsb: $('lab-vsb') };
  const layers = {
    ions: $('lab-ions'), holes: $('lab-holes'), electrons: $('lab-electrons'),
    flow: $('lab-flow'), gate: $('lab-gate-charges'),
  };
  const nodes = { ions: [], holes: [], electrons: [], flow: [], gate: [] };
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let model = window.MOSModel.calculate({ vgs: 0, vds: 0, vsb: 0 });
  let sweep = null;
  let phase = 0;
  let lastFrame = 0;
  let animationFrame = 0;
  let labVisible = false;

  function el(tag, attrs, parent) {
    const node = document.createElementNS(svgNS, tag);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    parent.append(node);
    return node;
  }

  function buildParticles() {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 8; col++) {
        const x = 183 + col * 46 + (row % 2) * 11;
        const y = 191 + row * 25;
        nodes.ions.push({ x, y, circle: el('circle', { cx: x, cy: y, r: 5, class: 'ion-dot' }, layers.ions) });
        nodes.holes.push({ x, y: 209 + row * 28, circle: el('circle', { cx: x, cy: 209 + row * 28, r: 6, class: 'hole-dot' }, layers.holes) });
      }
    }
    for (let i = 0; i < 28; i++) {
      nodes.electrons.push(el('circle', { cx: 170 + i * 13.4, cy: 174 + (i % 2) * 5, r: 4.7, class: 'electron-dot' }, layers.electrons));
    }
    for (let i = 0; i < 7; i++) {
      nodes.flow.push(el('circle', { cx: 170, cy: 172 + (i % 2) * 6, r: 5.1, class: 'flow-dot' }, layers.flow));
    }
    const positions = [188, 218, 248, 278, 308, 392, 422, 452, 482, 512];
    for (const x of positions) {
      const text = el('text', { x, y: 101, class: 'gate-charge' }, layers.gate);
      nodes.gate.push(text);
    }
  }

  const fmt = value => `${value < 0 ? '−' : ''}${Math.abs(value).toFixed(2)} V`;

  function updatePicture(m) {
    const depth = Math.round(130 * m.depletionFraction);
    const depletion = $('lab-depletion');
    depletion.setAttribute('height', Math.max(2, depth));
    depletion.setAttribute('opacity', m.surface === 'accumulation' ? '0' : m.surface === 'flatband' ? '.25' : '.82');
    for (const item of nodes.ions) {
      item.circle.style.opacity = depth > 0 && item.y < 165 + depth ? '.82' : '0';
    }
    for (let i = 0; i < nodes.holes.length; i++) {
      const item = nodes.holes[i];
      const circle = item.circle;
      const accumulation = m.surface === 'accumulation';
      const targetY = accumulation && i < 22 ? 179 + (i % 3) * 11
        : m.surface === 'depletion' || m.surface === 'inversion' ? Math.max(item.y, 180 + depth + (i % 3) * 7)
        : item.y;
      circle.setAttribute('cy', Math.min(352, targetY));
      circle.style.opacity = accumulation ? '.95' : m.surface === 'flatband' ? '.75' : '.72';
    }
    const channel = $('lab-channel');
    if (m.hasChannel) {
      const gap = m.pinchOff ? Math.min(55, 14 + 15 * (m.vds - m.vov)) : 0;
      const end = 542 - gap;
      const hs = 5 + 12 * Math.min(1, m.qSource / 2.1);
      const hd = m.pinchOff ? 1.5 : 5 + 12 * Math.min(1, m.qDrain / 2.1);
      channel.setAttribute('d', `M158 166 L${end} 166 L${end} ${166 + hd} Q350 ${168 + (hs + hd) / 2} 158 ${166 + hs} Z`);
      channel.style.opacity = '.91';
      $('lab-pinch-label').style.opacity = m.pinchOff ? '1' : '0';
      $('lab-pinch-label').setAttribute('x', Math.max(400, end - 110));
    } else {
      channel.style.opacity = '0';
      $('lab-pinch-label').style.opacity = '0';
    }
    for (let i = 0; i < nodes.electrons.length; i++) {
      const xFraction = i / (nodes.electrons.length - 1);
      const q = m.pinchOff ? m.qSource * (1 - xFraction) : Math.max(0, m.qSource - m.vds * xFraction);
      const dot = nodes.electrons[i];
      dot.style.opacity = m.hasChannel && q > 0.08 && (i % 3 !== 0 || q > 0.45) ? '.95' : '0';
      if (m.pinchOff) dot.setAttribute('cx', 170 + xFraction * (355 - Math.min(40, 12 * (m.vds - m.vov))));
      else dot.setAttribute('cx', 170 + xFraction * 364);
    }
    const sign = m.vgb > 0.12 ? '+' : m.vgb < -0.12 ? '−' : '';
    const count = Math.min(nodes.gate.length, Math.round(Math.abs(m.vgb) * 3.2));
    for (let i = 0; i < nodes.gate.length; i++) {
      nodes.gate[i].textContent = i < count ? sign : '';
    }
    $('lab-gate').setAttribute('fill', sign === '+' ? '#276f8f' : sign === '−' ? '#9d5364' : '#496f83');
  }

  function explanation(m) {
    if (m.surface === 'accumulation') return '累積：閘體電壓為負，p 型本體的電洞被吸到氧化層下方；沒有連接源汲的電子通道。圖中的電洞可移動，固定受體離子仍留在晶格位置。';
    if (m.surface === 'flatband') return '接近平帶：在這個 VFB=0 的簡化模型中，表面沒有顯著累積、空乏或強反轉。真實元件的平帶電壓未必是 0 V。';
    if (!m.hasChannel) return '空乏：正的閘體電場把電洞推離表面，露出不能移動的受體離子。VGS 尚未高於此體偏壓下的 VT，所以沒有強反轉電子通道。';
    if (m.vds < 0.01) return '強反轉：表面已有電子通道，但 VDS≈0，沒有明顯橫向驅動，因此理想模型的汲極直流電流約為零。';
    if (m.pinchOff) return '飽和／汲端夾止：VDS 已達或超過 VOV，汲端局部閘通道電壓降到臨界附近。電子仍穿過高電場夾止區到汲極；「夾止」不等於電流中斷。';
    return '三極區：VGS 高於 VT，電子反轉層連接源汲。VDS 增加時，靠汲端的局部有效過驅較小，所以通道在汲端較細；電子由 S 往 D 移動。';
  }

  function render() {
    model = window.MOSModel.calculate({
      vgs: controls.vgs.value, vds: controls.vds.value, vsb: controls.vsb.value,
    });
    $('lab-vgs-value').textContent = fmt(model.vgs);
    $('lab-vds-value').textContent = fmt(model.vds);
    $('lab-vsb-value').textContent = fmt(model.vsb);
    $('lab-vt').textContent = fmt(model.vt);
    $('lab-vov').textContent = fmt(model.vov);
    $('lab-vgb').textContent = fmt(model.vgb);
    $('lab-vgd').textContent = fmt(model.vgd);
    const states = { accumulation: '電洞累積', flatband: '接近平帶', depletion: '表面空乏', inversion: '電子強反轉' };
    const regions = { cutoff: '無強反轉通道', triode: '三極區 · 通道連續', saturation: '飽和區 · 汲端夾止' };
    $('lab-state').textContent = states[model.surface];
    $('lab-region').textContent = regions[model.region];
    $('lab-explanation').textContent = explanation(model);
    updatePicture(model);
    syncAnimation();
  }

  function stopSweep() {
    if (sweep !== null) clearInterval(sweep);
    sweep = null;
    $('lab-play').textContent = '▶ 自動掃描 VGS';
  }

  for (const control of Object.values(controls)) control.addEventListener('input', () => { stopSweep(); render(); });
  const presets = {
    accumulation: [-0.8, 0, 0], depletion: [0.45, 0, 0],
    inversion: [1.65, 0.4, 0], pinchoff: [1.55, 1.5, 0], body: [0.82, 0.3, 1.2],
  };
  root.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click', () => {
    stopSweep();
    const [vgs, vds, vsb] = presets[button.dataset.preset];
    controls.vgs.value = vgs; controls.vds.value = vds; controls.vsb.value = vsb;
    render();
  }));
  $('lab-reset').addEventListener('click', () => {
    stopSweep(); controls.vgs.value = 0; controls.vds.value = 0; controls.vsb.value = 0; render();
  });
  $('lab-zoom').addEventListener('click', event => {
    const zoomed = root.querySelector('.lab-svg-wrap').classList.toggle('zoomed');
    event.currentTarget.setAttribute('aria-pressed', String(zoomed));
    event.currentTarget.textContent = zoomed ? '－ 縮小剖面' : '＋ 放大剖面';
  });
  $('lab-play').addEventListener('click', () => {
    if (sweep !== null) { stopSweep(); return; }
    controls.vgs.value = -1; controls.vds.value = 0.7; controls.vsb.value = 0;
    $('lab-play').textContent = '■ 暫停掃描'; render();
    sweep = setInterval(() => {
      const next = Number(controls.vgs.value) + 0.05;
      controls.vgs.value = Math.min(3, next).toFixed(2);
      render();
      if (next >= 3) stopSweep();
    }, reducedMotion ? 180 : 85);
  });

  function animate(time) {
    animationFrame = 0;
    if (!shouldAnimate()) return;
    const dt = Math.min(60, time - (lastFrame || time));
    lastFrame = time;
    phase = (phase + dt * (0.00011 + 0.00017 * model.vds)) % 1;
    for (let i = 0; i < nodes.flow.length; i++) {
      const fraction = (phase + i / nodes.flow.length) % 1;
      nodes.flow[i].setAttribute('cx', (163 + 380 * fraction).toFixed(1));
    }
    animationFrame = requestAnimationFrame(animate);
  }

  function shouldAnimate() {
    return labVisible && !reducedMotion && !document.hidden && model.hasChannel && model.vds > 0.05;
  }

  function syncAnimation() {
    const active = shouldAnimate();
    layers.flow.style.opacity = active ? '1' : '0';
    if (active && !animationFrame) {
      lastFrame = 0;
      animationFrame = requestAnimationFrame(animate);
    } else if (!active && animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
  }

  buildParticles();
  render();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      labVisible = entries.some(entry => entry.isIntersecting);
      syncAnimation();
    }, { rootMargin: '160px' }).observe(root);
  } else {
    labVisible = true;
    syncAnimation();
  }
  document.addEventListener('visibilitychange', syncAnimation);
})();
