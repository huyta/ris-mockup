import urllib.parse


def create_medical_scan_svg(scan_type: str, slice_index: int = 1, total_slices: int = 24) -> str:
    contrast_shift = (slice_index % 5) * 4

    if scan_type == 'chest-xray':
        svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" style="background:#05070a">
      <defs>
        <radialGradient id="lungL" cx="38%" cy="45%" r="30%">
          <stop offset="0%" stop-color="#111827"/>
          <stop offset="60%" stop-color="#1f2937"/>
          <stop offset="100%" stop-color="#374151"/>
        </radialGradient>
        <radialGradient id="lungR" cx="62%" cy="45%" r="30%">
          <stop offset="0%" stop-color="#111827"/>
          <stop offset="60%" stop-color="#1f2937"/>
          <stop offset="100%" stop-color="#374151"/>
        </radialGradient>
      </defs>
      <rect x="246" y="80" width="20" height="340" fill="#94a3b8" opacity="0.85" rx="3"/>
      <path d="M 230 220 Q 210 320 280 340 Q 320 330 270 240 Z" fill="#cbd5e1" opacity="0.8"/>
      <path d="M 240 130 Q 150 145 130 180" stroke="#94a3b8" stroke-width="8" fill="none" opacity="0.6"/>
      <path d="M 240 170 Q 140 190 120 230" stroke="#94a3b8" stroke-width="8" fill="none" opacity="0.6"/>
      <path d="M 240 210 Q 130 235 115 280" stroke="#94a3b8" stroke-width="8" fill="none" opacity="0.6"/>
      <path d="M 240 250 Q 130 280 120 330" stroke="#94a3b8" stroke-width="8" fill="none" opacity="0.6"/>
      <path d="M 272 130 Q 362 145 382 180" stroke="#94a3b8" stroke-width="8" fill="none" opacity="0.6"/>
      <path d="M 272 170 Q 372 190 392 230" stroke="#94a3b8" stroke-width="8" fill="none" opacity="0.6"/>
      <path d="M 272 210 Q 382 235 397 280" stroke="#94a3b8" stroke-width="8" fill="none" opacity="0.6"/>
      <path d="M 272 250 Q 382 280 392 330" stroke="#94a3b8" stroke-width="8" fill="none" opacity="0.6"/>
      <path d="M 240 110 Q 170 95 100 120" stroke="#e2e8f0" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.75"/>
      <path d="M 272 110 Q 342 95 412 120" stroke="#e2e8f0" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.75"/>
      <path d="M 230 140 C 180 140 135 180 130 280 C 128 320 160 360 210 355 C 230 353 235 280 230 140 Z" fill="url(#lungL)" opacity="0.65"/>
      <path d="M 282 140 C 332 140 377 180 382 280 C 384 320 352 360 302 355 C 282 353 277 280 282 140 Z" fill="url(#lungR)" opacity="0.65"/>
      <path d="M 100 370 Q 180 330 250 370" stroke="#cbd5e1" stroke-width="10" fill="none" opacity="0.7"/>
      <path d="M 262 370 Q 332 340 412 375" stroke="#cbd5e1" stroke-width="10" fill="none" opacity="0.7"/>
      <text x="20" y="35" fill="#0284c7" font-family="monospace" font-size="12" font-weight="bold">CHEST PA ERECT</text>
      <text x="20" y="55" fill="#94a3b8" font-family="monospace" font-size="11">FOV: 350mm | KV: 120</text>
      <text x="440" y="35" fill="#f59e0b" font-family="monospace" font-size="16" font-weight="bold">R</text>
      <text x="20" y="490" fill="#64748b" font-family="monospace" font-size="11">SMG RIS PACS DEMO</text>
      <text x="410" y="490" fill="#64748b" font-family="monospace" font-size="11">W: 1500 L: -500</text>
    </svg>"""
        return f"data:image/svg+xml;utf8,{urllib.parse.quote(svg)}"

    if scan_type == 'knee-mri':
        svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" style="background:#05070a">
      <defs>
        <radialGradient id="kneeBone" cx="50%" cy="35%" r="35%">
          <stop offset="0%" stop-color="#e2e8f0"/>
          <stop offset="60%" stop-color="#64748b"/>
          <stop offset="100%" stop-color="#1e293b"/>
        </radialGradient>
      </defs>
      <path d="M 180 60 L 180 200 Q 180 260 210 270 Q 256 280 300 270 Q 330 260 330 200 L 330 60 Z" fill="url(#kneeBone)" stroke="#cbd5e1" stroke-width="4"/>
      <path d="M 160 310 Q 256 295 350 310 L 330 460 L 180 460 Z" fill="url(#kneeBone)" stroke="#cbd5e1" stroke-width="4"/>
      <ellipse cx="256" cy="285" rx="90" ry="12" fill="#0f172a" stroke="#38bdf8" stroke-width="3" opacity="0.8"/>
      <ellipse cx="210" cy="285" rx="28" ry="7" fill="#0284c7" opacity="0.6"/>
      <ellipse cx="302" cy="285" rx="28" ry="7" fill="#0284c7" opacity="0.6"/>
      <ellipse cx="145" cy="210" rx="22" ry="42" fill="#cbd5e1" opacity="0.75"/>
      <path d="M 230 260 L 280 310" stroke="#f43f5e" stroke-width="4" stroke-dasharray="4" opacity="0.7"/>
      <text x="20" y="35" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">MRI KNEE SAGITTAL</text>
      <text x="20" y="55" fill="#94a3b8" font-family="monospace" font-size="11">SLICE: {slice_index}/{total_slices} | TE: 38ms TR: 2800ms</text>
      <text x="440" y="35" fill="#f59e0b" font-family="monospace" font-size="16" font-weight="bold">L</text>
      <text x="20" y="490" fill="#64748b" font-family="monospace" font-size="11">SMG 3.0T MRI</text>
      <text x="410" y="490" fill="#64748b" font-family="monospace" font-size="11">W: 800 L: 450</text>
    </svg>"""
        return f"data:image/svg+xml;utf8,{urllib.parse.quote(svg)}"

    if scan_type == 'brain-sagittal':
        svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" style="background:#05070a">
      <ellipse cx="240" cy="240" rx="140" ry="170" fill="#1e293b" stroke="#cbd5e1" stroke-width="6"/>
      <ellipse cx="240" cy="230" rx="120" ry="145" fill="#334155"/>
      <path d="M 200 220 Q 240 180 280 220 Q 240 200 200 220 Z" fill="#f8fafc" opacity="0.9"/>
      <ellipse cx="250" cy="270" rx="18" ry="12" fill="#94a3b8"/>
      <ellipse cx="240" cy="330" rx="42" ry="32" fill="#475569" stroke="#94a3b8" stroke-width="2"/>
      <rect x="235" y="360" width="24" height="70" fill="#64748b" rx="4"/>
      <ellipse cx="140" cy="250" rx="12" ry="18" fill="#e2e8f0" opacity="0.6"/>
      <text x="20" y="35" fill="#a855f7" font-family="monospace" font-size="12" font-weight="bold">MRI BRAIN SAGITTAL T1</text>
      <text x="20" y="55" fill="#94a3b8" font-family="monospace" font-size="11">SLICE: {slice_index}/{total_slices} | THK: 1.0mm</text>
      <text x="20" y="490" fill="#64748b" font-family="monospace" font-size="11">SMG NEURO IMAGING</text>
      <text x="410" y="490" fill="#64748b" font-family="monospace" font-size="11">W: 650 L: 350</text>
    </svg>"""
        return f"data:image/svg+xml;utf8,{urllib.parse.quote(svg)}"

    if scan_type == 'brain-coronal':
        svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" style="background:#05070a">
      <ellipse cx="256" cy="245" rx="150" ry="175" fill="#1e293b" stroke="#cbd5e1" stroke-width="6"/>
      <ellipse cx="256" cy="245" rx="130" ry="155" fill="#334155"/>
      <ellipse cx="210" cy="235" rx="18" ry="36" fill="#090d16" stroke="#64748b" stroke-width="2"/>
      <ellipse cx="302" cy="235" rx="18" ry="36" fill="#090d16" stroke="#64748b" stroke-width="2"/>
      <ellipse cx="170" cy="285" rx="20" ry="14" fill="#64748b"/>
      <ellipse cx="342" cy="285" rx="20" ry="14" fill="#64748b"/>
      <line x1="256" y1="100" x2="256" y2="400" stroke="#0f172a" stroke-width="3"/>
      <text x="20" y="35" fill="#06b6d4" font-family="monospace" font-size="12" font-weight="bold">MRI BRAIN CORONAL FLAIR</text>
      <text x="20" y="55" fill="#94a3b8" font-family="monospace" font-size="11">SLICE: {slice_index}/{total_slices}</text>
      <text x="440" y="35" fill="#f59e0b" font-family="monospace" font-size="16" font-weight="bold">R</text>
      <text x="20" y="490" fill="#64748b" font-family="monospace" font-size="11">SMG NEURO IMAGING</text>
      <text x="410" y="490" fill="#64748b" font-family="monospace" font-size="11">W: 900 L: 420</text>
    </svg>"""
        return f"data:image/svg+xml;utf8,{urllib.parse.quote(svg)}"

    # Default: brain-axial
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" style="background:#05070a">
      <ellipse cx="256" cy="256" rx="160" ry="195" fill="#1e293b" stroke="#cbd5e1" stroke-width="6"/>
      <ellipse cx="256" cy="256" rx="140" ry="175" fill="#334155"/>
      <ellipse cx="225" cy="235" rx="16" ry="42" fill="#090d16" stroke="#64748b" stroke-width="2"/>
      <ellipse cx="287" cy="235" rx="16" ry="42" fill="#090d16" stroke="#64748b" stroke-width="2"/>
      <line x1="256" y1="90" x2="256" y2="420" stroke="#0f172a" stroke-width="3"/>
      <ellipse cx="256" cy="285" rx="8" ry="18" fill="#090d16"/>
      <circle cx="205" cy="265" r="14" fill="#475569" opacity="0.8"/>
      <circle cx="307" cy="265" r="14" fill="#475569" opacity="0.8"/>
      <text x="20" y="35" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">MRI BRAIN AXIAL T2</text>
      <text x="20" y="55" fill="#94a3b8" font-family="monospace" font-size="11">SLICE: {slice_index}/{total_slices} | FOV: 220mm</text>
      <text x="440" y="35" fill="#f59e0b" font-family="monospace" font-size="16" font-weight="bold">R</text>
      <text x="20" y="490" fill="#64748b" font-family="monospace" font-size="11">SMG NOVENA 3T</text>
      <text x="410" y="490" fill="#64748b" font-family="monospace" font-size="11">W: 750 L: 380</text>
    </svg>"""
    return f"data:image/svg+xml;utf8,{urllib.parse.quote(svg)}"
