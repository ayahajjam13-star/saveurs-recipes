import { Link } from 'react-router-dom';

function About() {
  const stats = [
    { number: '120', label: 'Recipes', icon: '🍽️' },
    { number: '20+', label: 'Countries', icon: '🌍' },
    { number: '4', label: 'Seasons', icon: '🍂' },
    { number: '100%', label: 'Free', icon: '✨' },
  ];

  const features = [
    {
      icon: '🌍',
      title: 'Global Cuisine',
      description: 'Recipes from Italy, Japan, Morocco, Mexico, Thailand, and many more countries.'
    },
    {
      icon: '🍂',
      title: 'Seasonal Selection',
      description: 'Discover recipes perfectly suited for each season. Cook with what\'s fresh.'
    },
    {
      icon: '❤️',
      title: 'Save Favorites',
      description: 'Create your personal collection of favorite recipes with a simple click.'
    },
    {
      icon: '🔍',
      title: 'Easy Search',
      description: 'Find any recipe by name or explore by country and cuisine type.'
    },
  ];

  return (
    <div className="animate-fade-in">
      
      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600&q=80"
            alt="Cooking"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-warm-brown/90 via-warm-brown/70 to-warm-brown/50"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <p className="text-orange-accent font-medium tracking-widest uppercase text-sm mb-4">
            Our Story
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-cream leading-tight mb-6">
            Cooking with
            <span className="block text-orange-accent italic">passion</span>
          </h1>
          <p className="text-lg text-cream/80 max-w-2xl mx-auto leading-relaxed">
            Saveurs was born from a simple idea: good food should follow the seasons, 
            and great recipes should be shared with the world.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 shadow-lg border border-warm-brown/5 text-center">
              <p className="text-4xl mb-2">{stat.icon}</p>
              <p className="font-serif text-4xl font-bold text-orange-accent mb-1">{stat.number}</p>
              <p className="text-sm text-warm-brown/60 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-warm-brown mb-6">
            Why Saveurs?
          </h2>
          <p className="text-lg text-warm-brown/70 leading-relaxed">
            We believe that cooking is more than just following instructions — 
            it's about connecting with the seasons, exploring cultures, and 
            creating memories around the table.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-8 shadow-sm border border-warm-brown/5 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="w-14 h-14 bg-orange-accent/10 rounded-2xl flex items-center justify-center text-3xl mb-5">
                {feature.icon}
              </div>
              <h3 className="font-serif text-2xl font-bold text-warm-brown mb-3">
                {feature.title}
              </h3>
              <p className="text-warm-brown/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-warm-brown to-warm-brown/90 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-cream mb-6">
            Ready to start cooking?
          </h2>
          <p className="text-cream/70 text-lg mb-10">
            Explore 120 recipes from around the world, organized by season.
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-orange-accent text-white rounded-2xl font-semibold hover:bg-orange-accent/90 transition-all hover:scale-105 shadow-lg shadow-orange-accent/30"
          >
            🍽️ Browse Recipes
          </Link>
        </div>
      </section>

    </div>
  );
}

export default About;