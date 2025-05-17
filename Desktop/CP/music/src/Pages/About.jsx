import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const  About = () => {
  return (
   
    
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-50 to-amber-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Left side - Text content */}
            <div className="md:w-1/2">
              <Card className="border-none shadow-none bg-transparent">
                <CardHeader>
                  <CardTitle className="text-3xl md:text-4xl font-bold text-left mb-6 text-gray-900">
                    ABOUT US
                  </CardTitle>
                  <h2 className="text-2xl md:text-3xl font-semibold text-left text-gray-800 mb-6">
                    Grow Your Skills For Free With CP SNGEETHA
                  </h2>
                </CardHeader>
                
                <CardContent className="space-y-6 px-0">
                  <p className="text-gray-600 text-left text-lg">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec
                    ullamcorper mattis, pulvinar dapibus leo.
                  </p>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Pellentesque habitant morbi tristique senectus et netus.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Right side - Image */}
            <div className="md:w-1/2">
              <div className="relative aspect-video md:aspect-square rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://us.123rf.com/450wm/watcartoon/watcartoon2307/watcartoon230700037/210184702-music-kids-play-music-concept-of-music-school-cartoon-dancing-kids-and-kids-with-musical-instruments.jpg"
                  alt="Rythme Academy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-100 opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    
  );
}

export default About