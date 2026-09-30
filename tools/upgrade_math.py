"""Wrap the 21 source equations for self-hosted KaTeX rendering.

The original HTML stays inside each element as a no-JavaScript fallback.
"""
from html import escape
from pathlib import Path
import re


PATH = Path(__file__).resolve().parents[1] / "index.html"
TEX = [
    r"\begin{aligned}C_{\mathrm{ox}}&=\frac{\varepsilon_{\mathrm{ox}}}{t_{\mathrm{ox}}}\;[\mathrm{F/m^2}]\\C_{\mathrm{gate,ideal}}&\approx C_{\mathrm{ox}}WL\end{aligned}",
    r"\frac{1}{C_{\mathrm{total}}}\approx\frac{1}{C_{\mathrm{oxide,total}}}+\frac{1}{C_{\mathrm{depletion}}}",
    r"\begin{aligned}V_{\mathrm{GS}}&=V_{\mathrm G}-V_{\mathrm S}\\V_{\mathrm{DS}}&=V_{\mathrm D}-V_{\mathrm S}\\V_{\mathrm{GD}}&=V_{\mathrm G}-V_{\mathrm D}=V_{\mathrm{GS}}-V_{\mathrm{DS}}\end{aligned}",
    r"|Q'_i(x)|\approx C_{\mathrm{ox}}[V_{\mathrm{GS}}-V_T-V(x)]=C_{\mathrm{ox}}[V_{\mathrm{OV}}-V(x)]\;[\mathrm{C/m^2}]",
    r"I_D=\mu_n C_{\mathrm{ox}}W[V_{\mathrm{OV}}-V(x)]\frac{dV}{dx}",
    r"I_D L=\mu_n C_{\mathrm{ox}}W\int_0^{V_{\mathrm{DS}}}(V_{\mathrm{OV}}-V)\,dV",
    r"I_D=\mu_n C_{\mathrm{ox}}\frac WL\left(V_{\mathrm{OV}}V_{\mathrm{DS}}-\frac{V_{\mathrm{DS}}^2}{2}\right)",
    r"I_D\approx\frac{\beta_n}{2}V_{\mathrm{OV}}^2(1+\lambda V_{\mathrm{DS}}),\qquad \lambda\ge0",
    r"r_o=\frac{1}{g_{\mathrm{ds}}}\approx\frac{1}{\lambda I_{\mathrm{DQ}}}",
    r"\begin{aligned}V_T(V_{\mathrm{SB}})&=V_{T0}+\gamma\bigl[\\&\sqrt{2\phi_F+V_{\mathrm{SB}}}-\sqrt{2\phi_F}\bigr]\end{aligned}",
    r"g_{\mathrm{mb}}=g_m\frac{\gamma}{2\sqrt{2\phi_F+V_{\mathrm{SB}}}}\quad\text{(量值)}",
    r"\begin{aligned}V_G&\approx V_{\mathrm{DD}}\frac{R_2}{R_1+R_2}\\V_{\mathrm{GS}}&=V_G\\V_{\mathrm{DS}}&=V_{\mathrm{DD}}-I_D R_D\end{aligned}",
    r"\begin{aligned}i_{D,\mathrm{total}}&=K_n(V_{\mathrm{OV,Q}}+v_{\mathrm{gs}})^2\\&=I_{\mathrm{DQ}}+2K_nV_{\mathrm{OV,Q}}v_{\mathrm{gs}}+K_nv_{\mathrm{gs}}^2\end{aligned}",
    r"\begin{aligned}g_m&=\left.\frac{\partial I_D}{\partial V_{\mathrm{GS}}}\right|_Q=2K_nV_{\mathrm{OV,Q}}\\&=\beta_nV_{\mathrm{OV,Q}}=\frac{2I_{\mathrm{DQ}}}{V_{\mathrm{OV,Q}}}\end{aligned}",
    r"i_d\approx g_mv_{\mathrm{gs}}+g_{\mathrm{mb}}v_{\mathrm{bs}}+\frac{v_{\mathrm{ds}}}{r_o}",
    r"v_o=-i_dR_D\approx-g_mv_{\mathrm{in}}R_D\quad\Longrightarrow\quad A_v\approx-g_mR_D",
    r"A_v\approx-\frac{g_mR_D}{1+g_mR_S}",
    r"A_{v,\mathrm{CD}}\approx\frac{g_mR}{1+g_mR}",
    r"\frac{I_{\mathrm{OUT}}}{I_{\mathrm{REF}}}\approx\frac{(W/L)_{\mathrm{OUT}}}{(W/L)_{\mathrm{REF}}}",
    r"A_v\approx-g_{m,n}(r_{o,n}\parallel r_{o,p}\parallel R_L)",
    r"R\approx\frac{V_{\mathrm{DD}}-V_{\mathrm{F,LED}}-V_{\mathrm{DS,on}}}{I_{\mathrm{LED,target}}}",
]


def main() -> None:
    source = PATH.read_text(encoding="utf-8-sig")
    pattern = re.compile(r'<div class="eq">(.*?)</div>', re.DOTALL)
    matches = list(pattern.finditer(source))
    if not matches and source.count('class="eq math-display"') == len(TEX):
        pattern_existing = re.compile(r'(<div class="eq math-display" data-tex=")(.*?)(">)', re.DOTALL)
        iterator = iter(TEX)
        updated = pattern_existing.sub(lambda m: m.group(1) + escape(next(iterator), quote=True) + m.group(3), source)
        PATH.write_text(updated, encoding="utf-8")
        print(f"Refreshed {len(TEX)} KaTeX expressions")
        return
    if len(matches) != len(TEX):
        raise RuntimeError(f"Expected {len(TEX)} original equations, found {len(matches)}")
    iterator = iter(TEX)

    def upgrade(match: re.Match[str]) -> str:
        tex = next(iterator)
        return f'<div class="eq math-display" data-tex="{escape(tex, quote=True)}">{match.group(1)}</div>'

    PATH.write_text(pattern.sub(upgrade, source), encoding="utf-8")
    print(f"Upgraded {len(TEX)} display equations")


if __name__ == "__main__":
    main()
