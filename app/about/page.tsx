export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          About PDF Guide
        </h1>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
            PDF Guide is your comprehensive solution for all PDF-related tasks. Our platform
            provides an intuitive interface for merging, splitting, and managing PDF files
            efficiently.
          </p>
          <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
            Built with modern web technologies, PDF Guide ensures a seamless experience
            whether you&apos;re a professional handling large documents or an individual
            working with personal files.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">PDF Merging</h3>
              <p className="text-gray-600">Combine multiple PDFs into a single document with ease</p>
            </div>
            <div className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Drag and Drop</h3>
              <p className="text-gray-600">Intuitive interface for easy file handling</p>
            </div>
            <div className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Fast Processing</h3>
              <p className="text-gray-600">Quick and efficient file operations</p>
            </div>
            <div className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Secure</h3>
              <p className="text-gray-600">All files are processed locally on your device</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}