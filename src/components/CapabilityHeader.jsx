import './CapabilityButton.css';

export function CapabilityHeader() {
  return (
    <div className="capability-header-wrap">

      {/* 左侧文字 */}
      <div className="flex flex-col gap-1">
        <div className="text-sm font-medium tracking-[0.2em] text-neutral-400 uppercase">
          03 / 优势
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-800 tracking-tight">
          我的能力
        </h2>
        <p className="text-base md:text-lg text-neutral-500 mt-1 font-normal max-w-lg">
          AI提效、设计表达与工程落地三位一体。
        </p>
      </div>

      {/* 右侧按钮组件 */}
      <div className="button-wrap shrink-0">
        <button>
          <span>查看作品</span>
        </button>
        <div className="button-shadow"></div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="100%"
          width="100%"
          style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
        >
          <defs>
            <pattern patternUnits="userSpaceOnUse" height="30" width="30" id="dottedGrid">
              <circle fill="rgba(0,0,0,0.15)" r="1" cy="2" cx="2"></circle>
            </pattern>
          </defs>
          <rect fill="url(#dottedGrid)" height="100%" width="100%"></rect>
        </svg>
      </div>

    </div>
  );
}
