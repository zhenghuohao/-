// ProjectCards.jsx —— 项目卡片展示组件
export function ProjectCards() {
  const projects = [
    {
      id: 1,
      tag: 'AI 辅助设计',
      title: '数据 × 视觉叙事',
      desc: '用 AI 完成表格清洗与洞察，将复杂数据转化为清晰的可视化视觉叙事，兼顾信息密度与美感。',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 2,
      tag: 'UI / 游戏',
      title: '交互界面设计',
      desc: '独立设计并开发可玩的网页小游戏与交互界面，从游戏逻辑到界面反馈，打造完整的用户体验。',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 3,
      tag: '演示设计',
      title: '演示视觉语言',
      desc: '以 AI + PPT 高效产出结构化演示文稿，建立统一的版式与视觉节奏，让复杂观点被清晰讲述。',
      image: 'https://images.unsplash.com/photo-1555421689-3f034debb7a6?q=80&w=2070&auto=format&fit=crop',
    },
  ]

  return (
    <div className="w-full bg-[#F8F7F4] py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 cursor-pointer group"
          >
            {/* 顶部图片区域 */}
            <div className="relative h-64 w-full">
              {/* 编号徽章 */}
              <div className="absolute top-5 left-5 z-10 bg-white/80 backdrop-blur-sm border border-gray-100 text-gray-700 text-[10px] font-medium rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
                {String(item.id).padStart(2, '0')}
              </div>
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* 底部文字区域 */}
            <div className="p-6 bg-white">
              <div className="text-[#D4A857] text-xs font-medium tracking-wider uppercase mb-2">
                {item.tag}
              </div>
              <h3 className="text-xl font-bold text-gray-800 leading-snug mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectCards
