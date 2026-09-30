"""Generate the four source-backed circuit SVGs with Schemdraw 0.23 (MIT)."""
from pathlib import Path

import schemdraw
import schemdraw.elements as el


OUT = Path(__file__).resolve().parents[1] / "assets" / "diagrams"
OUT.mkdir(parents=True, exist_ok=True)


def drawing() -> schemdraw.Drawing:
    d = schemdraw.Drawing(show=False)
    d.config(color="#153d50", lw=2.2, fontsize=14, font="DejaVu Sans")
    return d


def line(d, start, end, label=None):
    part = el.Line().at(start).to(end)
    if label:
        part.label(label)
    d.add(part)


def ground(d, at):
    d.add(el.Ground().at(at))


def cmos_inverter():
    with drawing() as d:
        p = d.add(el.PFet().reverse().at((4, 5)).label("pMOS", loc="right"))
        n = d.add(el.NFet().reverse().at((4, 2.8)).label("nMOS", loc="right"))
        line(d, (4, 5), (4, 5.7))
        d.add(el.Label().at((4, 5.9)).label("VDD"))
        line(d, p.drain, n.drain)
        line(d, (4, 3.15), (6.3, 3.15))
        d.add(el.Dot().at((4, 3.15)))
        d.add(el.Label().at((6.7, 3.15)).label("Vout"))
        line(d, n.source, (4, 0.7))
        ground(d, (4, 0.7))
        line(d, (1.5, p.gate.y), p.gate)
        line(d, (1.5, n.gate.y), n.gate)
        line(d, (1.5, n.gate.y), (1.5, p.gate.y))
        line(d, (0.7, 3.15), (1.5, 3.15))
        d.add(el.Dot().at((1.5, 3.15)))
        d.add(el.Label().at((0.15, 3.15)).label("Vin"))
        d.save(OUT / "cmos-inverter.svg")


def divider_bias():
    with drawing() as d:
        n = d.add(el.NFet().reverse().at((6, 4.5)).label("nMOS", loc="right"))
        d.add(el.Resistor().at((2, 6.7)).to((2, 5.3)))
        d.add(el.Resistor().at((2, 3.5)).to((2, 2.1)))
        d.add(el.Resistor().at((6, 6.7)).to(n.drain))
        d.add(el.Label().at((2.9, 6)).label("R1"))
        d.add(el.Label().at((2.9, 2.8)).label("R2"))
        d.add(el.Label().at((6.9, 6)).label("RD"))
        line(d, (2, 7.2), (6, 7.2))
        line(d, (2, 7.2), (2, 6.7))
        line(d, (6, 7.2), (6, 6.7))
        d.add(el.Label().at((4, 7.55)).label("VDD"))
        line(d, (2, 5.3), (2, 4.5))
        line(d, (2, 4.5), (2, 3.5))
        line(d, (2, 4.5), (n.gate.x, 4.5))
        line(d, (n.gate.x, 4.5), n.gate)
        d.add(el.Dot().at((2, 4.5)))
        line(d, (2, 2.1), (2, 1.3))
        ground(d, (2, 1.3))
        line(d, n.source, (6, 1.3))
        ground(d, (6, 1.3))
        d.save(OUT / "divider-bias.svg")


def current_mirror():
    with drawing() as d:
        m1 = d.add(el.NFet().reverse().at((2, 4)).label("M1", loc="right"))
        m2 = d.add(el.NFet().reverse().at((7, 4)).label("M2", loc="right"))
        line(d, (2, 4), (2, 5.5))
        line(d, (2, 5.5), (0.3, 5.5))
        line(d, (0.3, 5.5), (0.3, m1.gate.y))
        line(d, (0.3, m1.gate.y), m1.gate)
        line(d, (0.3, 5.5), (m2.gate.x, 5.5))
        line(d, (m2.gate.x, 5.5), m2.gate)
        d.add(el.Dot().at((2, 5.5)))
        line(d, (2, 5.5), (2, 6.5))
        d.add(el.Label().at((2, 6.8)).label("Iref ↓"))
        line(d, m2.drain, (7, 6.5))
        d.add(el.Label().at((7, 6.8)).label("Iout ↓"))
        line(d, m1.source, (2, 1.6))
        line(d, m2.source, (7, 1.6))
        line(d, (2, 1.6), (7, 1.6))
        ground(d, (4.5, 1.6))
        d.save(OUT / "current-mirror.svg")


def led_switch():
    with drawing() as d:
        n = d.add(el.NFet().reverse().at((5, 3.5)).label("nMOS", loc="right"))
        d.add(el.Resistor().at((5, 7)).to((5, 5.8)))
        d.add(el.LED().at((5, 5.6)).to((5, 4.3)))
        d.add(el.Label().at((6.2, 6.4)).label("R"))
        d.add(el.Label().at((6.3, 5.0)).label("LED"))
        line(d, (5, 7), (5, 7.5))
        d.add(el.Label().at((5, 7.8)).label("VDD"))
        line(d, (5, 5.8), (5, 5.6))
        line(d, (5, 4.3), n.drain)
        line(d, n.source, (5, 1.2))
        ground(d, (5, 1.2))
        line(d, (1.5, n.gate.y), n.gate)
        d.add(el.Label().at((0.7, n.gate.y)).label("control"))
        d.save(OUT / "led-switch.svg")


if __name__ == "__main__":
    cmos_inverter()
    divider_bias()
    current_mirror()
    led_switch()
    print("Generated 4 Schemdraw SVGs in", OUT)
