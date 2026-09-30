const bar=document.getElementById('progress');
const updateProgress=()=>{const h=document.documentElement;const max=h.scrollHeight-h.clientHeight;bar.style.width=`${max>0?Math.min(100,Math.round(h.scrollTop/max*100)):100}%`};
document.addEventListener('scroll',updateProgress,{passive:true});updateProgress();
document.getElementById('print')?.addEventListener('click',()=>window.print());
if (window.katex) {
  document.querySelectorAll('[data-tex]').forEach(node => {
    try {
      window.katex.render(node.dataset.tex, node, {
        displayMode: node.classList.contains('math-display'),
        throwOnError: true,
        output: 'htmlAndMathml',
        trust: false,
      });
    } catch (error) {
      console.warn('KaTeX equation kept as text fallback:', error.message);
    }
  });
}
if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost')) window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
