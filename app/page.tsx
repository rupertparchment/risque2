import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Welcome to Risqué
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Baltimore&apos;s Premier Lifestyle Club
          </p>
          <p className="text-lg mb-12 text-gray-300 max-w-2xl mx-auto">
            Modern. Clean. Professional. Finally, a lifestyle venue that puts members first.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/membership"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Become a Member
            </Link>
            <Link
              href="/events"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors border border-white/20"
            >
              View Events
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Choose Risqué?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🚪</div>
              <h3 className="text-2xl font-bold mb-4">No Wait. Ever.</h3>
              <p className="text-gray-600">
                20 private bedrooms available. Never wait for a room again.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🏙️</div>
              <h3 className="text-2xl font-bold mb-4">Discreet Location</h3>
              <p className="text-gray-600">
                Safe, private entrance in Baltimore City. No sketchy neighbors.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-4">Modern & Clean</h3>
              <p className="text-gray-600">
                Everything is new. Professional bathrooms, quality finishes throughout.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-bold mb-4">Professional Staff</h3>
              <p className="text-gray-600">
                Trained, respectful staff. No bad attitudes, no bowling shirts.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🏨</div>
              <h3 className="text-2xl font-bold mb-4">Better Hotels</h3>
              <p className="text-gray-600">
                Upscale hotels nearby. Complete your weekend experience.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-4">One Floor</h3>
              <p className="text-gray-600">
                All rooms on one floor. No steep stairs to navigate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Experience Something Better?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join Risqué and discover a modern lifestyle venue built for members who deserve better.
          </p>
          <Link
            href="/membership"
            className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  )
}
