/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // الألوان من صورة الجوافة
        'guava-green': '#87A93D',      // أخضر زيتي غامق
        'guava-light': '#C6D97A',      // أخضر فاتح
        'guava-pink': '#F16D7A',       // وردي جوافة (اللون الأساسي)
        'guava-soft': '#F7A1B3',       // وردي فاتح
        'guava-peach': '#F9E3C7',      // خوخي فاتح (خلفية)
        
        // ألوان مساعدة باش الموقع يبان نقي
        'cream': '#FDFBF7',            // خلفية بيضا دافئة
        'warm-brown': '#2C2A29',       // كحل/بني غامق للنصوص
        'dark-bg': '#1A1A1A',
        'dark-card': '#262626',
        'dark-text': '#F3F4F6',
        
        // خلينا orange-accent باش ما يتخربقش الكود القديم، ولكن عطيناه لون الجوافة
        'orange-accent': '#F16D7A', 
      },
      fontFamily: {
        'serif': ['Poppins', 'sans-serif'], // خط عصري للعناوين
        'sans': ['Inter', 'sans-serif'],    // خط نقي للنصوص
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}