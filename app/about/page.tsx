export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">About Risqué</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              Risqué is Baltimore&apos;s premier lifestyle club, built for members who deserve better. 
              We&apos;ve listened to what the community wants and created a modern, clean, and professional 
              venue that addresses every common complaint about traditional lifestyle clubs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">What Makes Us Different</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span><strong>No Wait. Ever.</strong> - 20 private bedrooms available at all times</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span><strong>Discreet Location</strong> - Safe, private entrance in Baltimore City</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span><strong>Modern & Clean</strong> - Everything is new, professional bathrooms, quality finishes</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span><strong>Professional Staff</strong> - Trained, respectful, no bad attitudes</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span><strong>One Floor</strong> - All rooms on one level, no steep stairs</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span><strong>Better Hotels</strong> - Upscale hotels nearby for out-of-town members</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Built by Members, for Members</h2>
            <p className="text-gray-700 leading-relaxed">
              We&apos;ve taken every complaint, every suggestion, and every wish from the lifestyle community 
              and built Risqué to address them all. This isn&apos;t just another venue - it&apos;s a fresh start, 
              built from the ground up with members in mind.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-700">
              Have questions? We&apos;d love to hear from you. 
              <a href="/contact" className="text-primary-600 hover:underline ml-1">
                Get in touch
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
