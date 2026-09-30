const assert = require('node:assert/strict');
const { calculate } = require('../mos-model.js');

const accumulation = calculate({ vgs: -0.8, vds: 0, vsb: 0 });
assert.equal(accumulation.surface, 'accumulation');
assert.equal(accumulation.hasChannel, false);
assert.equal(accumulation.depletionFraction, 0);

const depletion = calculate({ vgs: 0.45, vds: 0, vsb: 0 });
assert.equal(depletion.surface, 'depletion');
assert.equal(depletion.region, 'cutoff');
assert(depletion.depletionFraction > 0);

const triode = calculate({ vgs: 1.55, vds: 0.3, vsb: 0 });
assert.equal(triode.region, 'triode');
assert(triode.qDrain < triode.qSource);
assert(triode.normalizedCurrent > 0);

const saturated = calculate({ vgs: 1.55, vds: 1.5, vsb: 0 });
assert.equal(saturated.region, 'saturation');
assert.equal(saturated.qDrain, 0);
assert(saturated.normalizedCurrent > 0); // pinch-off does not stop current

const withoutBodyBias = calculate({ vgs: 0.82, vds: 0.3, vsb: 0 });
const withBodyBias = calculate({ vgs: 0.82, vds: 0.3, vsb: 1.2 });
assert(withBodyBias.vt > withoutBodyBias.vt);
assert.equal(withoutBodyBias.hasChannel, true);
assert.equal(withBodyBias.hasChannel, false);
assert(withBodyBias.depletionFraction > depletion.depletionFraction);

console.log('PASS MOS teaching model: accumulation, depletion, inversion, pinch-off, body effect');
