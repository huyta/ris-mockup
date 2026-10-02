import React, { useState, useRef } from 'react';
import { ImagingStudy, StudySeries } from '../../types/portal';
import {
  ZoomIn,
  ZoomOut,
  Move,
  Sun,
  RotateCw,
  SlidersHorizontal,
  Ruler,
  RotateCcw,
  Maximize2,
  FileText,
  ArrowLeft,
  Layers,
  ChevronLeft,
  ChevronRight,
  Info,
  Check
} from 'lucide-react';

interface MedicalViewerProps {
  study: ImagingStudy;
  onBackClick: () => void;
  onReportClick?: () => void;
  viewerMode?: 'mock' | 'meddream';
}

export const MedicalViewer: React.FC<MedicalViewerProps> = ({
  study,
  onBackClick,
  onReportClick,
  viewerMode = 'mock'
}) => {
  const [selectedSeriesIndex, setSelectedSeriesIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Viewer state
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [invert, setInvert] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1040);
  const [windowLevel, setWindowLevel] = useState(520);
  const [activeTool, setActiveTool] = useState<'pan' | 'wl' | 'measure' | 'none'>('none');
  const [isPanDragging, setIsPanDragging] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [measureLength, setMeasureLength] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHud, setShowHud] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentSeries: StudySeries | undefined = study.series[selectedSeriesIndex] || study.series[0];
  const images = currentSeries?.images || [];
  const currentImage = images[selectedImageIndex] || currentSeries?.thumbnail || '';

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 400));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleInvert = () => setInvert((prev) => !prev);
  const handleReset = () => {
    setZoom(100);
    setRotation(0);
    setInvert(false);
    setWindowWidth(1040);
    setWindowLevel(520);
    setPanOffset({ x: 0, y: 0 });
    setActiveTool('none');
    setMeasureLength(null);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Mouse pan simulation
  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'pan') {
      setIsPanDragging(true);
    } else if (activeTool === 'measure') {
      // Simulate caliper measurement
      setMeasureLength(34.8);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanDragging && activeTool === 'pan') {
      setPanOffset((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    }
  };

  const handleMouseUp = () => {
    setIsPanDragging(false);
  };

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#05070a',
        color: '#f8fafc',
        fontFamily: 'var(--font-sans)',
        userSelect: 'none',
        position: 'relative'
      }}
      onMouseUp={handleMouseUp}
    >
      {/* Top Viewer Header Bar */}
      <header
        style={{
          height: '52px',
          backgroundColor: '#0f172a',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          zIndex: 20
        }}
      >
        {/* Back and Study title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={onBackClick}
            className="btn btn-secondary btn-sm"
            style={{ backgroundColor: '#1e293b', color: '#f8fafc', borderColor: '#334155' }}
            title="Back to Study Details"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>

          <div style={{ height: '24px', width: '1px', backgroundColor: '#334155' }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#38bdf8' }}>
                {study.description}
              </span>
              <span className="badge badge-modality" style={{ backgroundColor: '#1e293b', color: '#38bdf8', borderColor: '#0284c7' }}>
                {study.modality}
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
              Acc: {study.accessionNumber} • {study.studyDate} • {study.facility}
            </div>
          </div>
        </div>

        {/* Patient banner center */}
        <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#ffffff' }}>
              {study.patientName}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
              ID: {study.patientId} • DOB: {study.patientDob} • {study.gender}
            </div>
          </div>
        </div>

        {/* Right actions: Jump to Report */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              fontSize: '0.7rem',
              color: '#38bdf8',
              backgroundColor: 'rgba(2, 132, 199, 0.2)',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}
          >
            MedDream DICOM Shell
          </div>

          {study.status === 'REPORTED' && onReportClick && (
            <button
              onClick={onReportClick}
              className="btn btn-sm"
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                fontWeight: 600
              }}
              title="Open Final Radiology Report"
            >
              <FileText size={14} />
              <span>View Report</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace: Left Series List + Center Canvas + Right Metadata */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Left Series Thumbnails Ribbon */}
        <aside
          style={{
            width: '180px',
            backgroundColor: '#0a0e17',
            borderRight: '1px solid #1e293b',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: '0.5rem',
            gap: '0.5rem',
            zIndex: 10
          }}
        >
          <div
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '0.25rem 0.4rem'
            }}
          >
            Series ({study.series.length})
          </div>

          {study.series.map((ser, index) => {
            const isSelected = selectedSeriesIndex === index;
            return (
              <div
                key={ser.id}
                onClick={() => {
                  setSelectedSeriesIndex(index);
                  setSelectedImageIndex(0);
                }}
                style={{
                  border: isSelected ? '2px solid #0284c7' : '1px solid #1e293b',
                  borderRadius: '6px',
                  backgroundColor: isSelected ? 'rgba(2, 132, 199, 0.15)' : '#0f172a',
                  padding: '0.35rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = '#334155';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.borderColor = '#1e293b';
                }}
              >
                <div
                  style={{
                    height: '90px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    backgroundColor: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    src={ser.thumbnail}
                    alt={ser.description}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div style={{ marginTop: '0.35rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: isSelected ? '#38bdf8' : '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ser.plane} • Ser {ser.seriesNumber}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ser.description}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                    {ser.images.length} images
                  </div>
                </div>
              </div>
            );
          })}
        </aside>

        {/* Center Main Viewport */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
            cursor: activeTool === 'pan' ? (isPanDragging ? 'grabbing' : 'grab') : activeTool === 'measure' ? 'crosshair' : 'default'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        >
          {/* DICOM Overlays - Top Left */}
          {showHud && (
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#38bdf8',
                lineHeight: 1.4,
                pointerEvents: 'none',
                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                zIndex: 10
              }}
            >
              <div>{study.patientName.toUpperCase()}</div>
              <div>ID: {study.patientId}</div>
              <div>DOB: {study.patientDob}</div>
              <div>{study.facility}</div>
            </div>
          )}

          {/* DICOM Overlays - Top Right */}
          {showHud && (
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#38bdf8',
                textAlign: 'right',
                lineHeight: 1.4,
                pointerEvents: 'none',
                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                zIndex: 10
              }}
            >
              <div>{study.description}</div>
              <div>Study Date: {study.studyDate}</div>
              <div>Acc: {study.accessionNumber}</div>
              <div>Rad: {study.radiologist}</div>
            </div>
          )}

          {/* DICOM Overlays - Bottom Left */}
          {showHud && (
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#94a3b8',
                lineHeight: 1.4,
                pointerEvents: 'none',
                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                zIndex: 10
              }}
            >
              <div>Series: {currentSeries?.seriesNumber || 1} ({currentSeries?.plane || 'Axial'})</div>
              <div style={{ color: '#38bdf8' }}>Image: {selectedImageIndex + 1} / {images.length || 1}</div>
              <div>Thickness: 5.0 mm</div>
            </div>
          )}

          {/* DICOM Overlays - Bottom Right */}
          {showHud && (
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#94a3b8',
                textAlign: 'right',
                lineHeight: 1.4,
                pointerEvents: 'none',
                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                zIndex: 10
              }}
            >
              <div style={{ color: '#38bdf8' }}>Zoom: {zoom}%</div>
              <div>W: {windowWidth} L: {windowLevel}</div>
              <div>Rotation: {rotation}°</div>
              {invert && <div style={{ color: '#f59e0b' }}>Inverted: ON</div>}
              {measureLength && <div style={{ color: '#10b981', fontWeight: 'bold' }}>Distance: {measureLength} mm</div>}
            </div>
          )}

          {/* Slice Carousel / Stepper Buttons */}
          {images.length > 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(8px)',
                border: '1px solid #334155',
                borderRadius: '20px',
                padding: '0.3rem 0.75rem',
                zIndex: 15
              }}
            >
              <button
                onClick={() => setSelectedImageIndex((prev) => Math.max(prev - 1, 0))}
                disabled={selectedImageIndex === 0}
                style={{ color: '#ffffff', opacity: selectedImageIndex === 0 ? 0.4 : 1 }}
              >
                <ChevronLeft size={16} />
              </button>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                Slice {selectedImageIndex + 1} of {images.length}
              </span>
              <button
                onClick={() => setSelectedImageIndex((prev) => Math.min(prev + 1, images.length - 1))}
                disabled={selectedImageIndex === images.length - 1}
                style={{ color: '#ffffff', opacity: selectedImageIndex === images.length - 1 ? 0.4 : 1 }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* The Radiology Image Element with Transforms */}
          <div
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom / 100}) rotate(${rotation}deg)`,
              filter: `${invert ? 'invert(1) hue-rotate(180deg)' : 'none'} contrast(${windowWidth / 1000}) brightness(${windowLevel / 500})`,
              transition: isPanDragging ? 'none' : 'transform 0.15s ease, filter 0.15s ease',
              maxWidth: '85%',
              maxHeight: '85%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <img
              src={currentImage}
              alt="DICOM Slice"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', pointerEvents: 'none' }}
            />

            {/* Measurement overlay caliper if active */}
            {measureLength && (
              <div
                style={{
                  position: 'absolute',
                  top: '40%',
                  left: '30%',
                  width: '120px',
                  height: '2px',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 6px #10b981'
                }}
              >
                <div style={{ position: 'absolute', left: '-4px', top: '-4px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <div style={{ position: 'absolute', right: '-4px', top: '-4px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <div style={{ position: 'absolute', top: '-20px', left: '20px', color: '#10b981', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
                  {measureLength} mm
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Floating Control Dock */}
      <footer
        style={{
          height: '56px',
          backgroundColor: '#0f172a',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          zIndex: 20
        }}
      >
        {/* Tool Dock Left: Navigation info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
          <span>Tool: <strong style={{ color: '#38bdf8' }}>{activeTool.toUpperCase()}</strong></span>
        </div>

        {/* Center Control Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={handleZoomIn}
            className="btn btn-secondary btn-sm"
            style={{ backgroundColor: '#1e293b', color: '#f8fafc', borderColor: '#334155' }}
            title="Zoom In (+25%)"
          >
            <ZoomIn size={15} />
            <span>Zoom +</span>
          </button>

          <button
            onClick={handleZoomOut}
            className="btn btn-secondary btn-sm"
            style={{ backgroundColor: '#1e293b', color: '#f8fafc', borderColor: '#334155' }}
            title="Zoom Out (-25%)"
          >
            <ZoomOut size={15} />
            <span>Zoom -</span>
          </button>

          <button
            onClick={() => setActiveTool(activeTool === 'pan' ? 'none' : 'pan')}
            className="btn btn-secondary btn-sm"
            style={{
              backgroundColor: activeTool === 'pan' ? '#0284c7' : '#1e293b',
              color: '#ffffff',
              borderColor: activeTool === 'pan' ? '#0284c7' : '#334155'
            }}
            title="Pan (Drag to move image)"
          >
            <Move size={15} />
            <span>Pan</span>
          </button>

          <button
            onClick={() => {
              // Toggle standard Window Presets
              if (windowWidth === 1040) {
                setWindowWidth(1500);
                setWindowLevel(300);
              } else if (windowWidth === 1500) {
                setWindowWidth(400);
                setWindowLevel(40);
              } else {
                setWindowWidth(1040);
                setWindowLevel(520);
              }
            }}
            className="btn btn-secondary btn-sm"
            style={{ backgroundColor: '#1e293b', color: '#f8fafc', borderColor: '#334155' }}
            title="Window/Level Presets (Bone / Brain / Soft Tissue)"
          >
            <Sun size={15} />
            <span>W/L Preset</span>
          </button>

          <button
            onClick={handleInvert}
            className="btn btn-secondary btn-sm"
            style={{
              backgroundColor: invert ? '#0284c7' : '#1e293b',
              color: '#ffffff',
              borderColor: invert ? '#0284c7' : '#334155'
            }}
            title="Invert Grayscale"
          >
            <SlidersHorizontal size={15} />
            <span>Invert</span>
          </button>

          <button
            onClick={handleRotate}
            className="btn btn-secondary btn-sm"
            style={{ backgroundColor: '#1e293b', color: '#f8fafc', borderColor: '#334155' }}
            title="Rotate 90°"
          >
            <RotateCw size={15} />
            <span>Rotate</span>
          </button>

          <button
            onClick={() => setActiveTool(activeTool === 'measure' ? 'none' : 'measure')}
            className="btn btn-secondary btn-sm"
            style={{
              backgroundColor: activeTool === 'measure' ? '#10b981' : '#1e293b',
              color: '#ffffff',
              borderColor: activeTool === 'measure' ? '#10b981' : '#334155'
            }}
            title="Measure Caliper (Distance ruler)"
          >
            <Ruler size={15} />
            <span>Measure</span>
          </button>

          <button
            onClick={handleReset}
            className="btn btn-secondary btn-sm"
            style={{ backgroundColor: '#1e293b', color: '#f87171', borderColor: '#334155' }}
            title="Reset All Image Settings"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        </div>

        {/* Right Dock: Fullscreen & HUD toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setShowHud(!showHud)}
            className="btn btn-secondary btn-sm"
            style={{ backgroundColor: '#1e293b', color: '#94a3b8', borderColor: '#334155' }}
            title="Toggle DICOM HUD Annotations"
          >
            <Info size={14} />
            <span>HUD</span>
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="btn btn-secondary btn-sm"
            style={{ backgroundColor: '#1e293b', color: '#f8fafc', borderColor: '#334155' }}
            title="Toggle Fullscreen View"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </footer>
    </div>
  );
};
