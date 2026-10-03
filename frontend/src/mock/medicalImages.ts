// Procedural SVG-based high-fidelity DICOM scan visualizations for demo

export function createMedicalScanSvg(
  type: 'brain-axial' | 'brain-sagittal' | 'brain-coronal' | 'knee-mri' | 'chest-xray' | 'ct-abdomen',
  sliceIndex: number = 1,
  totalSlices: number = 24
): string {
  const contrastShift = (sliceIndex % 5) * 4;
  
  if (type === 'chest-xray') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" style="background:%2305070a">
      <defs>
        <radialGradient id="lungL" cx="38%" cy="45%" r="30%">
          <stop offset="0%" stop-color="%23111827"/>
          <stop offset="60%" stop-color="%231f2937"/>
          <stop offset="100%" stop-color="%23374151"/>
        </radialGradient>
        <radialGradient id="lungR" cx="62%" cy="45%" r="30%">
          <stop offset="0%" stop-color="%23111827"/>
          <stop offset="60%" stop-color="%231f2937"/>
          <stop offset="100%" stop-color="%23374151"/>
        </radialGradient>
      </defs>
      <!-- Spine & mediastinum -->
      <rect x="246" y="80" width="20" height="340" fill="%2394a3b8" opacity="0.85" rx="3"/>
      <!-- Heart silhouette -->
      <path d="M 230 220 Q 210 320 280 340 Q 320 330 270 240 Z" fill="%23cbd5e1" opacity="0.8"/>
      <!-- Ribs cage left -->
      <path d="M 240 130 Q 150 145 130 180" stroke="%2394a3b8" stroke-width="8" fill="none" opacity="0.6"/>
      <path d="M 240 170 Q 140 190 120 230" stroke="%2394a3b8" stroke-width="8" fill="none" opacity="0.6"/>
      <path d="M 240 210 Q 130 235 115 280" stroke="%2394a3b8" stroke-width="8" fill="none" opacity="0.6"/>
      <path d="M 240 250 Q 130 280 120 330" stroke="%2394a3b8" stroke-width="8" fill="none" opacity="0.6"/>
      <!-- Ribs cage right -->
      <path d="M 272 130 Q 362 145 382 180" stroke="%2394a3b8" stroke-width="8" fill="none" opacity="0.6"/>
      <path d="M 272 170 Q 372 190 392 230" stroke="%2394a3b8" stroke-width="8" fill="none" opacity="0.6"/>
      <path d="M 272 210 Q 382 235 397 280" stroke="%2394a3b8" stroke-width="8" fill="none" opacity="0.6"/>
      <path d="M 272 250 Q 382 280 392 330" stroke="%2394a3b8" stroke-width="8" fill="none" opacity="0.6"/>
      <!-- Clavicles -->
      <path d="M 240 110 Q 170 95 100 120" stroke="%23e2e8f0" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.75"/>
      <path d="M 272 110 Q 342 95 412 120" stroke="%23e2e8f0" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.75"/>
      <!-- Lungs dark fields -->
      <path d="M 230 140 C 180 140 135 180 130 280 C 128 320 160 360 210 355 C 230 353 235 280 230 140 Z" fill="url(%23lungL)" opacity="0.65"/>
      <path d="M 282 140 C 332 140 377 180 382 280 C 384 320 352 360 302 355 C 282 353 277 280 282 140 Z" fill="url(%23lungR)" opacity="0.65"/>
      <!-- Diaphragm domes -->
      <path d="M 100 370 Q 180 330 250 370" stroke="%23cbd5e1" stroke-width="10" fill="none" opacity="0.7"/>
      <path d="M 262 370 Q 332 340 412 375" stroke="%23cbd5e1" stroke-width="10" fill="none" opacity="0.7"/>
      <!-- HUD Annotations -->
      <text x="20" y="35" fill="%230284c7" font-family="monospace" font-size="12" font-weight="bold">CHEST PA ERECT</text>
      <text x="20" y="55" fill="%2394a3b8" font-family="monospace" font-size="11">FOV: 350mm | KV: 120</text>
      <text x="440" y="35" fill="%23f59e0b" font-family="monospace" font-size="16" font-weight="bold">R</text>
      <text x="20" y="490" fill="%2364748b" font-family="monospace" font-size="11">SMG RIS PACS DEMO</text>
      <text x="410" y="490" fill="%2364748b" font-family="monospace" font-size="11">W: 1500 L: -500</text>
    </svg>`;
  }

  if (type === 'knee-mri') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" style="background:%2305070a">
      <defs>
        <radialGradient id="kneeBone" cx="50%" cy="35%" r="35%">
          <stop offset="0%" stop-color="%23e2e8f0"/>
          <stop offset="70%" stop-color="%2364748b"/>
          <stop offset="100%" stop-color="%231e293b"/>
        </radialGradient>
      </defs>
      <!-- Distal Femur -->
      <path d="M 180 40 L 332 40 L 340 220 Q 330 270 290 275 Q 256 278 256 260 Q 256 278 222 275 Q 182 270 172 220 Z" fill="url(%23kneeBone)" stroke="%23475569" stroke-width="2"/>
      <!-- Proximal Tibia -->
      <path d="M 170 310 Q 256 295 342 310 L 330 470 L 182 470 Z" fill="url(%23kneeBone)" stroke="%23475569" stroke-width="2"/>
      <!-- Patella -->
      <ellipse cx="150" cy="220" rx="28" ry="42" fill="%23cbd5e1" opacity="0.85"/>
      <!-- Patellar Tendon -->
      <path d="M 150 262 L 180 340" stroke="%2338bdf8" stroke-width="6" stroke-dasharray="3,1" opacity="0.8"/>
      <!-- Meniscus Triangles -->
      <polygon points="190,290 215,290 202,278" fill="%230284c7" opacity="0.9"/>
      <polygon points="322,290 297,290 310,278" fill="%230284c7" opacity="0.9"/>
      <!-- ACL / PCL ligaments simulation -->
      <path d="M 235 270 Q 260 285 275 305" stroke="%23f43f5e" stroke-width="5" fill="none" opacity="0.85"/>
      <path d="M 270 268 Q 250 285 240 310" stroke="%23f59e0b" stroke-width="5" fill="none" opacity="0.85"/>
      <!-- Joint Fluid High-intensity -->
      <ellipse cx="256" cy="285" rx="55" ry="5" fill="%2338bdf8" opacity="0.5"/>
      <!-- HUD Annotations -->
      <text x="20" y="35" fill="%230284c7" font-family="monospace" font-size="12" font-weight="bold">KNEE SAGITTAL T2 FS</text>
      <text x="20" y="55" fill="%2394a3b8" font-family="monospace" font-size="11">TE: 85ms | TR: 3200ms</text>
      <text x="440" y="35" fill="%23f59e0b" font-family="monospace" font-size="16" font-weight="bold">A</text>
      <text x="20" y="490" fill="%2364748b" font-family="monospace" font-size="11">IM: ${sliceIndex} / ${totalSlices}</text>
      <text x="410" y="490" fill="%2364748b" font-family="monospace" font-size="11">W: 820 L: 340</text>
    </svg>`;
  }

  // Default: Brain Axial / Sagittal / Coronal
  const isSagittal = type === 'brain-sagittal';
  const isCoronal = type === 'brain-coronal';
  const planeLabel = isSagittal ? 'SAGITTAL T1' : isCoronal ? 'CORONAL FLAIR' : 'AXIAL T2-FSE';

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" style="background:%2305070a">
    <defs>
      <!-- Brain tissue radial gradient -->
      <radialGradient id="cortexGrad" cx="50%" cy="50%" r="48%">
        <stop offset="0%" stop-color="%23${(30 + contrastShift).toString(16)}3b52"/>
        <stop offset="65%" stop-color="%23${(50 + contrastShift).toString(16)}5b75"/>
        <stop offset="85%" stop-color="%23${(80 + contrastShift).toString(16)}8da5"/>
        <stop offset="100%" stop-color="%231e293b"/>
      </radialGradient>
      <!-- Bone skull gradient -->
      <radialGradient id="skullGrad" cx="50%" cy="50%" r="50%">
        <stop offset="88%" stop-color="%230f172a" stop-opacity="0"/>
        <stop offset="92%" stop-color="%23cbd5e1" stop-opacity="0.9"/>
        <stop offset="98%" stop-color="%23f8fafc" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="%230f172a" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- Outer Scalp -->
    <ellipse cx="256" cy="256" rx="210" ry="235" fill="%231e293b" opacity="0.6"/>
    <!-- Skull bone ring -->
    <ellipse cx="256" cy="256" rx="195" ry="220" fill="url(%23skullGrad)"/>
    <!-- Brain parenchyma -->
    <path d="M 256 60 C 140 60 85 130 85 256 C 85 370 140 440 256 440 C 372 440 427 370 427 256 C 427 130 372 60 256 60 Z" fill="url(%23cortexGrad)"/>
    
    <!-- Hemispheric fissure -->
    <line x1="256" y1="70" x2="256" y2="430" stroke="%23090d16" stroke-width="3" opacity="0.9"/>
    
    <!-- Ventricles (CSF - bright in T2 / dark in T1) -->
    <path d="M 235 210 Q 210 240 215 285 Q 240 270 248 240 Z" fill="%23e0f2fe" opacity="0.85"/>
    <path d="M 277 210 Q 302 240 297 285 Q 272 270 264 240 Z" fill="%23e0f2fe" opacity="0.85"/>
    <!-- 3rd ventricle -->
    <ellipse cx="256" cy="275" rx="5" ry="18" fill="%23e0f2fe" opacity="0.8"/>
    
    <!-- Sulci & Gyri patterns -->
    <path d="M 120 180 Q 160 195 190 175" stroke="%230f172a" stroke-width="3" fill="none" opacity="0.7"/>
    <path d="M 392 180 Q 352 195 322 175" stroke="%230f172a" stroke-width="3" fill="none" opacity="0.7"/>
    <path d="M 105 260 Q 150 255 180 270" stroke="%230f172a" stroke-width="3" fill="none" opacity="0.7"/>
    <path d="M 407 260 Q 362 255 332 270" stroke="%230f172a" stroke-width="3" fill="none" opacity="0.7"/>
    <path d="M 130 340 Q 170 330 200 350" stroke="%230f172a" stroke-width="3" fill="none" opacity="0.7"/>
    <path d="M 382 340 Q 342 330 312 350" stroke="%230f172a" stroke-width="3" fill="none" opacity="0.7"/>
    
    <!-- Thalamus / Basal Ganglia contours -->
    <ellipse cx="225" cy="265" rx="22" ry="16" fill="%23475569" opacity="0.7"/>
    <ellipse cx="287" cy="265" rx="22" ry="16" fill="%23475569" opacity="0.7"/>
    
    <!-- DICOM Overlay / HUD Text -->
    <text x="20" y="32" fill="%2338bdf8" font-family="monospace" font-size="12" font-weight="bold">BRAIN ${planeLabel}</text>
    <text x="20" y="50" fill="%2394a3b8" font-family="monospace" font-size="11">FS: 1.5T | TE: 98 | TR: 4500</text>
    <text x="20" y="68" fill="%2394a3b8" font-family="monospace" font-size="11">THK: 5.0mm | SP: 6.5mm</text>
    
    <text x="440" y="32" fill="%23f59e0b" font-family="monospace" font-size="16" font-weight="bold">${isSagittal ? 'P' : 'R'}</text>
    <text x="250" y="25" fill="%2394a3b8" font-family="monospace" font-size="14" font-weight="bold">A</text>
    <text x="250" y="495" fill="%2394a3b8" font-family="monospace" font-size="14" font-weight="bold">P</text>
    
    <text x="20" y="475" fill="%2364748b" font-family="monospace" font-size="11">SMG MEDICAL CENTRE</text>
    <text x="20" y="495" fill="%2338bdf8" font-family="monospace" font-size="11">SL: ${sliceIndex} / ${totalSlices}</text>
    
    <text x="390" y="475" fill="%2364748b" font-family="monospace" font-size="11">W: 1040 L: 520</text>
    <text x="390" y="495" fill="%2364748b" font-family="monospace" font-size="11">MEDDREAM READY</text>
  </svg>`;
}
